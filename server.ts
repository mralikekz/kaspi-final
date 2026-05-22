import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Endpoint to verify app domain ownership for Pi Network
app.get("/validation-key.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  const key = process.env.PI_VALIDATION_KEY;
  if (!key) {
    res.status(500).send("Error: PI_VALIDATION_KEY is not configured in the environment settings.");
    return;
  }
  res.send(key);
});

// Initialize Gemini API
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined. AI explanations will use cached detailed descriptions.");
}

// Metadata map for our 10 coins
const COIN_METADATA = [
  { symbol: "PI", name: "Pi Network", geckoId: "pi-network-iou", category: "Utility / Network Coin" },
  { symbol: "BTC", name: "Bitcoin", geckoId: "bitcoin", category: "Store of Value" },
  { symbol: "ETH", name: "Ethereum", geckoId: "ethereum", category: "Smart Contracts" },
  { symbol: "XRP", name: "XRP", geckoId: "ripple", category: "Cross-border Payments" },
  { symbol: "HBAR", name: "Hedera", geckoId: "hedera-hashgraph", category: "Enterprise Ledger" },
  { symbol: "ZYPTO", name: "Zypto", geckoId: "zypto", category: "Crypto Payments Ecosystem" },
  { symbol: "XLM", name: "Stellar", geckoId: "stellar", category: "DeFi / Payments" },
  { symbol: "BNB", name: "BNB", geckoId: "binancecoin", category: "Exchange Token / L1" },
  { symbol: "TON", name: "TON", geckoId: "the-open-network", category: "Telegram Ecosystem" },
  { symbol: "TWT", name: "TWT", geckoId: "trust-wallet-token", category: "Wallet Utility" }
];

export const getStaticRank = (symbol: string): number => {
  switch (symbol.toUpperCase()) {
    case "BTC": return 1;
    case "ETH": return 2;
    case "BNB": return 5;
    case "XRP": return 6;
    case "TON": return 10;
    case "XLM": return 15;
    case "HBAR": return 25;
    case "TWT": return 120;
    case "ZYPTO": return 1040;
    case "PI": return 3105;
    default: return 999;
  }
};

export const getStaticMaxSupply = (symbol: string): number | null => {
  switch (symbol.toUpperCase()) {
    case "BTC": return 21000000;
    case "ETH": return null; // Unlimited
    case "BNB": return 200000500;
    case "XRP": return 100000000000;
    case "TON": return null;
    case "XLM": return 50001806812;
    case "HBAR": return 50000000000;
    case "TWT": return 1000000000;
    case "ZYPTO": return 100000000;
    case "PI": return 100000000000;
    default: return null;
  }
};

export const getStaticCirculatingSupply = (symbol: string): number => {
  switch (symbol.toUpperCase()) {
    case "BTC": return 19700000;
    case "ETH": return 120400000;
    case "BNB": return 146000000;
    case "XRP": return 55000000000;
    case "TON": return 2500000000;
    case "XLM": return 29000000000;
    case "HBAR": return 35700000000;
    case "TWT": return 416000000;
    case "ZYPTO": return 89000000;
    case "PI": return 68000000000;
    default: return 0;
  }
};

// In-memory cache to prevent CoinMarketCap or CoinGecko rate limiting
let priceCache: {
  timestamp: number;
  data: any[];
} | null = null;

const CACHE_DURATION_MS = 10000; // 10 seconds cache

// 1. Unified endpoint to fetch real-time crypto prices
app.get("/api/crypto", async (req, res) => {
  const now = Date.now();
  if (priceCache && (now - priceCache.timestamp < CACHE_DURATION_MS)) {
    return res.json({ success: true, source: "cache", data: priceCache.data });
  }

  const symbols = COIN_METADATA.map(c => c.symbol).join(",");
  const cmcKey = process.env.CMC_PRO_API_KEY;

  // Let's first try CoinMarketCap if key exists
  if (cmcKey) {
    try {
      console.log("Fetching live rates from CoinMarketCap...");
      const cmcRes = await fetch(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}&convert=USD`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": cmcKey,
            "Accept": "application/json"
          }
        }
      );

      if (cmcRes.ok) {
        const payload: any = await cmcRes.json();
        const cmcData = payload.data;
        
        const normalizedList = COIN_METADATA.map(coin => {
          const fetched = cmcData[coin.symbol];
          const usdQuote = fetched?.quote?.USD;
          const maxSupplyRaw = fetched?.max_supply;
          const circulatingSupplyRaw = fetched?.circulating_supply;
          return {
            symbol: coin.symbol,
            name: coin.name,
            category: coin.category,
            price: usdQuote?.price || 0,
            change24h: usdQuote?.percent_change_24h || 0,
            marketCap: usdQuote?.market_cap || 0,
            volume24h: usdQuote?.volume_24h || 0,
            lastUpdated: usdQuote?.last_updated || new Date().toISOString(),
            rank: fetched?.cmc_rank || getStaticRank(coin.symbol),
            maxSupply: maxSupplyRaw !== undefined && maxSupplyRaw !== null ? maxSupplyRaw : getStaticMaxSupply(coin.symbol),
            circulatingSupply: circulatingSupplyRaw || (usdQuote?.market_cap && usdQuote?.price ? usdQuote.market_cap / usdQuote.price : getStaticCirculatingSupply(coin.symbol))
          };
        });

        priceCache = { timestamp: now, data: normalizedList };
        return res.json({ success: true, source: "coinmarketcap", data: normalizedList });
      } else {
        console.warn(`CoinMarketCap API responded with status ${cmcRes.status}`);
      }
    } catch (err: any) {
      console.error("CoinMarketCap API request failed, falling back:", err.message);
    }
  }

  // Fallback to CoinGecko (Free API endpoint without authorization or if API key failed/missing)
  try {
    console.log("Fetching from CoinGecko as fallback...");
    const ids = COIN_METADATA.map(c => c.geckoId).join(",");
    const geckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;
    
    const geckoRes = await fetch(geckoUrl);
    if (geckoRes.ok) {
      const geckoData: any = await geckoRes.json();
      
      const normalizedList = COIN_METADATA.map(coin => {
        const rawInfo = geckoData[coin.geckoId];
        const computedCirculating = rawInfo?.usd_market_cap && rawInfo?.usd ? rawInfo.usd_market_cap / rawInfo.usd : getStaticCirculatingSupply(coin.symbol);
        return {
          symbol: coin.symbol,
          name: coin.name,
          category: coin.category,
          price: rawInfo?.usd || 0,
          change24h: rawInfo?.usd_24h_change || 0,
          marketCap: rawInfo?.usd_market_cap || 0,
          volume24h: rawInfo?.usd_24h_vol || 0,
          lastUpdated: new Date().toISOString(),
          rank: getStaticRank(coin.symbol),
          maxSupply: getStaticMaxSupply(coin.symbol),
          circulatingSupply: computedCirculating
        };
      });

      priceCache = { timestamp: now, data: normalizedList };
      return res.json({ success: true, source: "coigecko", data: normalizedList });
    } else {
      console.warn(`CoinGecko responded with status ${geckoRes.status}`);
    }
  } catch (err: any) {
    console.error("CoinGecko API request failed as well:", err.message);
  }

  // Double Fallback: Static / Realistic default prices if APIs are rate-limiting us or offline
  const staticFallback = COIN_METADATA.map(coin => {
    let priceBySymbol = 0;
    let changeBySymbol = 0;
    let capBySymbol = 0;
    let volBySymbol = 0;

    switch (coin.symbol) {
      case "PI": priceBySymbol = 41.25; changeBySymbol = 1.45; capBySymbol = 0; volBySymbol = 3521040; break;
      case "BTC": priceBySymbol = 89450.00; changeBySymbol = -1.12; capBySymbol = 1750400120100; volBySymbol = 28100500120; break;
      case "ETH": priceBySymbol = 2740.15; changeBySymbol = 0.85; capBySymbol = 329100500600; volBySymbol = 14500100200; break;
      case "XRP": priceBySymbol = 1.15; changeBySymbol = -2.41; capBySymbol = 65000210340; volBySymbol = 1200150200; break;
      case "HBAR": priceBySymbol = 0.125; changeBySymbol = 4.21; capBySymbol = 4250100200; volBySymbol = 152010400; break;
      case "ZYPTO": priceBySymbol = 0.0185; changeBySymbol = -3.15; capBySymbol = 18500120; volBySymbol = 345100; break;
      case "XLM": priceBySymbol = 0.222; changeBySymbol = 0.52; capBySymbol = 6450120300; volBySymbol = 230100500; break;
      case "BNB": priceBySymbol = 582.40; changeBySymbol = -0.45; capBySymbol = 85210040500; volBySymbol = 980120300; break;
      case "TON": priceBySymbol = 5.12; changeBySymbol = 2.18; capBySymbol = 12900410200; volBySymbol = 185040300; break;
      case "TWT": priceBySymbol = 1.05; changeBySymbol = -1.88; capBySymbol = 430150200; volBySymbol = 12040100; break;
    }

    return {
      symbol: coin.symbol,
      name: coin.name,
      category: coin.category,
      price: priceBySymbol,
      change24h: changeBySymbol,
      marketCap: capBySymbol,
      volume24h: volBySymbol,
      lastUpdated: new Date().toISOString(),
      rank: getStaticRank(coin.symbol),
      maxSupply: getStaticMaxSupply(coin.symbol),
      circulatingSupply: capBySymbol && priceBySymbol ? capBySymbol / priceBySymbol : getStaticCirculatingSupply(coin.symbol)
    };
  });

  res.json({ success: true, source: "local_cache_simulation", data: staticFallback });
});

// Static coin details helper for background knowledge
const STATIC_COIN_DESC: { [key: string]: { EN: string; RU: string; ZH: string; FR: string; AR: string; HI: string; ES: string } } = {
  PI: {
    EN: "Pi Network is a dynamic social crypto initiative. It provides standard security protocols and user-controlled utility to millions of Pioneers. It features simple token allocations through an eye-safe mobile companion interface.",
    RU: "Pi Network — это инновационный проект социальной криптовалюты. Он обеспечивает безопасность и пользовательскую полезность для миллионов Пионеров со всего мира через легкий мобильный интерфейс.",
    ZH: "Pi Network 是一项开创性的社交加密货币项目。它为全球数百万先驱者提供了高度安全的机制和用户掌控的应用场景，通过简洁的移动端伴随界面提供便利的代币分发。",
    FR: "Pi Network est une initiative crypto sociale innovante. Elle offre des protocoles de sécurité robustes et une utilité contrôlée par l'utilisateur à des millions de Pionniers à travers une interface mobile fluide.",
    AR: "إن شبكة Pi Network هي مبادرة تشفير اجتماعية مبتكرة. توفر بروتوكولات أمان قوية وفائدة يتحكم فيها المستخدم لملايين الرواد (Pioneers) عبر واجهة هاتف وتطبيق مرافق مريح.",
    HI: "Pi Network एक अभिनव सामाजिक क्रिप्टो परियोजना है। यह एक सुंदर और आसान मोबाइल इंटरफ़ेस के माध्यम से लाखों पायनियर्स को सुरक्षा और उपयोगकर्ता-नियंत्रित उपयोगिता प्रदान करता है।",
    ES: "Pi Network es una iniciativa criptográfica social e innovadora. Ofrece de forma gratuita protocolos de seguridad sólidos y utilidad controlada por el usuario para millones de Pioneros a través de una interfaz móvil intuitiva."
  },
  BTC: {
    EN: "Bitcoin is the premier digital asset and store of value. It functions as a decentralized consensus engine with highly customized programmatic supply distributions.",
    RU: "Bitcoin — первая и главная цифровая валюта, а также средство сбережения. Он функционирует как децентрализованная система на алгоритме консенсуса, гарантирующая ограниченную эмиссию.",
    ZH: "比特币（Bitcoin）是世界上首个也是最主要的数字资产和价值存储手段。它依靠去中心化的共识引擎运行，并具有严格限制的程序化供应分配。",
    FR: "Le Bitcoin est le premier actif numérique et la principale réserve de valeur. Il fonctionne comme un moteur de consensus décentralisé avec des distributions d'approvisionnement limitées et prévisibles.",
    AR: "البيتكوين (Bitcoin) هو الأصل الرقمي الأول ومستودع القيمة الرئيسي في العالم. يعمل كمحرك توافقي لا مركزي مع توزيعات إمداد مبرمجة ومحدودة للغاية.",
    HI: "बिटकॉइन (Bitcoin) दुनिया की पहली और सबसे बड़ी डिजिटल मुद्रा और मूल्य का भंडार है। यह एक विकेन्द्रीकृत सर्वसम्मति इंजन के रूप में कार्य करता है, जो सीमित आपूर्ति वितरण की गारंटी देता है।",
    ES: "Bitcoin es el activo digital pionero y la principal reserva de valor mundial. Funciona como un motor de consenso descentralizado con una emisión programada estrictamente limitada."
  },
  ETH: {
    EN: "Ethereum is the leading decentralized hub of programmable smart structures. It hosts thousands of decentralized utility layers and customized virtual workspaces.",
    RU: "Ethereum — ведущая децентрализованная платформа для исполняемых смарт-контрактов. На ней развернуты тысячи практических приложений и пользовательских криптографических реестров.",
    ZH: "以太坊（Ethereum）是可编程智能合约的领先去中心化平台。它托管了数千个去中心化应用层和定制的虚拟工作空间。",
    FR: "Ethereum est la principale plateforme décentralisée pour les contrats intelligents programmables. Elle héberge des milliers d'applications décentralisées et de registres cryptographiques.",
    AR: "إيثريوم (Ethereum) هو المنصة اللامركزية الرائدة للعقود الذكية القابلة للبرمجة. ويستضيف الآلاف من التطبيقات اللامركزية والمساحات المبرمجة بالكامل.",
    HI: "इथेरियम (Ethereum) प्रोग्राम करने योग्य स्मार्ट कॉन्ट्रैक्ट्स का अग्रणी विकेन्द्रीकृत मंच है। यह हजारों विकेन्द्रीकृत अनुप्रयोगों और क्रिप्टो रजिस्टरों की मेजबानी करता है।",
    ES: "Ethereum es la plataforma descentralizada líder para contratos inteligentes programables. Alberga miles de aplicaciones descentralizadas y espacios de trabajo criptográficos."
  },
  XRP: {
    EN: "XRP is an ultra-fast institutional utility token optimized for immediate cross-border balance settlements.",
    RU: "XRP — высокоскоростной служебный токен, созданный институциональной сетью Ripple для мгновенных международных платежей и расчетов с минимальной комиссией.",
    ZH: "XRP 是一种超快速的机构实用型代币，专为即时且极低费用的跨国资金跨境结算而进行了深度优化。",
    FR: "XRP est un jeton utilitaire ultra-rapide optimisé pour les règlements transfrontaliers instantanés avec des frais de transaction minimes.",
    AR: "XRP هو رمز خدمة فائق السرعة تم تحسينه من قبل شركة Ripple لإجراء تسويات مالية فورية عبر الحدود بأقل الرسوم.",
    HI: "XRP एक सुपर-फास्ट उपयोगिता टोकन है, जिसे न्यूनतम शुल्क के साथ तत्काल सीमा पार भुगतान और निपटान के लिए अनुकूलित किया गया है।",
    ES: "XRP es un token de utilidad ultra rápido optimizado por Ripple para liquidaciones de fondos transfronterizas instantáneas con tarifas mínimas."
  },
  HBAR: {
    EN: "Hedera is a unique enterprise-grade hashgraph architecture. It delivers lightning-fast processing parameters alongside guaranteed decentralized coordination metrics.",
    RU: "Hedera — уникальная сеть корпоративного класса на технологии хэшграф. Она обладает высочайшей скоростью проведения транзакций и надежной моделью децентрализации.",
    ZH: "Hedera 采用独特的企业级哈希图（Hashgraph）架构。它提供了极速的交易处理指标以及可靠的去中心化协作机制。",
    FR: "Hedera utilise une architecture hashgraph unique de classe entreprise. Elle offre un traitement ultra-rapide associé à une décentralisation et une coordination garanties.",
    AR: "هيديرا (Hedera) هي شبكة فريدة من الفئة المؤسسية تعتمد على تقنية هاش غراف (Hashgraph). وتتميز بسرعة معالجة فائقة ونموذج تنسيق لا مركزي موثوق.",
    HI: "Hedera हैशग्राफ (Hashgraph) तकनीक पर आधारित एक अनूठा एंटरप्राइज-ग्रेड नेटवर्क है। यह अत्यधिक लेनदेन गति और विश्वसनीय विकेंद्रीकरण मॉडल प्रदान करता है।",
    ES: "Hedera utiliza una arquitectura hashgraph de grado empresarial que es única. Ofrece un procesamiento ultra rápido junto con garantías de gobernanza y coordinación descentralizada."
  },
  ZYPTO: {
    EN: "Zypto is an elegant payment infrastructure offering custom crypto cards, decentralized visual wallets, and retail gateway capabilities.",
    RU: "Zypto — современная платежная крипто-экосистема, которая предлагает дебетовые криптокарты, децентрализованные кошельки и решения для обработки платежей торговцев.",
    ZH: "Zypto 是一种美观的支付生态系统，提供定制的加密卡、去中心化的可视化钱包以及零售通道网关功能。",
    FR: "Zypto est une infrastructure de paiement moderne proposant des cartes crypto personnalisées, des portefeuilles décentralisés et des solutions de passerelle de vente.",
    AR: "زيبتو (Zypto) هو نظام دفع حديث يقدم بطاقات تشفير مخصصة، ومحافظ لا descentralized مرئية، وحلول بوابة الدفع للتجزئة والتجار.",
    HI: "Zypto एक आधुनिक भुगतान क्रिप्टो-पारिस्थितिकी तंत्र है जो क्रिप्टो डेबिट कार्ड, विकेन्द्रीकृत वॉलेट और रिटेल गेटवे समाधान प्रदान करता है।",
    ES: "Zypto es una infraestructura de pago moderna que ofrece tarjetas criptográficas personalizadas, billeteras descentralizadas y soluciones de pasarela de pago para comercios."
  },
  XLM: {
    EN: "Stellar is an open payment framework matching peer-to-peer balance settlements globally with minimal transaction fees.",
    RU: "Stellar — открытая распределенная сеть для мгновенных одноранговых платежей по всему миру с практически нулевыми комиссиями за совершение транзакций.",
    ZH: "Stellar 是一种开放式支付框架，以极低的手续费在世界范围内无缝提携点对点资金划转。",
    FR: "Stellar est un réseau de paiement ouvert facilitant les transferts de fonds de pair à pair à l'échelle mondiale avec des frais minimes.",
    AR: "ستيلار (Stellar) هي شبكة دفع مفتوحة تسهل تسوية المبالغ الفورية بين الأطراف عالميًا بأقل رسوم ممكنة.",
    HI: "Stellar एक खुला भुगतान ढांचा है जो न्यूनतम लेनदेन शुल्क के साथ विश्व स्तर पर पीयर-टू-पीयर भुगतान को सुगम बनाता है।",
    ES: "Stellar es una red de pago abierta diseñada para facilitar transferencias de fondos de igual a igual (P2P) a nivel mundial con tarifas mínimas."
  },
  BNB: {
    EN: "BNB acts as the utility center of the BNB chain. It fuels millions of token swaps, decentralized smart nodes, and payment systems globally.",
    RU: "BNB выступает в качестве главного утилитарного токена сети BNB Chain. Он обеспечивает миллионы смарт-контрактов, транзакций и скидок на биржевых торгах.",
    ZH: "BNB 是 BNB Chain 的核心实用代币。它为全球数百万次代币兑换、去中心化智能合约和支付系统提供支持。",
    FR: "Le BNB est le jeton utilitaire central de la BNB Chain. Il alimente des millions de transactions, d'applications décentralisées et de solutions de paiement.",
    AR: "بي إن بي (BNB) هي رمز الخدمة الأساسي لسلسلة BNB Chain. وتغذي الملايين من العقود الذكية والتحويلات وأنظمة الدفع عالميًا.",
    HI: "BNB मुख्य उपयोगिता टोकन के रूप में बीएनबी चेन (BNB Chain) का संचालन करता है। यह वैश्विक स्तर पर लाखों स्मार्ट कॉन्ट्रैक्ट और भुगतान प्रणालियों को शक्ति प्रदान करता है।",
    ES: "BNB actúa como el token de utilidad central de BNB Chain. Impulsa millones de contratos inteligentes, transacciones y sistemas de pago a nivel mundial."
  },
  TON: {
    EN: "The Open Network (TON) is an elegant decentralized layer integrated within Telegram. It facilitates immediate utility sharing, secure bots, and low-cost ledger transfers.",
    RU: "The Open Network (TON) — это высокоэффективный блокчейн, тесно интегрированный в экосистему Telegram. Он позволяет совершать быстрые безкомиссионные транзакции и запускать приложения.",
    ZH: "The Open Network (TON) 是一种与 Telegram 深度整合的高能去中心化网络。它提供了即时的应用生态、便利的智能机器人以及低成本的划转体验。",
    FR: "The Open Network (TON) est une blockchain décentralisée performante, étroitement intégrée à Telegram pour des transferts rapides et des applications polyvalentes.",
    AR: "ذا أوبن نيتورك (TON) هو بلوكشين متطور مدمج في تيليجرام. ويسهل عمليات التحويل الفورية والمنخفضة التكلفة وتشغيل البوتات التطبيقية.",
    HI: "The Open Network (TON) एक अत्यधिक कुशल ब्लॉकचेन है जो टेलीग्राम के साथ एकीकृत है। यह त्वरित हस्तांतरण और विभिन्न अनुप्रयोगों को चलाने की अनुमति देता है।",
    ES: "The Open Network (TON) es una cadena de bloques de gran rendimiento integrada en Telegram. Facilita transferencias instantáneas, bots de utilidad y transacciones de muy bajo costo."
  },
  TWT: {
    EN: "Trust Wallet Token is a utility asset that delivers custom governance rewards, trade rate reductions, and native ledger features within Trust Wallet.",
    RU: "Trust Wallet Token — это утилитарный токен кошелька Trust Wallet, предоставляющий пользователям скидки на торговлю, участие в голосовании и премиальные функции.",
    ZH: "Trust Wallet Token (TWT) 是一种实用型资产，可在 Trust Wallet 钱包内提供定制的治理奖励、交易费减免和原生钱包功能支持。",
    FR: "Trust Wallet Token est un actif utilitaire offrant des récompenses de gouvernance, des réductions de frais de trading et des fonctions intégrées dans Trust Wallet.",
    AR: "رمز تراست والت (TWT) هو رمز خدمة يوفر مكافآت حوكمة مخصصة، وتخفيضات رسوم التداول ومزايا مدمجة داخل محفظة Trust Wallet.",
    HI: "ट्रस्ट वॉलेट टोकन (TWT) ट्रस्ट वॉलेट का एक उपयोगिता टोकन है, जो उपयोगकर्ताओं को व्यापार छूट, शासन में भागीदारी और प्रीमियम सुविधाएँ प्रदान करता है।",
    ES: "Trust Wallet Token es un token de utilidad que ofrece recompensas de gobernanza, descuentos en tarifas comerciales y funciones avanzadas dentro de Trust Wallet."
  }
};

// 2. Coin description endpoint serving static, curated asset profiles
app.post("/api/crypto/explain", async (req, res) => {
  const { symbol, name, lang = "RU" } = req.body;
  if (!symbol) {
    return res.status(400).json({ error: "Missing coin symbol" });
  }

  const coinDescObj = STATIC_COIN_DESC[symbol] || { 
    EN: `Information portal for ${name}.`, 
    RU: `Информационный портал для ${name}.`,
    ZH: `关于 ${name} 的信息门户。`,
    FR: `Portail d'information pour ${name}.`,
    AR: `بوابة معلومات لـ ${name}.`,
    HI: `${name} के लिए सूचना पोर्टल।`,
    ES: `Portal de información para ${name}.`
  };
  
  const staticIntro = coinDescObj[lang as keyof typeof coinDescObj] || coinDescObj.EN || coinDescObj.RU;

  const headers: { [key: string]: string } = {
    EN: `### ${name} (${symbol}) Overview`,
    RU: `### Обзор ${name} (${symbol})`,
    ZH: `### ${name} (${symbol}) 概述`,
    FR: `### Aperçu de ${name} (${symbol})`,
    AR: `### نظرة عامة على ${name} (${symbol})`,
    HI: `### ${name} (${symbol}) अवलोकन`,
    ES: `### Resumen de ${name} (${symbol})`
  };
  const header = headers[lang] || headers.EN;
  const analysis = `${header}\n\n${staticIntro}`;

  res.json({
    success: true,
    source: "static",
    analysis
  });
});

// 3. Status endpoint and Key search helpers to assist developers in verifying their configuration
const getPiApiKey = (): string | undefined => {
  return process.env.PI_API_KEY || 
         process.env.PI_SERVER_KEY || 
         process.env.PI_KEY || 
         process.env.MINEPI_API_KEY || 
         process.env.MINEPI_KEY || 
         process.env.MINEPI_SERVER_KEY ||
         "8rhklalt9kcx5vtqftsnfrgbdzcoxm3piq1ab5zktuszarehxuk5xeit9yzpagae";
};

// Diagnostics logger to record Pi API handshakes in memory
interface PiLogEntry {
  id: string;
  timestamp: string;
  endpoint: string;
  paymentId: string;
  txid?: string;
  level: "success" | "info" | "error";
  message: string;
  data?: any;
}

const PI_API_LOGS: PiLogEntry[] = [];

function logPiEvent(endpoint: string, paymentId: string, level: "success" | "info" | "error", message: string, data?: any, txid?: string) {
  const entry: PiLogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toLocaleTimeString(),
    endpoint,
    paymentId,
    txid,
    level,
    message,
    data: data ? JSON.parse(JSON.stringify(data)) : undefined
  };
  PI_API_LOGS.unshift(entry);
  if (PI_API_LOGS.length > 50) PI_API_LOGS.pop(); // Hold last 50 events
  console.log(`[Pi ${endpoint}] [${level.toUpperCase()}] Payment ${paymentId}: ${message}`, data || "");
}

app.get("/api/pi/logs", (req, res) => {
  res.json(PI_API_LOGS);
});

app.post("/api/pi/logs/clear", (req, res) => {
  PI_API_LOGS.length = 0;
  res.json({ success: true });
});

app.get("/api/pi/status", (req, res) => {
  const apiKey = getPiApiKey();
  res.json({
    hasApiKey: !!apiKey,
    hasValidationKey: !!process.env.PI_VALIDATION_KEY,
    nodeEnv: process.env.NODE_ENV || "development"
  });
});

// 4. Pi payment server-side approval flow
app.post("/api/pi/approve", async (req, res) => {
  const { paymentId, isSandboxSimulation } = req.body;
  if (!paymentId) {
    logPiEvent("approve", "UNKNOWN", "error", "Missing paymentId parameters");
    return res.status(400).json({ error: "Missing paymentId parameter" });
  }

  const isMock = !!isSandboxSimulation || paymentId.startsWith("MOCK_");
  const apiKey = getPiApiKey();
  
  logPiEvent("approve", paymentId, "info", "Incoming approval request check", { isSandboxSimulation, isMock, hasApiKey: !!apiKey });

  if (!apiKey) {
    if (isMock) {
      logPiEvent("approve", paymentId, "success", "Mock Sandbox simulated approval successful");
      return res.json({ success: true, message: "Sandbox simulation approved", mocked: true, identifier: paymentId });
    }
    const errMsg = "PI_API_KEY environment variable is not defined on the server! Real transactions in the Pi Browser require a configured API key to authorize payments. Please check your setup.";
    logPiEvent("approve", paymentId, "error", "PI_API_KEY is missing on the server", { error: "PI_API_KEY_MISSING" });
    return res.status(400).json({
      success: false,
      error: "PI_API_KEY_MISSING",
      message: errMsg
    });
  }

  try {
    logPiEvent("approve", paymentId, "info", `Calling Pi core API POST approval endpoint with Auth prefix: ${apiKey.substring(0, 4)}...`);
    const apiRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    const bodyText = await apiRes.text();
    let data: any = {};
    try {
      data = JSON.parse(bodyText);
    } catch (e) {
      data = { rawText: bodyText };
    }

    if (apiRes.ok) {
      logPiEvent("approve", paymentId, "success", "Pi Core API successfully approved transaction!", data);
      // Double compatible payload: returns both {success: true, data} and the root fields of raw payment object
      return res.json({
        success: true,
        data,
        ...data
      });
    } else {
      logPiEvent("approve", paymentId, "error", `Pi Core API rejected approval with status ${apiRes.status}`, data);
      return res.status(apiRes.status).json({
        success: false,
        error: "Pi API error",
        details: data,
        ...data
      });
    }
  } catch (err: any) {
    logPiEvent("approve", paymentId, "error", `Exception encountered inside approval handler: ${err.message}`);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Pi payment server-side completion flow
app.post("/api/pi/complete", async (req, res) => {
  const { paymentId, txid, isSandboxSimulation } = req.body;
  if (!paymentId || !txid) {
    logPiEvent("complete", paymentId || "UNKNOWN", "error", "Missing required completion parameters paymentId or txid", { txid });
    return res.status(400).json({ error: "Missing required parameters: paymentId or txid" });
  }

  const isMock = !!isSandboxSimulation || paymentId.startsWith("MOCK_") || txid.startsWith("MOCK_");
  const apiKey = getPiApiKey();

  logPiEvent("complete", paymentId, "info", "Incoming completion request check", { txid, isSandboxSimulation, isMock, hasApiKey: !!apiKey });

  if (!apiKey) {
    if (isMock) {
      logPiEvent("complete", paymentId, "success", "Mock Sandbox simulated completion successful", { txid });
      return res.json({ success: true, message: "Sandbox completion simulated successfully", mocked: true, identifier: paymentId, transaction: { txid } });
    }
    const errMsg = "PI_API_KEY is missing on server. Blockchain payment cannot be finalized without a valid developer key.";
    logPiEvent("complete", paymentId, "error", "PI_API_KEY is missing on server", { error: "PI_API_KEY_MISSING" });
    return res.status(400).json({
      success: false,
      error: "PI_API_KEY_MISSING",
      message: errMsg
    });
  }

  try {
    logPiEvent("complete", paymentId, "info", `Calling Pi core API POST completion endpoint for txid: ${txid}`);
    const apiRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid })
    });

    const bodyText = await apiRes.text();
    let data: any = {};
    try {
      data = JSON.parse(bodyText);
    } catch (e) {
      data = { rawText: bodyText };
    }

    if (apiRes.ok) {
      logPiEvent("complete", paymentId, "success", "Pi payment successfully finalized and recorded as settled on chain!", data);
      // Double compatible payload: returns both {success: true, data} and the root fields of the payment response
      return res.json({
        success: true,
        data,
        ...data
      });
    } else {
      logPiEvent("complete", paymentId, "error", `Pi Core API rejected completion with status ${apiRes.status}`, data);
      return res.status(apiRes.status).json({
        success: false,
        error: "Pi API completion error",
        details: data,
        ...data
      });
    }
  } catch (err: any) {
    logPiEvent("complete", paymentId, "error", `Exception during Pi transaction final completion: ${err.message}`);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Setup Vite middleware / production serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets or fallback
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap();
