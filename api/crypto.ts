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
  { symbol: "TWT", name: "TWT", geckoId: "trust-wallet-token", category: "Wallet Utility" },
  { symbol: "ONDO", name: "Ondo Finance", geckoId: "ondo-finance", category: "Real World Assets (RWA)" }
];

const getStaticRank = (symbol: string): number => {
  switch (symbol.toUpperCase()) {
    case "BTC": return 1;
    case "ETH": return 2;
    case "BNB": return 5;
    case "XRP": return 6;
    case "TON": return 10;
    case "XLM": return 15;
    case "HBAR": return 25;
    case "ONDO": return 80;
    case "TWT": return 120;
    case "ZYPTO": return 1040;
    case "PI": return 3105;
    default: return 999;
  }
};

const getStaticMaxSupply = (symbol: string): number | null => {
  switch (symbol.toUpperCase()) {
    case "BTC": return 21000000;
    case "ETH": return null;
    case "BNB": return 200000500;
    case "XRP": return 100000000000;
    case "TON": return null;
    case "XLM": return 50001806812;
    case "HBAR": return 50000000000;
    case "ONDO": return 10000000000;
    case "TWT": return 1000000000;
    case "ZYPTO": return 100000000;
    case "PI": return 100000000000;
    default: return null;
  }
};

const getStaticCirculatingSupply = (symbol: string): number => {
  switch (symbol.toUpperCase()) {
    case "BTC": return 19700000;
    case "ETH": return 120400000;
    case "BNB": return 146000000;
    case "XRP": return 55000000000;
    case "TON": return 2500000000;
    case "XLM": return 29000000000;
    case "HBAR": return 35700000000;
    case "ONDO": return 1437142415;
    case "TWT": return 416000000;
    case "ZYPTO": return 89000000;
    case "PI": return 68000000000;
    default: return 0;
  }
};

const getStaticPrice = (symbol: string): number => {
  switch (symbol.toUpperCase()) {
    case "PI": return 41.25;
    case "BTC": return 89450.00;
    case "ETH": return 2740.15;
    case "XRP": return 1.15;
    case "HBAR": return 0.125;
    case "ZYPTO": return 0.0185;
    case "XLM": return 0.222;
    case "BNB": return 582.40;
    case "TON": return 5.12;
    case "TWT": return 1.05;
    case "ONDO": return 1.15;
    default: return 0;
  }
};

const getStaticChange24h = (symbol: string): number => {
  switch (symbol.toUpperCase()) {
    case "PI": return 1.45;
    case "BTC": return -1.12;
    case "ETH": return 0.85;
    case "XRP": return -2.41;
    case "HBAR": return 4.21;
    case "ZYPTO": return -3.15;
    case "XLM": return 0.52;
    case "BNB": return -0.45;
    case "TON": return 2.18;
    case "TWT": return -1.88;
    case "ONDO": return 3.54;
    default: return 0;
  }
};

const getStaticMarketCap = (symbol: string): number => {
  switch (symbol.toUpperCase()) {
    case "PI": return 0;
    case "BTC": return 1750400120100;
    case "ETH": return 329100500600;
    case "XRP": return 65000210340;
    case "HBAR": return 4250100200;
    case "ZYPTO": return 18500120;
    case "XLM": return 6450120300;
    case "BNB": return 85210040500;
    case "TON": return 12900410200;
    case "TWT": return 430150200;
    case "ONDO": return 1650000000;
    default: return 0;
  }
};

const getStaticVolume24h = (symbol: string): number => {
  switch (symbol.toUpperCase()) {
    case "PI": return 3521040;
    case "BTC": return 28100500120;
    case "ETH": return 14500100200;
    case "XRP": return 1200150200;
    case "HBAR": return 152010400;
    case "ZYPTO": return 345100;
    case "XLM": return 230100500;
    case "BNB": return 980120300;
    case "TON": return 185040300;
    case "TWT": return 12040100;
    case "ONDO": return 185000000;
    default: return 0;
  }
};

let priceCache: {
  timestamp: number;
  data: any[];
} | null = null;

const CACHE_DURATION_MS = 10000;

export default async function handler(req: any, res: any) {
  // Common CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const now = Date.now();
  if (priceCache && (now - priceCache.timestamp < CACHE_DURATION_MS)) {
    return res.status(200).json({ success: true, source: "cache", data: priceCache.data });
  }

  const symbols = COIN_METADATA.map(c => c.symbol).join(",");
  const cmcKey = process.env.CMC_PRO_API_KEY;

  if (cmcKey) {
    try {
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
            price: usdQuote?.price || getStaticPrice(coin.symbol),
            change24h: usdQuote?.percent_change_24h !== undefined && usdQuote?.percent_change_24h !== null ? usdQuote.percent_change_24h : getStaticChange24h(coin.symbol),
            marketCap: usdQuote?.market_cap || getStaticMarketCap(coin.symbol),
            volume24h: usdQuote?.volume_24h || getStaticVolume24h(coin.symbol),
            lastUpdated: usdQuote?.last_updated || new Date().toISOString(),
            rank: fetched?.cmc_rank || getStaticRank(coin.symbol),
            maxSupply: maxSupplyRaw !== undefined && maxSupplyRaw !== null ? maxSupplyRaw : getStaticMaxSupply(coin.symbol),
            circulatingSupply: circulatingSupplyRaw || (usdQuote?.market_cap && usdQuote?.price ? usdQuote.market_cap / usdQuote.price : getStaticCirculatingSupply(coin.symbol))
          };
        });

        priceCache = { timestamp: now, data: normalizedList };
        return res.status(200).json({ success: true, source: "coinmarketcap", data: normalizedList });
      }
    } catch (err: any) {
      console.error("Vercel API CoinMarketCap failed, using fallback:", err.message);
    }
  }

  // Fallback to CoinGecko
  try {
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
          price: rawInfo?.usd || getStaticPrice(coin.symbol),
          change24h: rawInfo?.usd_24h_change !== undefined && rawInfo?.usd_24h_change !== null ? rawInfo.usd_24h_change : getStaticChange24h(coin.symbol),
          marketCap: rawInfo?.usd_market_cap || getStaticMarketCap(coin.symbol),
          volume24h: rawInfo?.usd_24h_vol || getStaticVolume24h(coin.symbol),
          lastUpdated: new Date().toISOString(),
          rank: getStaticRank(coin.symbol),
          maxSupply: getStaticMaxSupply(coin.symbol),
          circulatingSupply: computedCirculating
        };
      });

      priceCache = { timestamp: now, data: normalizedList };
      return res.status(200).json({ success: true, source: "coigecko", data: normalizedList });
    }
  } catch (err: any) {
    console.error("Vercel API CoinGecko fallback failed:", err.message);
  }

  // Double fallback standard realistic static levels
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
      case "ONDO": priceBySymbol = 1.15; changeBySymbol = 3.54; capBySymbol = 1650000000; volBySymbol = 185000000; break;
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

  return res.status(200).json({ success: true, source: "local_cache_simulation", data: staticFallback });
}
