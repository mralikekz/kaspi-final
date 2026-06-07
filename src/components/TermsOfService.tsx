import React from "react";
import { ArrowLeft, FileText, AlertTriangle, ShieldCheck, Scale, Award } from "lucide-react";
import { KaspiLang } from "../types";

interface TermsOfServiceProps {
  lang: KaspiLang;
  onBack: () => void;
}

const TERMS_TEXTS: Record<KaspiLang, {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: Array<{ subtitle: string; content: string }>;
  footer: string;
}> = {
  RU: {
    title: "Пользовательское Соглашение (Terms)",
    effectiveDate: "Действует с: 1 июня 2026 г.",
    intro: "Добро пожаловать в KASPI INFORMATIONAL PORTAL! Заходя на наш Портал или пользуясь им, вы безоговорочно соглашаетесь со следующими правилами и ограничениями ответственности.",
    sections: [
      {
        subtitle: "1. Информационный Характер (Не Финансовый Совет)",
        content: "Все котировки, аналитические данные за 24 часа, исторический прогресс цен и графические модели, представленные в приложении, публикуются исключительно в ознакомительных целях. Опубликованные сведения НЕ являются предложением к покупке/продаже активов или призывом к инвестиционной деятельности."
      },
      {
        subtitle: "2. Точность информации и Источники",
        content: "Мы транслируем коэффициенты цен и капитализацию напрямую из надежных публичных баз CoinMarketCap и CoinGecko. Тем не менее, из-за возможных технических сбоев или задержек на стороне провайдеров, мы не можем гарантировать абсолютную секундную точность данных. Пожалуйста, всегда проверяйте котировки на биржах перед принятием решений."
      },
      {
        subtitle: "3. Использование Токенов Pi",
        content: "Любые демонстрационные интерактивные калькуляторы или проверочные платежи в среде песочницы Pi служат целям изучения технологии и обучения. Наш Портал не начисляет проценты и не хранит средства пользователей."
      },
      {
        subtitle: "4. Правила Пользования Приложением",
        content: "Запрещается любое агрессивное автоматическое сканирование (скрейпинг) ресурсов или спам-запросы к API нашего Портала, которые могут искусственно создавать повышенную сетевую нагрузку и препятствовать комфортному доступу Пионеров к информации."
      },
      {
        subtitle: "5. Ограничение Ответственности",
        content: "В максимально допустимой законом мере мы освобождаем себя от ответственности за какие-либо убытки, упущенную выгоду или ущерб, возникший в результате вашего использования или невозможности использования данных, представленных на нашем Портале."
      }
    ],
    footer: "Спасибо, что соблюдаете правила KASPI INFORMATIONAL PORTAL!"
  },
  EN: {
    title: "Terms of Service",
    effectiveDate: "Effective Date: June 1, 2026",
    intro: "Welcome to KASPI INFORMATIONAL PORTAL! By accessing or using our Portal, you agree to comply with and be bound by the following Terms of Service and disclaimer guidelines.",
    sections: [
      {
        subtitle: "1. Informational Purposes Only (Disclaimer)",
        content: "All pricing values, 24-hour analytics, historical descriptions, and calculator conversions presented in this application are strictly for informational and educational purposes. None of the published parameters constitute financial, legal, or investment advice."
      },
      {
        subtitle: "2. Accuracy of Metrics and API Sources",
        content: "While we seek to compile top-tier rates via CoinMarketCap and CoinGecko networks, we cannot promise constant absolute accuracy due to network latency, server synchronization anomalies, or external outages. Verify all quotes independently on major exchanges."
      },
      {
        subtitle: "3. Pi Network and Sandbox Tokens",
        content: "Interactives and sandbox currency transactions initiated inside the application serve strictly simulated test environments for educational exploration. The Portal does not custody funds or emit real blockchain assets."
      },
      {
        subtitle: "4. Acceptable System Behavior",
        content: "Our users agree not to engage in automatic data extraction (scraping), service abuse, or deliberate server overloading which degrades user experience for other Pioneers worldwide."
      },
      {
        subtitle: "5. Limitation of Liability",
        content: "To the maximum extent permitted by applicable laws, KASPI INFORMATIONAL PORTAL is not liable for speculative damages, financial losses, or decisions made based on current informational displays."
      }
    ],
    footer: "Thank you for respecting KASPI INFORMATIONAL PORTAL Terms!"
  },
  ZH: {
    title: "用户服务协议 (Terms)",
    effectiveDate: "生效日期：2026年6月1日",
    intro: "欢迎来到 KASPI 科学信息门户！访问或使用我们的门户，即表示您无条件同意并遵守以下用户服务条款和免责声明指南。",
    sections: [
      {
        subtitle: "1. 仅限信息目的（投资免责）",
        content: "本应用中显示的所有价格走势、24小时涨跌分析、历史说明和计算工具折算比率，仅供参考和科普教育之用。发布的任何数据不构成资产买卖、法律或具体的投资建议。"
      },
      {
        subtitle: "2. 数据准确性以及 API 来源",
        content: "虽然我们努力通过 CoinMarketCap 和 CoinGecko 获取即时行业报价，但由于网络延迟、外部接口同步等不可抗御的技术因素，我们不保证数据的百分百绝对同步。交易前请前往主流交易所核实报价。"
      },
      {
        subtitle: "3. Pi 网络沙盒说明",
        content: "应用中由用户发起的任何测试网币充值、消耗等均在 Pi 沙盒模拟演习环境内工作，仅作为生态支付接口的可达性展示，不具任何实际资金流转与资产托管功能。"
      },
      {
        subtitle: "4. 系统合理使用规范",
        content: "用户同意不实施恶意的内容爬取、接口伪造、或任何旨在过载服务器、从而破坏其他全球先驱者使用体验的攻击性测试行为。"
      },
      {
        subtitle: "5. 责任限制与法务声明",
        content: "在法律允许的范围内，KASPI 信息门户不对由于使用或参考本平台参数所造成的任何直接或间接盈亏、投资选择或商业决策承担任何连带赔偿责任。"
      }
    ],
    footer: "感谢您遵守 KASPI INFORMATIONAL PORTAL 条款！"
  },
  FR: {
    title: "Conditions d'Utilisation",
    effectiveDate: "Date d'effet: 1er Juin 2026",
    intro: "Bienvenue sur KASPI INFORMATIONAL PORTAL! En naviguant sur ce portail, vous adhérez sans réserve aux conditions d'utilisation énoncées ci-dessous.",
    sections: [
      {
        subtitle: "1. Informations à titre indicatif uniquement",
        content: "Les prix affichés ne constituent en aucun cas des conseils financiers ou d'investissement."
      },
      {
        subtitle: "2. Fiabilité des Sources de Prix",
        content: "Les données sont importées en temps réel mais peuvent être sujettes à de légères latences de synchronisation."
      },
      {
        subtitle: "3. Écosystème Pi",
        content: "Les transactions de test simulées ou intermédiaires n'ont aucune correspondance financière réelle."
      },
      {
        subtitle: "4. Comportement Acceptable",
        content: "L'utilisation de scripts d'extraction automatisée est strictement interdite pour préserver la bande passante."
      },
      {
        subtitle: "5. Limitation de Responsabilité",
        content: "Nous déclinons toute responsabilité en cas de pertes liées à l'interprétation des données."
      }
    ],
    footer: "Merci de votre compréhension et de votre fidélité !"
  },
  AR: {
    title: "شروط الخدمة",
    effectiveDate: "تاريخ السريان: 1 يونيو 2026",
    intro: "مرحبًا بكم في بوابة KASPI INFORMATIONAL PORTAL! باستخدامكم للبوابة، فإنكم توافقون على الالتزام بالشروط والمسؤوليات التالية.",
    sections: [
      {
        subtitle: "1. طبيعة المنصة المعرفية",
        content: "جميع معلومات الأسعار والتحليلات هي لأغراض إعلامية وتعليمية فقط ونحن لا نقدم استشارات استثمارية."
      },
      {
        subtitle: "2. دقة مصادر الأسعار",
        content: "بسبب طبيعة مزامنة الشبكات مع CoinMarketCap و CoinGecko قد تظهر بعض فروقات الوقت الطفيفة."
      },
      {
        subtitle: "3. استخدام بيئة تجارب شبكة Pi",
        content: "جميع واجهات الدفع المتاحة في نسخة التطبيق الموجه للتطبيقات والرواد هي لمحاكاة دمج المحافظ البرمجية حصراً."
      },
      {
        subtitle: "4. شروط الاستخدام للأفراد",
        content: "يُحظر الاستخدام المفرط أو الهجمات البرمجية التي تسبب ضررًا للأداء العام للبوابة."
      },
      {
        subtitle: "5. إخلاء طرف كامل",
        content: "لا تتحمل البوابة أي مسؤولية قانونية عن أي خسائر ناتجة عن قراراتكم التجارية."
      }
    ],
    footer: "شكرًا لالتزامكم بقواعد KASPI INFORMATIONAL PORTAL!"
  },
  HI: {
    title: "सेवा की शर्तें (Terms Of Service)",
    effectiveDate: "प्रभावी तिथि: 1 जून, 2026",
    intro: "KASPI INFORMATIONAL PORTAL में आपका स्वागत है! हमारे पोर्टल का उपयोग करके आप निम्नलिखित शर्तों और अस्वीकरणों से सहमत होते हैं।",
    sections: [
      {
        subtitle: "1. केवल सूचना के उद्देश्य (सलाह का अभाव)",
        content: "प्रदर्शित सभी आंकड़े और मूल्य केवल सूचनात्मक उद्देश्यों के लिए हैं और इन्हें संवेदी निवेश सलाह नहीं माना जाना चाहिए।"
      },
      {
        subtitle: "2. API स्रोतों की विश्वसनीयता",
        content: "हम विश्वसनीय प्रदाताओं से आंकड़े लेते हैं, लेकिन नेटवर्क विलंबता की संभावना के कारण तत्काल सटीकता की 100% गारंटी नहीं दी जा सकती।"
      },
      {
        subtitle: "3. Pi नेटवर्क की परीक्षण लेनदेन",
        content: "विशेषज्ञ कनवर्टर सेवा या सैंडबॉक्स परीक्षण केवल शैक्षिक समझ विकसित करने की रूपरेखा हैं।"
      },
      {
        subtitle: "4. सिस्टम का दुरुपयोग रोकना",
        content: "सर्वर पर अनावश्यक लोड उत्पन्न करने या स्वचालित डेटा स्क्रैपिंग की अनुमति नहीं है।"
      },
      {
        subtitle: "5. देयता की सीमा",
        content: "पोर्टल की प्रत्यक्ष विषय-वस्तु के आधार पर लिए गए किसी भी व्यावसायिक निर्णय के कारण होने वाले लाभ या हानि के लिए हम उत्तरदायी नहीं हैं।"
      }
    ],
    footer: "नियमों का आदर करने के लिए धन्यवाद!"
  },
  ES: {
    title: "Términos del Servicio (Terms)",
    effectiveDate: "Vigente desde: 1 de Junio de 2026",
    intro: "¡Bienvenido a KASPI INFORMATIONAL PORTAL! Al acceder a nuestro Portal, acepta de manera inequívoca las siguientes pautas legales y de limitación de responsabilidad.",
    sections: [
      {
        subtitle: "1. Finalidad Exclusiva Informativa (Sin Asesoría)",
        content: "Toda la información bursátil de precios, análisis de 24 horas y simuladores en este Portal se publican con fines educativos. NO constituye consultoría de inversión ni incitación comercial."
      },
      {
        subtitle: "2. Veracidad de Fuentes",
        content: "Obtenemos nuestras métricas directamente de CoinMarketCap y CoinGecko. No nos responsabilizamos por anomalías temporales originadas por latencia en el servidor externo."
      },
      {
        subtitle: "3. Ecosistema de Prueba Pi",
        content: "Las interfaces de simulación y el sandbox dentro del entorno de Pi Network son exclusivamente operativas para pruebas técnicas."
      },
      {
        subtitle: "4. Uso Lícito de la Aplicación",
        content: "Queda prohibido realizar raspado de datos (scraping) o enviar peticiones masivas automatizadas que degraden la velocidad de respuesta para otros Pioneros."
      },
      {
        subtitle: "5. Exención de Responsabilidad",
        content: "En la medida permitida por el marco legal aplicable, no respondemos por consecuencias especulativas ni transacciones privadas de los usuarios."
      }
    ],
    footer: "¡Agradecemos su cumplimiento con KASPI INFORMATIONAL PORTAL!"
  }
};

export default function TermsOfService({ lang, onBack }: TermsOfServiceProps) {
  const currentText = TERMS_TEXTS[lang] || TERMS_TEXTS.EN;

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
          <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-650 dark:text-indigo-400">
            <Scale className="h-5 w-5" />
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
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-950/35 px-2.5 py-1 rounded-md">
            <ShieldCheck className="h-3 w-3" />
            Policy Signed
          </div>
        </div>
      </div>
    </div>
  );
}
