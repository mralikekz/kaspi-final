import React from "react";
import { ArrowLeft, Shield, Lock, FileText, Globe, EyeOff } from "lucide-react";
import { KaspiLang } from "../types";

interface PrivacyPolicyProps {
  lang: KaspiLang;
  onBack: () => void;
}

const POLICY_TEXTS: Record<KaspiLang, {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: Array<{ subtitle: string; content: string }>;
  footer: string;
}> = {
  RU: {
    title: "Политика Конфиденциальности",
    effectiveDate: "Действует с: 1 июня 2026 г.",
    intro: "KASPI INFORMATIONAL PORTAL («мы», «наш» или «Портал») ценит вашу конфиденциальность. Данная политика описывает, как мы обрабатываем данные внутри нашего приложения в экосистеме Pi Network.",
    sections: [
      {
        subtitle: "1. Сбор и Использование Данных",
        content: "Наш Портал является полностью информационным ресурсом. Мы НЕ собираем, НЕ храним и НЕ передаем третьим лицам личную или конфиденциальную информацию о пользователях. Все котировки, курсы и расчетные параметры обрабатываются на сервере и в кэше браузера без привязки к конкретной учетной записи."
      },
      {
        subtitle: "2. Локальное хранилище (Cookies и LocalStorage)",
        content: "Для сохранения ваших индивидуальных предпочтений интерфейса (выбранный язык, режим темной или светлой темы) мы используем стандартную функцию браузера LocalStorage. Эти данные сохраняются исключительно локально на вашем мобильном устройстве и не передаются на наши серверы."
      },
      {
        subtitle: "3. Провайдеры Данных и Внешние Сервисы",
        content: "Все ценовые метрики и рыночные индикаторы криптовалют агрегируются в режиме реального времени посредством официальных API сервисов CoinMarketCap и CoinGecko. Мы не собираем сетевую телеметрию и конфиденциальные данные о ваших IP-адресах."
      },
      {
        subtitle: "4. Интеграция с Pi Network",
        content: "Мы полностью соблюдаем правила разработчиков экосистемы Pi Network. Наше приложение не требует доступа к вашему Pi-кошельку, за исключением запросов на проведение стандартных проверочных транзакций, инициированных вами в среде песочницы/майннета Pi."
      },
      {
        subtitle: "5. Связь с нами",
        content: "Если у вас есть какие-либо вопросы или конструктивные предложения по работе Портала, вы можете связаться со службой поддержки через официальные каналы Pi Network."
      }
    ],
    footer: "Спасибо за использование KASPI INFORMATIONAL PORTAL!"
  },
  EN: {
    title: "Privacy Policy",
    effectiveDate: "Effective Date: June 1, 2026",
    intro: "KASPI INFORMATIONAL PORTAL ('we', 'our', or 'Portal') values your privacy. This policy outlines how we handle data within our application within the Pi Network ecosystem.",
    sections: [
      {
        subtitle: "1. Data Collection and Usage",
        content: "Our Portal is purely informational. We DO NOT collect, store, or share with third parties any personal or confidential information about users. All quotes, rates, and calculation parameters are processed on the server and in the browser cache without association to any specific account."
      },
      {
        subtitle: "2. Local Storage (LocalStorage & Cookies)",
        content: "To preserve your individual interface settings (selected language, dark or light mode preference), we use the standard browser LocalStorage capability. This data is stored strictly locally on your mobile device and is never transmitted to our servers."
      },
      {
        subtitle: "3. Data Providers and External Services",
        content: "All price metrics and cryptocurrency market indicators are aggregated in real-time through the official APIs of CoinMarketCap and CoinGecko. We do not gather network telemetry or confidential IP address logs."
      },
      {
        subtitle: "4. Pi Network Integration",
        content: "We fully comply with the developer guidelines of the Pi Network ecosystem. Our application does not request access to your Pi Wallet, save for standard verification transaction requests initiated by you in the Pi sandbox/mainnet platform."
      },
      {
        subtitle: "5. Contact Us",
        content: "If you have any questions or constructive feedback regarding the Portal, you can contact support through our official Pi Network community channels."
      }
    ],
    footer: "Thank you for using KASPI INFORMATIONAL PORTAL!"
  },
  ZH: {
    title: "隐私政策",
    effectiveDate: "生效日期：2026年6月1日",
    intro: "KASPI 科学信息门户（“我们”或“本门户”）重视您的隐私。本政策概述了我们在 Pi 网络生态系统应用程序中处理数据的方式。",
    sections: [
      {
        subtitle: "1. 数据收集与使用",
        content: "本门户纯属信息服务性质。我们不会收集、存储或与第三方共享用户的任何个人或机密信息。所有即时报价、兑换比率和计算参数均在服务器和浏览器缓存中处理，与任何特定个人账户无关。"
      },
      {
        subtitle: "2. 本地存储 (LocalStorage)",
        content: "为了保存您的个性化界面设置（所选语言、深色或浅色主题偏好），我们使用标准的浏览器 LocalStorage 功能。此数据仅存储在您的移动设备本地，绝不传输到我们的服务器。"
      },
      {
        subtitle: "3. 数据提供商和外部服务",
        content: "所有的价格指标和加密货币市场走势均是通过 CoinMarketCap 和 CoinGecko 的官方公用 API 进行实时汇总。我们不收集网络遥测数据或机密 IP 地址日志。"
      },
      {
        subtitle: "4. Pi 网络集成",
        content: "我们完全遵守 Pi 网络生态的开发者指南。我们的应用不会请求获取或擅自读取您的 Pi 钱包资产，仅处理在 Pi 沙盒内由您主动发起的标准链上校验请求。"
      },
      {
        subtitle: "5. 联系我们",
        content: "如果您对本门户有任何疑问或建设性意见，可以通过 Pi 网络官方社区渠道与我们取得联系。"
      }
    ],
    footer: "感谢您使用 KASPI INFORMATIONAL PORTAL！"
  },
  FR: {
    title: "Politique de Confidentialité",
    effectiveDate: "Date d'effet: 1er Juin 2026",
    intro: "KASPI INFORMATIONAL PORTAL (« nous » ou « le Portail ») respecte votre vie privée. Cette politique explique comment nous traitons les données dans notre application au sein de l'écosystème Pi Network.",
    sections: [
      {
        subtitle: "1. Collecte et Utilisation des Données",
        content: "Notre Portail est strictement informatif. Nous NE collectons, NE stockons et NE partageons AUCUNE donnée personnelle ou confidentielle concernant nos utilisateurs. Toutes les informations sont stockées localement ou traitées à la volée."
      },
      {
        subtitle: "2. Stockage Local (LocalStorage)",
        content: "Pour conserver vos préférences (langue, format sombre/clair), nous utilisons le LocalStorage de votre navigateur. Ces données restent sur votre appareil mobile."
      },
      {
        subtitle: "3. Sources de Données externes",
        content: "Nos taux sont agrégés via les API de CoinMarketCap et CoinGecko. Nous n'enregistrons aucune donnée télémétrique."
      },
      {
        subtitle: "4. Intégration Pi Network",
        content: "Conforme aux chartes de Pi Network. Nous ne demandons aucune clé privée ni accès injustifié."
      },
      {
        subtitle: "5. Contact",
        content: "Pour toute question, contactez-nous via les réseaux officiels de développeurs Pi."
      }
    ],
    footer: "Merci de faire confiance à KASPI INFORMATIONAL PORTAL!"
  },
  AR: {
    title: "سياسة الخصوصية",
    effectiveDate: "تاريخ السريان: 1 يونيو 2026",
    intro: "تقدر بوابة KASPI INFORMATIONAL PORTAL ('نحن' أو 'البوابة') خصوصيتك. توضح هذه السياسة كيفية التعامل مع البيانات داخل تطبيقنا في نظام Pi Network البيئي.",
    sections: [
      {
        subtitle: "1. جمع البيانات واستخدامها",
        content: "بوابتنا هي منصة معلوماتية فقط. نحن لا نجمع أو نخزن أو نشارك أي معلومات شخصية أو سرية عن المستخدمين مع أي طرف ثالث."
      },
      {
        subtitle: "2. التخزين المحلي (LocalStorage)",
        content: "لحفظ تفضيلاتك (اللغة، والمظهر الداكن أو الفاتح)، نستخدم تقنية LocalStorage في متصفحك بشكل محلي تمامًا."
      },
      {
        subtitle: "3. مزودو البيانات الخارجيون",
        content: "نحن نستخدم بيانات CoinMarketCap و CoinGecko الرسمية ولا نسجل أي بيانات تتبع للشبكة."
      },
      {
        subtitle: "4. التكامل مع شبكة Pi",
        content: "نحن نمتثل تمامًا لإرشادات مطوري شبكة Pi Network ولا نطلب معلومات محفظتك الحساسة."
      },
      {
        subtitle: "5. اتصل بنا",
        content: "لطرح أي أسئلة يرجى التواصل معنا عبر قنوات مطوري شبكة Pi الرسمية."
      }
    ],
    footer: "نشكركم على استخدام KASPI INFORMATIONAL PORTAL!"
  },
  HI: {
    title: "गोपनीयता नीति",
    effectiveDate: "प्रभावी तिथि: 1 जून, 2026",
    intro: "KASPI INFORMATIONAL PORTAL ('हम', 'हमारा', या 'पोर्टल') आपकी गोपनीयता को महत्व देता है। यह नीति बताती है कि हम Pi Network पारिस्थितिकी तंत्र के भीतर हमारे ऐप में डेटा को कैसे नियंत्रित करते हैं।",
    sections: [
      {
        subtitle: "1. डेटा संग्रह और उपयोग",
        content: "हमारा पोर्टल पूरी तरह से सूचनात्मक है। हम उपयोगकर्ताओं के बारे में कोई भी व्यक्तिगत या गोपनीय जानकारी एकत्र, संगृहीत या साझा नहीं करते हैं।"
      },
      {
        subtitle: "2. स्थानीय भंडारण (LocalStorage)",
        content: "आपकी पसंद की भाषा और थीम को सहेजने के लिए हम LocalStorage का उपयोग करते हैं, जो आपके डिवाइस पर स्थानीय रूप से कार्य करता है।"
      },
      {
        subtitle: "3. डेटा सेवा प्रदाता",
        content: "सभी विवरण CoinMarketCap और CoinGecko के सार्वजनिक API के माध्यम से एकत्र किए जाते हैं। हम कोई अन्य टेलीमेट्री एकत्र नहीं करते हैं।"
      },
      {
        subtitle: "4. Pi Network एकीकरण",
        content: "हम Pi Network के डेवलपर दिशानिर्देशों का पूरी तरह से पालन करते हैं। हम आपके Pi वॉलेट की किसी निजी चाबी का उपयोग नहीं करते हैं।"
      },
      {
        subtitle: "5. संपर्क करें",
        content: "यदि आपके पास कोई प्रश्न है, तो आप Pi Network के आधिकारिक डेवलपर चैनलों के माध्यम से संपर्क कर सकते हैं।"
      }
    ],
    footer: "KASPI INFORMATIONAL PORTAL का उपयोग करने के लिए धन्यवाद!"
  },
  ES: {
    title: "Política de Privacidad",
    effectiveDate: "Vigente desde: 1 de Junio de 2026",
    intro: "KASPI INFORMATIONAL PORTAL ('nosotros', 'nuestro' o 'Portal') respeta su privacidad. Esta política de privacidad describe cómo gestionamos los datos dentro de nuestra aplicación en el ecosistema de Pi Network.",
    sections: [
      {
        subtitle: "1. Recopilación y Uso de Datos",
        content: "Nuestro Portal es un recurso de carácter puramente informativo. NO recopilamos, NO almacenamos y NO compartimos con terceros ninguna información personal o confidencial del usuario. Todo se procesa de forma anónima."
      },
      {
        subtitle: "2. Almacenamiento Local (LocalStorage)",
        content: "Para mantener sus preferencias de interfaz (idioma, modo oscuro o claro), utilizamos la función LocalStorage de su navegador. Estos datos permanecen en su propio dispositivo."
      },
      {
        subtitle: "3. Proveedores de Datos Externos",
        content: "Todas las métricas de precios se obtienen en tiempo real a través de las API oficiales de CoinMarketCap y CoinGecko de manera transparente."
      },
      {
        subtitle: "4. Integración con Pi Network",
        content: "Cumplimos estrictamente con las directrices para desarrolladores de Pi Network conservando la integridad de sus datos y de su billetera Pi."
      },
      {
        subtitle: "5. Contacto",
        content: "Si tiene alguna consulta o recomendación constructiva para mejorar el Portal, contáctenos mediante la plataforma de Pi Network."
      }
    ],
    footer: "¡Gracias por elegir KASPI INFORMATIONAL PORTAL!"
  }
};

export default function PrivacyPolicy({ lang, onBack }: PrivacyPolicyProps) {
  const currentText = POLICY_TEXTS[lang] || POLICY_TEXTS.EN;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-extrabold text-purple-650 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        {lang === "RU" ? "Назад в Портал" : "Back to Portal"}
      </button>

      {/* Hero Frame */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 dark:bg-zinc-900 dark:border-zinc-800/80 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center text-purple-650 dark:text-purple-400">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">
              {currentText.title}
            </h2>
            <p className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-slate-400 mt-1.5 dark:text-zinc-500">
              {currentText.effectiveDate}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-550 dark:text-zinc-300 leading-relaxed border-b border-slate-100 dark:border-zinc-850 pb-5 mb-6 text-justify">
          {currentText.intro}
        </p>

        {/* Structured Sections */}
        <div className="space-y-6">
          {currentText.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                {sec.subtitle}
              </h3>
              <p className="text-xs leading-relaxed text-slate-450 dark:text-zinc-400 text-justify">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {/* Legal Signoff */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-medium text-slate-400 dark:text-zinc-550 italic">
            {currentText.footer}
          </p>
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-purple-500 bg-purple-50 dark:bg-purple-950/35 px-2.5 py-1 rounded-md">
            <Shield className="h-3 w-3" />
            Verified Secure
          </div>
        </div>
      </div>
    </div>
  );
}
