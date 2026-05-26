import { KaspiLang } from "../types";

export const TRANSLATIONS: Record<string, Record<KaspiLang, string>> = {
  // Navigation & General titles
  networkActive: {
    RU: "Сеть активна",
    EN: "Network active",
    ZH: "网络已连接",
    FR: "Réseau actif",
    AR: "الشبكة نشطة",
    HI: "नेटवर्क सक्रिय है",
    ES: "Red activa"
  },
  infoPortal: {
    RU: "Информационный Портал",
    EN: "Information Portal",
    ZH: "信息门户",
    FR: "Portail d'information",
    AR: "بوابة المعلومات",
    HI: "सूचना पोर्टल",
    ES: "Portal de Información"
  },
  searchPlaceholder: {
    RU: "Поиск монеты...",
    EN: "Search coin...",
    ZH: "搜索货币...",
    FR: "Rechercher une pièce...",
    AR: "البحث عن عملة...",
    HI: "सिक्का खोजें...",
    ES: "Buscar moneda..."
  },
  searchPlaceholderDetailed: {
    RU: "Поиск монеты (название или тикер)...",
    EN: "Search coin (name or symbol)...",
    ZH: "搜索货币（名称或代号）...",
    FR: "Rechercher (nom ou symbole)...",
    AR: "البحث عن عملة (الاسم أو الرمز)...",
    HI: "सिक्का खोजें (नाम या प्रतीक)...",
    ES: "Buscar moneda (nombre o símbolo)..."
  },
  switchLanguage: {
    RU: "Переключить язык",
    EN: "Switch language",
    ZH: "切换语言",
    FR: "Changer de langue",
    AR: "تغيير اللغة",
    HI: "भाषा बदलें",
    ES: "Cambiar idioma"
  },
  lightTheme: {
    RU: "Включить светлую тему",
    EN: "Enable light theme",
    ZH: "启用浅色主题",
    FR: "Activer le thème clair",
    AR: "تفعيل المظهر الفاتح",
    HI: "लाइट थीम सक्षम करें",
    ES: "Activar tema claro"
  },
  darkTheme: {
    RU: "Включить темную тему",
    EN: "Enable dark theme",
    ZH: "启用深色主题",
    FR: "Activer le thème sombre",
    AR: "تفعيل المظهر الداكن",
    HI: "डार्क थीम सक्षम करें",
    ES: "Activar tema oscuro"
  },

  // Welcome banner elements
  kaspiActive: {
    RU: "Портал KASPI запущен",
    EN: "KASPI Portal active",
    ZH: "KASPI 门户已启动",
    FR: "Portail KASPI actif",
    AR: "بوابة KASPI نشطة",
    HI: "KASPI पोर्टल सक्रिय है",
    ES: "Portal KASPI activo"
  },
  welcomeText: {
    RU: "Отслеживайте актуальные биржевые цены ключевых криптовалют напрямую из актуальных котировок CoinMarketCap. Конвертируйте стоимость активов сразу в токены Pi.",
    EN: "Track real-time market prices of benchmark cryptocurrencies sourced directly from active CoinMarketCap feeds. Convert valuations instantly into Pi utility tokens.",
    ZH: "直接从 CoinMarketCap 实时行情中追踪关键加密货币的市场价格。瞬间将资产价值换算为 Pi 实用代币。",
    FR: "Suivez les prix du marché en temps réel des principales crypto-monnaies directement depuis CoinMarketCap. Convertissez instantanément les valeurs en jetons Pi.",
    AR: "تتبع أسعار السوق الفورية للعملات المشفرة الرئيسية مباشرة من CoinMarketCap. قم بتحويل قيمة الأصول على الفور إلى رموز Pi.",
    HI: "CoinMarketCap से सीधे प्रमुख क्रिप्टोकरेंसी की वास्तविक समय की बाजार कीमतों को ट्रैक करें। परिसंपत्तियों के मूल्य को तुरंत Pi उपयोगिता टोकन में परिवर्तित करें।",
    ES: "Siga los precios de mercado en tiempo real de las principales criptomonedas directamente desde CoinMarketCap. Convierta el valor de los activos al instante en tokens Pi."
  },
  basePiRate: {
    RU: "Базовый курс Pi",
    EN: "Base Pi Exchange rate",
    ZH: "Pi 基础汇率",
    FR: "Taux de change de Pi",
    AR: "سعر صرف Pi الأساسي",
    HI: "आधार Pi विनिमय दर",
    ES: "Tipo de cambio base de Pi"
  },
  dataStatus: {
    RU: "Статус данных",
    EN: "Data status",
    ZH: "数据状态",
    FR: "Statut des données",
    AR: "حالة البيانات",
    HI: "डेटा स्थिति",
    ES: "Estado de los datos"
  },

  // Main UI titles & counts
  coinMarket: {
    RU: "Рынок крипто монет",
    EN: "Crypto Coin Market",
    ZH: "加密货币市场",
    FR: "Marché des crypto-monnaies",
    AR: "سوق العملات المشفرة",
    HI: "क्रिप्टो सिक्का बाजार",
    ES: "Mercado de Criptomonedas"
  },
  kaspiQuote: {
    RU: "«Портал KASPI всегда будет обновляться, и будут добавляться новые монеты.»",
    EN: "“The KASPI portal will always be updated, and new coins will be added.”",
    ZH: "“KASPI 门户将始终不断更新，并会持续添加新的币种。”",
    FR: "« Le portail KASPI sera toujours mis à jour et de nouvelles pièces seront ajoutées. »",
    AR: "«سيتم تحديث بوابة KASPI دائمًا، وسيتم إضافة عملات جديدة.»",
    HI: "“KASPI पोर्टल हमेशा अपडेट किया जाएगा, और नए सिक्के जोड़े जाएंगे।”",
    ES: "“El portal KASPI siempre se actualizará y se agregarán nuevas monedas”."
  },
  showingCoinsCount: {
    RU: "Показано валют: {count}",
    EN: "Currencies displayed: {count}",
    ZH: "显示货币数: {count}",
    FR: "Pièces affichées: {count}",
    AR: "العملات المعروضة: {count}",
    HI: "प्रदर्शित सिक्के: {count}",
    ES: "Monedas mostradas: {count}"
  },
  resolvingRates: {
    RU: "Загрузка актуальных котировок из CoinMarketCap...",
    EN: "Resolving real rates from CoinMarketCap API...",
    ZH: "正在从 CoinMarketCap API 加载最新行情...",
    FR: "Chargement des cotations en direct depuis CoinMarketCap...",
    AR: "جاري تحميل أسعار الصرف الحية من CoinMarketCap...",
    HI: "CoinMarketCap API से लाइव दरें लोड की जा रही हैं...",
    ES: "Cargando cotizaciones en vivo desde la API de CoinMarketCap..."
  },
  noCoinsFound: {
    RU: "Монеты не найдены. Попробуйте изменить поисковый запрос.",
    EN: "No compatible assets detected. Please refine your filter parameters.",
    ZH: "未检索到兼容币种。请重新修改您的搜索词。",
    FR: "Aucune pièce trouvée. Veuillez modifier votre recherche.",
    AR: "لم يتم العثور على عملات متوافقة. يرجى تعديل البحث.",
    HI: "कोई सिक्का नहीं मिला। कृपया अपनी खोज परिष्कृत करें।",
    ES: "No se encontraron monedas. Intente modificar su búsqueda."
  },
  clearFilter: {
    RU: "Сбросить поиск",
    EN: "Clear filter parameters",
    ZH: "清除搜索条件",
    FR: "Effacer la recherche",
    AR: "إعادة تعيين البحث",
    HI: "खोज साफ़ करें",
    ES: "Limpiar búsqueda"
  },

  // Coin Detail Modal tabs
  tabAbout: {
    RU: "Описание",
    EN: "About",
    ZH: "描述",
    FR: "Description",
    AR: "الوصف",
    HI: "विवरण",
    ES: "Descripción"
  },
  tabCalc: {
    RU: "Калькулятор Pi / {symbol}",
    EN: "Pi / {symbol} Calc",
    ZH: "Pi / {symbol} 计算器",
    FR: "Calculatrice Pi / {symbol}",
    AR: "حاسبة Pi / {symbol}",
    HI: "Pi / {symbol} कैलक्यूलेटर",
    ES: "Calculadora Pi / {symbol}"
  },
  tabMetrics: {
    RU: "Все Показатели",
    EN: "All Metrics",
    ZH: "所有指标",
    FR: "Toutes les métriques",
    AR: "جميع المؤشرات",
    HI: "सभी संकेतक",
    ES: "Métricas Completas"
  },

  // About App sections
  aboutKaspiTitle: {
    RU: "О приложении KASPI",
    EN: "About KASPI App",
    ZH: "关于 KASPI 应用",
    FR: "À propos de l'application KASPI",
    AR: "حول تطبيق KASPI",
    HI: "KASPI ऐप के बारे में",
    ES: "Acerca de la aplicación KASPI"
  },
  aboutKaspiDesc: {
    RU: "Данный сервис представляет собой портативное приложение (Pi App), предназначенное для работы в Pi Browser. KASPI позволяет быстро анализировать стоимость ключевых глобальных криптовалют в режиме реального времени. Для получения детального аналитического резюме и прогноза нажмите на интересующую монету.",
    EN: "This service functions as a companion web application (Pi App) built specifically for execution inside the Pi Browser. KASPI allows Pioneers to instantly analyze the real-time valuation of major global blockchain currencies. Select any asset in the list to reveal deeply detailed descriptive breakdowns and exchange conversions.",
    ZH: "此服务是专为在 Pi Browser 浏览器内部运行而配套设计的便携应用（Pi App）。KASPI 允许先驱者即时分析全球主要区块链加密货币的实时估值。点击列表中的任何资产可查看深度的资产描述和兑换汇率。",
    FR: "Ce service est une application web portable (Pi App) conçue pour fonctionner dans le navigateur Pi Browser. KASPI permet d'analyser rapidement la valeur des principales crypto-monnaies mondiales en temps réel. Pour obtenir un résumé descriptif et une conversion détaillée, cliquez sur la pièce qui vous intéresse.",
    AR: "هذه الخدمة عبارة عن تطبيق ويب محمول (Pi App) مصمم خصيصًا للعمل داخل متصفح Pi Browser. يتيح برنامج KASPI لرواد الشبكة تحليل القيمة الفورية لعملات البلوكشين العالمية الرئيسية بسرعة. انقر فوق أي عملة في القائمة لعرض تفاصيل الوصف التفصيلي والتحويل المباشر.",
    HI: "यह सेवा एक पोर्टेबल वेब एप्लिकेशन (Pi App) है जिसे विशेष रूप से Pi Browser में चलाने के लिए डिज़ाइन किया गया है। KASPI पायनियर्स को वास्तविक समय में प्रमुख वैश्विक क्रिप्टोकरेंसी के मूल्य का विश्लेषण करने की अनुमति देता है। विस्तृत विवरण और विनिमय रूपांतरण देखने के लिए सूची में किसी भी सिक्के का चयन करें।",
    ES: "Este servicio funciona como una aplicación web portátil (Pi App) diseñada específicamente para ejecutarse dentro de Pi Browser. KASPI permite analizar rápidamente el valor de las principales criptomonedas globales en tiempo real. Seleccione cualquier activo en la lista para ver descripciones detalladas y conversiones de cambio."
  },
  cmcIntegrationTitle: {
    RU: "Интеграция с CoinMarketCap",
    EN: "CoinMarketCap Integration",
    ZH: "CoinMarketCap 整合数据",
    FR: "Intégration CoinMarketCap",
    AR: "التكامل مع CoinMarketCap",
    HI: "CoinMarketCap एकीकरण",
    ES: "Integración con CoinMarketCap"
  },
  cmcIntegrationDesc: {
    RU: "Все котировки в системе синхронизируются в реальном времени напрямую через API CoinMarketCap и CoinGecko, гарантируя надлежащую точность расчетов для пользовательского баланса.",
    EN: "All pricing values are synced in real-time through high-performance endpoints connected to the CoinMarketCap and CoinGecko feeds to provide maximum accuracy in standard valuations and conversions.",
    ZH: "系统中的所有报价直接通过 CoinMarketCap 和 CoinGecko API 进行实时同步，为用户的资产计算提供最大的汇率精准度保障。",
    FR: "Toutes les valeurs de prix sont synchronisées en temps réel via des APIs connectées à CoinMarketCap et CoinGecko pour assurer une précision maximale pour le solde des utilisateurs.",
    AR: "يتم مزامنة جميع عروض الأسعار في النظام في الوقت الفعلي مباشرة من خلال واجهات برمجة تطبيقات CoinMarketCap و CoinGecko لضمان أقصى قدر من الدقة في حسابات المستخدمين.",
    HI: "सिस्टम में सभी मूल्य वास्तविक समय में सीधे CoinMarketCap और CoinGecko API के माध्यम से सिंक्रनाइज़ किए जाते हैं ताकि रूपांतरणों में अधिकतम सटीकता सुनिश्चित की जा सके।",
    ES: "Todas las cotizaciones se sincronizan en tiempo real directamente a través de las API de CoinMarketCap y CoinGecko para garantizar la máxima precisión en las valoraciones y conversiones."
  },
  copyrightText: {
    RU: "© 2026 KASPI. Все права защищены. Разработано для экосистемы Pi Network App Studio.",
    EN: "© 2026 KASPI. All rights reserved. Built for the Pi Network App Studio ecosystem.",
    ZH: "© 2026 KASPI. 保留所有权利。专为 Pi Network App Studio 生态系统开发。",
    FR: "© 2026 KASPI. Tous droits réservés. Développé pour l'écosystème de Pi Network App Studio.",
    AR: "© 2026 KASPI. جميع الحقوق محفوظة. تم التطوير لمنظومة Pi Network App Studio.",
    HI: "© 2026 KASPI. सर्वाधिकार सुरक्षित। Pi Network App Studio पारिस्थितिकी तंत्र के लिए विकसित।",
    ES: "© 2026 KASPI. Todos los derechos reservados. Desarrollado para el ecosistema de Pi Network App Studio."
  },

  // Coin Detail items
  exchangeRateLive: {
    RU: "Текущий курс конверсии:",
    EN: "Live exchange rate:",
    ZH: "实时兑换汇率：",
    FR: "Taux de change en direct :",
    AR: "سعر التحويل المباشر:",
    HI: "लाइव रूपांतरण दर:",
    ES: "Tipo de cambio en vivo:"
  },
  valueText: {
    RU: "Стоимость: ",
    EN: "Value: ",
    ZH: "价值：",
    FR: "Valeur : ",
    AR: "القيمة: ",
    HI: "मूल्य: ",
    ES: "Valor: "
  },
  amountPiName: {
    RU: "Сумма в Pi Network (PI)",
    EN: "Amount in Pi Network (PI)",
    ZH: "Pi Network (PI) 数量",
    FR: "Montant en Pi Network (PI)",
    AR: "المبلغ في Pi Network (PI)",
    HI: "Pi Network (PI) की राशि",
    ES: "Cantidad en Pi Network (PI)"
  },
  amountCryptoName: {
    RU: "Получаете в {symbol}",
    EN: "You receive in {symbol}",
    ZH: "获取 {symbol} 数量",
    FR: "Vous recevez en {symbol}",
    AR: "ستحصل على لـ {symbol}",
    HI: "आपको {symbol} में प्राप्त होगा",
    ES: "Recibe en {symbol}"
  },
  calcNote: {
    RU: "Пары преобразуются на основе текущего курса к базовому токену Pi Network (PI).",
    EN: "Trading pairs are converted using the live exchange rate against the base utility asset Pi Network (PI).",
    ZH: "交易对是基于对基础代币 Pi Network (PI) 的实时汇率进行换算。",
    FR: "Les paires de devises sont converties sur la base du taux de change par rapport au jeton de base Pi Network (PI).",
    AR: "يتم تحويل أزواج التداول بناءً على السعر الفوري مقابل أصل الخدمة الأساسي Pi Network (PI).",
    HI: "ट्रेडिंग जोड़े को आधार उपयोगिता परिसंपत्ति Pi Network (PI) के लाइव विनिमय दर का उपयोग करके परिवर्तित किया जाता है।",
    ES: "Los pares de trading se convierten basándose en el tipo de cambio en vivo con respecto al activo de utilidad base Pi Network (PI)."
  },

  // Coin metrics labels
  marketPriceUsd: {
    RU: "Рыночная цена (USD)",
    EN: "Market Price (USD)",
    ZH: "市场价格 (USD)",
    FR: "Prix du marché (USD)",
    AR: "سعر السوق (USD)",
    HI: "बाज़ार मूल्य (USD)",
    ES: "Precio de Mercado (USD)"
  },
  priceChange24h: {
    RU: "Изменение за 24ч",
    EN: "24h Price Change",
    ZH: "24小时价格涨跌",
    FR: "Variation sur 24h",
    AR: "تغير السعر في 24 ساعة",
    HI: "24 घंटे का मूल्य परिवर्तन",
    ES: "Cambio de Precio 24h"
  },
  marketCapTitle: {
    RU: "Общая Капитализация",
    EN: "Market Capitalization",
    ZH: "市值总额",
    FR: "Capitalisation boursière",
    AR: "القيمة السوقية الإجمالية",
    HI: "कुल बाजार पूंजीकरण",
    ES: "Capitalización de Mercado"
  },
  volume24hTitle: {
    RU: "Объем торгов за сутки",
    EN: "24h Trading Volume",
    ZH: "24小时交易量",
    FR: "Volume d'échange sur 24h",
    AR: "حجم التداول في 24 ساعة",
    HI: "24 घंटे का ट्रेडिंग वॉल्यूम",
    ES: "Volumen de Trading 24h"
  },
  circulatingSupplyTitle: {
    RU: "Циркулирующее предложение",
    EN: "Circulating Supply",
    ZH: "流通供给量",
    FR: "Offre en circulation",
    AR: "المعروض المتداول",
    HI: "परिसंचारी आपूर्ति",
    ES: "Suministro Circulante"
  },
  maxSupplyTitle: {
    RU: "Макс. предложение",
    EN: "Max Supply",
    ZH: "最大供给量",
    FR: "Offre maximale",
    AR: "الحد الأقصى للمعروض",
    HI: "अधिकतम आपूर्ति",
    ES: "Suministro Máximo"
  },
  unlimitedText: {
    RU: "∞ Неограничено",
    EN: "∞ Unlimited",
    ZH: "∞ 无上限",
    FR: "∞ Illimité",
    AR: "∞ غير محدود",
    HI: "∞ असीमित है",
    ES: "∞ Ilimitado"
  },
  coinRank: {
    RU: "Рейтинг монеты",
    EN: "Coin Rank",
    ZH: "币种排名",
    FR: "Rang de la pièce",
    AR: "تصنيف العملة",
    HI: "सिक्का रैंक",
    ES: "Clasificación de Moneda"
  },
  coinRankSubtitle: {
    RU: "Ранг по рыночной капитализации",
    EN: "Rank by total market capitalization",
    ZH: "基于市值总和的排名",
    FR: "Rang par capitalisation globale",
    AR: "الترتيب حسب القيمة السوقية الإجمالية",
    HI: "कुल बाजार पूंजीकरण के आधार पर रैंक",
    ES: "Clasificación por capitalización de mercado total"
  },

  // Quoting indicators bottom inside modal
  quotingService: {
    RU: "Служба котировок:",
    EN: "Quoting Engine:",
    ZH: "行情报级服务：",
    FR: "Service de cotation :",
    AR: "خدمة التسعير:",
    HI: "कोटिंग सेवा:",
    ES: "Servicio de Cotización:"
  },
  lastUpdatedLabel: {
    RU: "Дата последнего обновления:",
    EN: "Last update time:",
    ZH: "上次更新时间：",
    FR: "Dernière mise à jour :",
    AR: "تاريخ آخر تحديث:",
    HI: "अंतिम अद्यतन समय:",
    ES: "Última actualización:"
  },
  piNetworkStatus: {
    RU: "Статус Сети Pi Network:",
    EN: "Pi Network Status:",
    ZH: "Pi Network 状态：",
    FR: "Statut du réseau Pi :",
    AR: "حالة شبكة Pi Network:",
    HI: "Pi Network नेटवर्क स्थिति:",
    ES: "Estado de Pi Network:"
  },
  piSandboxText: {
    RU: "Доступно во фрейме Pi App Browser",
    EN: "Available inside Pi sandbox",
    ZH: "在 Pi 浏览器沙盒中可用",
    FR: "Disponible dans le bac à sable Pi Browser",
    AR: "متاح داخل صندوق رمل Pi",
    HI: "Pi ब्राउज़र सैंडबॉक्स के भीतर उपलब्ध है",
    ES: "Disponible dentro del Sandbox de Pi"
  },
  internetRequired: {
    RU: "Для работы нужен доступ в Интернет",
    EN: "Requires active internet access",
    ZH: "运行需要活跃的网络连接",
    FR: "Connexion Internet requise",
    AR: "يتطلب اتصالًا نشطًا بالإنترنت",
    HI: "सक्रिय इंटरनेट कनेक्शन की आवश्यकता है",
    ES: "Requiere acceso activo a Internet"
  },

  // Descriptions loadings
  descriptionLoading: {
    RU: "Загрузка описания монеты...",
    EN: "Loading coin description...",
    ZH: "正在加载币种描述...",
    FR: "Chargement de la description de la pièce...",
    AR: "جاري تحميل تفاصيل العملة...",
    HI: "सिक्का विवरण लोड किया जा रहा है...",
    ES: "Cargando descripción de la moneda..."
  },
  descriptionFormatting: {
    RU: "Описание формируется...",
    EN: "Compiling metrics...",
    ZH: "正在汇编指标...",
    FR: "Compilation des métriques...",
    AR: "جاري تجميع المؤشرات...",
    HI: "संकेतक संकलित किए जा रहे हैं...",
    ES: "Compilando métricas..."
  },
  descriptionError1: {
    RU: "Не удалось получить информацию по данной монете.",
    EN: "Failed to obtain asset insights.",
    ZH: "获取此代币的信息失败。",
    FR: "Impossible d'obtenir des informations sur cette pièce.",
    AR: "فشل في الحصول على معلومات عن هذه العملة.",
    HI: "इस सिक्के के बारे में जानकारी प्राप्त करने में विफल।",
    ES: "No se pudo obtener información sobre esta moneda."
  },
  descriptionError2: {
    RU: "Возникла ошибка при подключении к серверу ИИ.",
    EN: "Communication error with analytic engine.",
    ZH: "与信息服务器通信时发生错误。",
    FR: "Erreur de communication avec le serveur d'informations.",
    AR: "حدث خطأ أثناء الاتصال بخادم المعلومات.",
    HI: "सूचना सर्वर से कनेक्ट करते समय कोई त्रुटि हुई।",
    ES: "Error de comunicación con el servidor de información."
  },

  // CoinCard components
  equivalentLabel: {
    RU: "Эквивалент: ",
    EN: "Equivalent: ",
    ZH: "等值：",
    FR: "Équivalent : ",
    AR: "ما يعادل: ",
    HI: "समतुल्य: ",
    ES: "Equivalente: "
  },
  basePiTokenName: {
    RU: "Базовый токен Pi Network",
    EN: "Base Pi Network Token",
    ZH: "Pi Network 基础代币",
    FR: "Jeton de base Pi Network",
    AR: "رمز Pi Network الأساسي",
    HI: "आधार Pi Network टोकन",
    ES: "Token base de Pi Network"
  },
  metricCap: {
    RU: "Капитализация",
    EN: "Market Cap",
    ZH: "市值",
    FR: "Cap. boursière",
    AR: "القيمة السوقية",
    HI: "बाजार कैप",
    ES: "Cap. de Mercado"
  },
  metricVol24: {
    RU: "Объем 24ч",
    EN: "Volume 24h",
    ZH: "24小时额",
    FR: "Volume 24h",
    AR: "حجم 24 ساعة",
    HI: "वॉल्यूम 24 घंटे",
    ES: "Volumen 24h"
  },

  // Errors inside application
  syncIssueText: {
    RU: "Проблема при синхронизации",
    EN: "Sync issue detected",
    ZH: "检测到同步问题",
    FR: "Problème de synchronisation détecté",
    AR: "تم اكتشاف مشكلة в المزامنة",
    HI: "सिंक्रनाइज़ेशन समस्या का पता चला",
    ES: "Problema de sincronización detectado"
  },
  piTestTitle: {
    RU: "Тестирование транзакций (Пункт 10)",
    EN: "Transaction Testing (Step 10)",
    ZH: "交易测试（第 10 步）",
    FR: "Test de Transaction (Étape 10)",
    AR: "اختبار المعاملات (الخطوة 10)",
    HI: "लेनदेन परीक्षण (चरण 10)",
    ES: "Prueba de Transacción (Paso 10)"
  },
  piTestDesc: {
    RU: "Для закрытия 10-го пункта в Личном Кабинете разработчика Pi выберите количество монет и отправьте тестовый платеж непосредственно внутри Вашего приложения в Pi Browser.",
    EN: "To complete Step 10 in the Pi Developer Portal, select the desired test amount and execute a real user-to-app payment inside the Pi Browser.",
    ZH: "为了在 Pi 开发者后台关闭第 10 步，请选择测试金额并直接在 Pi 浏览器内的应用中发送测试付款。",
    FR: "Pour fermer l'étape 10 dans la console développeur Pi, sélectionnez le montant et envoyez un paiement de test directement dans le Pi Browser.",
    AR: "لإغلاق الخطوة 10 في لوحة مطور Pi، حدد قيمة الاختبار وأرسل دفعة مستخدم إلى تطبيق (User-to-App) مباشرة داخل متصفح Pi.",
    HI: "Pi डेवलपर पोर्टल में चरण 10 को बंद करने के लिए, परीक्षण राशि का चयन करें और सीधे Pi ब्राउज़र के भीतर अपने एप्लिकेशन में परीक्षण भुगतान भेजें।",
    ES: "Para completar el Paso 10 en la consola de desarrollador de Pi, seleccione la cantidad de prueba y envíe un pago de prueba de usuario a aplicación directamente dentro del Pi Browser."
  },
  btnPay: {
    RU: "Отправить {amount} PI",
    EN: "Send {amount} PI",
    ZH: "发送 {amount} PI",
    FR: "Envoyer {amount} PI",
    AR: "إرسال {amount} PI",
    HI: "{amount} PI भेजें",
    ES: "Enviar {amount} PI"
  },
  btnAuth: {
    RU: "Авторизоваться по Pi Network",
    EN: "Authenticate with Pi Network",
    ZH: "授权 Pi Network 账户",
    FR: "S'authentifier avec Pi Network",
    AR: "تسجيل الدخول مع Pi Network",
    HI: "Pi Network से प्रमाणित करें",
    ES: "Autenticarse con Pi Network"
  },
  piBrowserRequired: {
    RU: "Разблокировка premium-прогнозов доступна только внутри официального Pi Browser. Пожалуйста, откройте это приложение внутри Pi Browser!",
    EN: "Unlocking premium forecasts is only supported inside the official Pi App Browser. Please open this application inside your Pi Browser!",
    ZH: "解锁高级预测功能仅在官方 Pi 浏览器中受支持。请在您的 Pi 浏览器中打开此应用！",
    FR: "Le déverrouillage des prévisions premium est uniquement pris en charge dans l'application officielle Pi Browser. Veuillez ouvrir cette application dans votre Pi Browser !",
    AR: "إلغاء قفل التوقعات المميزة مدعوم فقط داخل تطبيق Pi Browser الرسمي. يرجى فتح هذا التطبيق داخل متصفح Pi!",
    HI: "प्रीमियम पूर्वानुमानों को अनलॉक करना केवल आधिकारिक Pi ब्राउज़र के भीतर समर्थित है। कृपया इस एप्लिकेशन को अपने Pi ब्राउज़र के भीतर खोलें!",
    ES: "El acceso a los pronósticos premium solo está disponible utilizando el navegador oficial de Pi Browser. ¡Por favor abra esta aplicación dentro de su Pi Browser!"
  }
};

// Help helper function to load strings safely
export function getTranslation(key: string, lang: KaspiLang, countPlaceholder?: string): string {
  const dictionary = TRANSLATIONS[key];
  if (!dictionary) return key;
  let translated = dictionary[lang] || dictionary.EN || key;
  if (countPlaceholder !== undefined) {
    translated = translated.replace("{count}", countPlaceholder);
  }
  return translated;
}

export function getCategoryTranslation(category: string, lang: KaspiLang): string {
  const dict: Record<string, Record<KaspiLang, string>> = {
    "Utility / Network Coin": {
      RU: "Служебный токен / Сеть",
      EN: "Utility / Network Coin",
      ZH: "实用型代币 / 公链",
      FR: "Jeton utilitaire / Réseau",
      AR: "رمز خدمة / شبكة أساسية",
      HI: "उपयोगिता टोकन / नेटवर्क",
      ES: "Token de Utilidad / Red"
    },
    "Store of Value": {
      RU: "Средство сбережения",
      EN: "Store of Value",
      ZH: "价值存储资产",
      FR: "Réserve de valeur",
      AR: "مخزن القيمة",
      HI: "मूल्य का भंडार",
      ES: "Reserva de Valor"
    },
    "Smart Contracts": {
      RU: "Смарт-контракты",
      EN: "Smart Contracts",
      ZH: "智能合约平台",
      FR: "Contrats intelligents",
      AR: "العقود الذكية",
      HI: "स्मार्ट कॉन्ट्रैक्ट्स",
      ES: "Contratos Inteligentes"
    },
    "Cross-border Payments": {
      RU: "Трансграничные платежи",
      EN: "Cross-border Payments",
      ZH: "跨境支付网络",
      FR: "Paiements transfrontaliers",
      AR: "المدفوعات عبر الحدود",
      HI: "सीमा पार भुगतान",
      ES: "Pagos Transfronterizos"
    },
    "Enterprise Ledger": {
      RU: "Корпоративный реестр",
      EN: "Enterprise Ledger",
      ZH: "企业级分布式账本",
      FR: "Registre d'entreprise",
      AR: "دفتر الأستاذ للمؤسسات",
      HI: "एंटरप्राइज लेजर",
      ES: "Libro Mayor Empresarial"
    },
    "Crypto Payment Ecosystem": {
      RU: "Платежная экосистема",
      EN: "Crypto Payment Ecosystem",
      ZH: "加密支付生态圈",
      FR: "Écosystème de paiement crypto",
      AR: "منظومة مدفوعات التشفير",
      HI: "भुगतान पारिस्थितिकी तंत्र",
      ES: "Ecosistema de Pagos Cripto"
    },
    "Crypto Payments Ecosystem": {
      RU: "Платежная экосистема",
      EN: "Crypto Payments Ecosystem",
      ZH: "加密支付生态圈",
      FR: "Écosystème de paiement crypto",
      AR: "منظومة مدفوعات التشفير",
      HI: "भुगतान पारिस्थितिकी तंत्र",
      ES: "Ecosistema de Pagos Cripto"
    },
    "DeFi / Payments": {
      RU: "DeFi / Платежи",
      EN: "DeFi / Payments",
      ZH: "去中心化金融 / 结算",
      FR: "DeFi / Paiements",
      AR: "التمويل اللامركزي / مدفوعات",
      HI: "DeFi / भुगतान",
      ES: "DeFi / Pagos"
    },
    "Exchange Token / L1": {
      RU: "Токен биржи / L1 блокчейн",
      EN: "Exchange Token / L1",
      ZH: "交易所平台币 / L1公链",
      FR: "Jeton d'échange / L1",
      AR: "رمز منصة تداول / L1",
      HI: "एक्सचेंज टोकन / L1 नेटवर्क",
      ES: "Token de Intercambio / L1"
    },
    "Telegram Ecosystem": {
      RU: "Экосистема Telegram",
      EN: "Telegram Ecosystem",
      ZH: "电报 (Telegram) 生态",
      FR: "Écosystème Telegram",
      AR: "منظومة تيليجرام",
      HI: "टेलीग्राम पारिस्थितिकी तंत्र",
      ES: "Ecosistema de Telegram"
    },
    "Wallet Utility": {
      RU: "Служебный токен кошелька",
      EN: "Wallet Utility",
      ZH: "钱包实用型代币",
      FR: "Utilitaire de portefeuille",
      AR: "خدمة المحفظة",
      HI: "वॉलेट उपयोगिता टोकन",
      ES: "Utilidad de Billetera"
    }
  };

  const lookup = dict[category];
  if (!lookup) return category;
  return lookup[lang] || lookup.EN || category;
}
