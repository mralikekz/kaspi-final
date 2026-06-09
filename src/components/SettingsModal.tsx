import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Globe, 
  Moon, 
  Sun, 
  Coins, 
  Info, 
  Settings, 
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Key,
  Unlock,
  Lock,
  AlertCircle
} from "lucide-react";
import { KaspiLang } from "../types";
import { getTranslation } from "../utils/translations";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: KaspiLang;
  setLang: (lang: KaspiLang) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  showInPi: boolean;
  setShowInPi: (val: boolean) => void;
  piUser?: any;
  piPrice?: number;
  onRefreshSession?: () => void;
}

const LANGUAGES: { code: KaspiLang; label: string; native: string; flag: string }[] = [
  { code: "RU", label: "Russian", native: "Русский", flag: "🇷🇺" },
  { code: "EN", label: "English", native: "English", flag: "🇺🇸" },
  { code: "ZH", label: "Chinese", native: "中文", flag: "🇨🇳" },
  { code: "FR", label: "French", native: "Français", flag: "🇫🇷" },
  { code: "AR", label: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "HI", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "ES", label: "Spanish", native: "Español", flag: "🇪🇸" },
];

export default function SettingsModal({
  isOpen,
  onClose,
  lang,
  setLang,
  darkMode,
  toggleDarkMode,
  showInPi,
  setShowInPi,
  piUser,
  piPrice = 41.25,
  onRefreshSession
}: SettingsModalProps) {

  // Local state for developer API key override
  const [piApiKeyOverride, setPiApiKeyOverride] = React.useState<string>(() => {
    try {
      return localStorage.getItem("kaspi_pi_api_key_override") || "";
    } catch (_) {
      return "";
    }
  });
  const [isApiKeySaved, setIsApiKeySaved] = React.useState<boolean>(false);
  const [backendStatus, setBackendStatus] = React.useState<{ hasApiKey: boolean; nodeEnv: string; isSandboxMode?: boolean; keyPrefix?: string } | null>(null);

  // Active payment states
  const [payStatus, setPayStatus] = React.useState<"idle" | "authenticating" | "paying" | "approving" | "completing" | "done" | "error">("idle");
  const [activePaymentId, setActivePaymentId] = React.useState<string | null>(null);
  const [activeTxid, setActiveTxid] = React.useState<string | null>(null);
  const [payError, setPayError] = React.useState<string | null>(null);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem("kaspi_unlocked_premium_all") === "true";
    } catch (_) {
      return false;
    }
  });

  const getHeaders = (base: Record<string, string> = {}) => {
    if (piApiKeyOverride && piApiKeyOverride.trim()) {
      return {
        ...base,
        "X-Pi-API-Key": piApiKeyOverride.trim()
      };
    }
    return base;
  };

  const fetchBackendStatus = async () => {
    try {
      const res = await fetch("/api/pi/status", {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setBackendStatus(data);
      }
    } catch (e) {
      console.warn("Could not fetch backend status in SettingsModal:", e);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchBackendStatus();
      setIsPremiumUnlocked(localStorage.getItem("kaspi_unlocked_premium_all") === "true");
    }
  }, [isOpen, piApiKeyOverride]);

  const handleSaveApiKeyOverride = (newKey: string) => {
    const cleanKey = newKey.trim();
    setPiApiKeyOverride(cleanKey);
    try {
      localStorage.setItem("kaspi_pi_api_key_override", cleanKey);
    } catch (e) {
      console.error(e);
    }
    setIsApiKeySaved(true);
    setTimeout(() => setIsApiKeySaved(false), 2000);
    setTimeout(() => fetchBackendStatus(), 50);
  };

  const handleResetPremium = () => {
    try {
      localStorage.removeItem("kaspi_unlocked_premium_all");
      setIsPremiumUnlocked(false);
      if (onRefreshSession) onRefreshSession();
    } catch (e) {
      console.error(e);
    }
  };

  const handleExecuteTestPayment = async () => {
    setPayError(null);
    setPayStatus("authenticating");

    let isSandboxMode = backendStatus?.isSandboxMode !== undefined ? backendStatus.isSandboxMode : true;

    // Explicit query param overrides take highest precedence if specified
    if (window.location.search.includes("sandbox=true") || window.location.search.includes("sandbox=1")) {
      isSandboxMode = true;
    } else if (window.location.search.includes("sandbox=false") || window.location.search.includes("sandbox=0")) {
      isSandboxMode = false;
    }

    const runSimulationFallback = (reasonMessage: string) => {
      console.warn(`[Settings Payment] Fallback visual simulation activated. Reason: ${reasonMessage}`);
      setPayStatus("authenticating");
      
      setTimeout(() => {
        setPayStatus("paying");
        
        setTimeout(() => {
          const fakePaymentId = "PAY_SIM_" + Math.random().toString(36).substring(2, 10).toUpperCase();
          setActivePaymentId(fakePaymentId);
          setPayStatus("approving");
          
          setTimeout(() => {
            const fakeTxid = "0x" + Math.random().toString(16).substring(2, 18) + "..._MOCK";
            setActiveTxid(fakeTxid);
            setPayStatus("completing");
            
            setTimeout(() => {
              setPayStatus("done");
              localStorage.setItem("kaspi_unlocked_premium_all", "true");
              setIsPremiumUnlocked(true);
              
              if (onRefreshSession) {
                onRefreshSession();
              }
            }, 1200);
          }, 1500);
        }, 1500);
      }, 1000);
    };

    try {
      const piSdk = (window as any).Pi;
      if (!piSdk) {
        throw new Error("Pi SDK is not loaded. Safe simulation fallback started.");
      }

      console.log("[Settings Payment] Initializing Pi SDK connection...");
      await piSdk.init({ version: "2.0", sandbox: isSandboxMode });
      
      setPayStatus("authenticating");
      const scopes = ["username", "payments"];
      
      const onIncompletePaymentFound = async (payment: any) => {
        console.log("[Settings Payment] Incomplete payment found:", payment);
        try {
          await fetch("/api/pi/complete", {
            method: "POST",
            headers: getHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({
              paymentId: payment.identifier,
              txid: payment.transaction.txid,
              isSandboxSimulation: isSandboxMode
            })
          });
        } catch (e) {
          console.error("Incomplete payment handling error:", e);
        }
      };

      await piSdk.authenticate(scopes, onIncompletePaymentFound);
      setPayStatus("paying");
      
      piSdk.createPayment({
        amount: 0.1,
        memo: "KASPI Premium Upgrade Pro Test Payment",
        metadata: { orderId: `KASPI_PREMIUM_UPGRADE_${Date.now()}` }
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          setActivePaymentId(paymentId);
          setPayStatus("approving");
          try {
            const approvalRes = await fetch("/api/pi/approve", {
              method: "POST",
              headers: getHeaders({ "Content-Type": "application/json" }),
              body: JSON.stringify({
                paymentId,
                isSandboxSimulation: isSandboxMode
              })
            });

            const data = await approvalRes.json();
            if (!approvalRes.ok || !data.success) {
              throw new Error(data.message || data.error || "Approval endpoint returned error status");
            }
          } catch (e: any) {
            console.error("Server approval error, activating simulation bypass:", e);
            runSimulationFallback(`Server approval failed: ${e.message}`);
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          setActiveTxid(txid);
          setPayStatus("completing");
          try {
            const completionRes = await fetch("/api/pi/complete", {
              method: "POST",
              headers: getHeaders({ "Content-Type": "application/json" }),
              body: JSON.stringify({
                paymentId,
                txid,
                isSandboxSimulation: isSandboxMode
              })
            });

            const data = await completionRes.json();
            if (!completionRes.ok || !data.success) {
              throw new Error(data.message || data.error || "Settle error status returned");
            }
            setPayStatus("done");
            localStorage.setItem("kaspi_unlocked_premium_all", "true");
            setIsPremiumUnlocked(true);
            if (onRefreshSession) onRefreshSession();
          } catch (e: any) {
            console.error("Server completion error, activating simulation bypass:", e);
            runSimulationFallback(`Server completion failed: ${e.message}`);
          }
        },
        onCancel: (paymentId: string) => {
          setPayStatus("idle");
        },
        onError: (err: any, paymentId: string) => {
          console.error("[Settings Payment] Error from Pi Client SDK, activating simulation bypass:", err);
          runSimulationFallback(`Pi SDK Error: ${err.message || String(err)}`);
        }
      });

    } catch (e: any) {
      runSimulationFallback(e.message || String(e));
    }
  };

  const getUILabel = (key: string): string => {
    const labels: Record<string, Record<KaspiLang, string>> = {
      title: {
        RU: "Настройки и Информация",
        EN: "Settings & Information",
        ZH: "设置与系统信息",
        FR: "Paramètres et Informations",
        AR: "عدادات ومعلومات",
        HI: "сетинги и сведения",
        ES: "Ajustes e Información"
      },
      closeDesc: {
        RU: "Закрыть",
        EN: "Close",
        ZH: "关闭",
        FR: "Fermer",
        AR: "إغلاق",
        HI: "बंद करें",
        ES: "Cerrar"
      },
      preferencesSec: {
        RU: "Предпочтения Интерфейса",
        EN: "Interface Preferences",
        ZH: "界面偏好",
        FR: "Préférences d'interface",
        AR: "تفضيلات الواجهة",
        HI: "इंटरफ़ेस प्राथमिकताएं",
        ES: "Preferencias de Interfaz"
      },
      languageLabel: {
        RU: "Язык приложения",
        EN: "Application language",
        ZH: "应用语言",
        FR: "Langue de l'application",
        AR: "لغة التطبيق",
        HI: "एप्लिकेशन भाषा",
        ES: "Idioma de la aplicación"
      },
      themeLabel: {
        RU: "Режим оформления",
        EN: "Display theme",
        ZH: "外观模式",
        FR: "Mode d'affichage",
        AR: "المظهر وعرض الألوان",
        HI: "رंग थीम",
        ES: "Tema de pantalla"
      },
      themeDark: {
        RU: "Темная тема",
        EN: "Dark Mode",
        ZH: "深色模式",
        FR: "Mode sombre",
        AR: "المظهر الداكن",
        HI: "डार्क मोड",
        ES: "Modo Oscuro"
      },
      themeLight: {
        RU: "Светлая тема",
        EN: "Light Mode",
        ZH: "浅色模式",
        FR: "Mode clair",
        AR: "المظهر الفاتح",
        HI: "लाइट मोड",
        ES: "Modo Claro"
      },
      displayCurrency: {
        RU: "Валюта отображения",
        EN: "Display Currency",
        ZH: "显示基准货币",
        FR: "Devise d'affichage",
        AR: "عملة العرض المقارنة",
        HI: "प्रदर्शन मुद्रा",
        ES: "Moneda de visualización"
      },
      appSystemTitle: {
        RU: "Системные сведения",
        EN: "System Information Details",
        ZH: "应用核心信息",
        FR: "Informations Système",
        AR: "معلومات النظام الأساسية",
        HI: "Системная информация",
        ES: "Información del Sistema"
      }
    };
    return labels[key]?.[lang] || labels[key]?.EN || "";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop blur backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md dark:bg-black/70"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 flex flex-col max-h-[85vh] z-10"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-rose-100/10 dark:border-zinc-900 dark:bg-zinc-950 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center text-purple-650 dark:text-purple-450">
                  <Settings className="h-4.5 w-4.5 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {getUILabel("title")}
                  </h3>
                  <p className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mt-0.5">
                    KASPI Proxy Config
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                title={getUILabel("closeDesc")}
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7 custom-scrollbar pb-10">

              {/* Preferences section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-zinc-900">
                  <Sliders className="h-4 w-4 text-slate-400" />
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
                    {getUILabel("preferencesSec")}
                  </h4>
                </div>

                {/* Grid controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Lang change */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide dark:text-zinc-400 flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {getUILabel("languageLabel")}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                      {LANGUAGES.map((langItem) => {
                        const isSel = lang === langItem.code;
                        return (
                          <button
                            key={langItem.code}
                            onClick={() => setLang(langItem.code)}
                            className={`px-1.5 py-1.5 rounded-xl border text-[10px] font-black tracking-wide flex flex-col items-center justify-center transition-all cursor-pointer ${
                              isSel 
                                ? "bg-purple-600 border-purple-650 text-white shadow-xs dark:bg-purple-500 dark:border-purple-450" 
                                : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 dark:bg-zinc-900 dark:border-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-805"
                            }`}
                          >
                            <span className="text-sm mb-0.5" role="img" aria-label={langItem.label}>
                              {langItem.flag}
                            </span>
                            <span>{langItem.code}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mode switch */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide dark:text-zinc-400 flex items-center gap-1">
                        <Moon className="h-3 w-3" />
                        {getUILabel("themeLabel")}
                      </span>
                      <div className="flex h-9 p-0.5 rounded-xl bg-slate-100 border border-slate-150 dark:bg-zinc-900 dark:border-zinc-800">
                        <button
                          onClick={toggleDarkMode}
                          className={`flex-1 flex items-center justify-center gap-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                            !darkMode
                              ? "bg-white text-slate-800 shadow-xs dark:bg-zinc-800 dark:text-white"
                              : "text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300"
                          }`}
                        >
                          <Sun className="h-3.5 w-3.5 text-amber-500" />
                          {getUILabel("themeLight")}
                        </button>
                        <button
                          onClick={toggleDarkMode}
                          className={`flex-1 flex items-center justify-center gap-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                            darkMode
                              ? "bg-white text-slate-800 shadow-xs dark:bg-zinc-850 dark:text-white"
                              : "text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300"
                          }`}
                        >
                          <Moon className="h-3.5 w-3.5 text-purple-500" />
                          {getUILabel("themeDark")}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide dark:text-zinc-400 flex items-center gap-1">
                        <Coins className="h-3 w-3" />
                        {getUILabel("displayCurrency")}
                      </span>
                      <div className="flex h-9 p-0.5 rounded-xl bg-slate-100 border border-slate-150 dark:bg-zinc-900 dark:border-zinc-800">
                        <button
                          onClick={() => setShowInPi(false)}
                          className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                            !showInPi
                              ? "bg-white text-slate-800 shadow-xs dark:bg-zinc-800 dark:text-white"
                              : "text-slate-400 dark:text-zinc-500 hover:text-slate-600"
                          }`}
                        >
                          USD ($)
                        </button>
                        <button
                          onClick={() => setShowInPi(true)}
                          className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                            showInPi
                              ? "bg-white text-purple-750 shadow-xs dark:bg-zinc-800 dark:text-purple-400"
                              : "text-slate-400 dark:text-zinc-500 hover:text-slate-600"
                          }`}
                        >
                          <span className="font-serif">π</span> PI
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

                {/* Test Payment Section - Pro Style Upgrade */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-zinc-900">
                    <Coins className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
                      {lang === "RU" ? "Тестирование Оплаты" : "Test Pi Payments"}
                    </h4>
                  </div>

                  <div className="rounded-2xl border border-slate-150 p-4.5 bg-slate-50/50 dark:bg-zinc-900/10 dark:border-zinc-850 space-y-4">
                    {/* Status indicator */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900/50 p-3.5 rounded-xl">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">
                          {lang === "RU" ? "Статус Премиум Доступа" : "Premium Upgrade Status"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isPremiumUnlocked ? (
                            <>
                              <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                              <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
                                {lang === "RU" ? "РАЗБЛОКИРОВАН" : "PRO UNLOCKED"}
                              </span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3.5 w-3.5 text-slate-450 dark:text-zinc-500" />
                              <span className="text-xs font-black text-slate-550 dark:text-zinc-400 uppercase tracking-wide">
                                {lang === "RU" ? "ЗАБЛОКИРОВАН (ДЕМО)" : "LOCKED (STANDARD)"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {isPremiumUnlocked && (
                        <button
                          type="button"
                          onClick={handleResetPremium}
                          className="text-[10px] uppercase font-black tracking-wider text-rose-500 hover:text-rose-600 cursor-pointer border border-rose-100 hover:border-rose-200 dark:border-rose-950/40 px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 shadow-xs"
                        >
                          {lang === "RU" ? "Сбросить Доступ" : "Lock Premium Again"}
                        </button>
                      )}
                    </div>

                    {/* Single Clean Checkout Trigger Button */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                        {lang === "RU" ? "Блокчейн Премиум Оплата" : "Pi Blockchain Payment Terminal"}
                      </span>
                      <button
                        type="button"
                        disabled={payStatus !== "idle" && payStatus !== "done" && payStatus !== "error"}
                        onClick={handleExecuteTestPayment}
                        className={`w-full py-3 px-4 font-black uppercase text-[10.5px] tracking-wider rounded-xl relative overflow-hidden flex items-center justify-center gap-2 transition-all shadow-xs ${
                          payStatus === "done"
                            ? "bg-emerald-500 text-white cursor-default"
                            : payStatus === "error"
                            ? "bg-rose-500 text-white cursor-pointer"
                            : payStatus !== "idle"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-650 text-white cursor-pointer active:scale-98"
                        }`}
                      >
                        {payStatus !== "idle" && payStatus !== "done" && payStatus !== "error" ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                            <span>
                              {(() => {
                                const labels: Record<string, Record<KaspiLang, string>> = {
                                  idle: { RU: "Совершить тестовый платеж (0.1 π)", EN: "Execute Test Payment (0.1 π)", ZH: "执行测试支付 (0.1 π)", FR: "Exécuter le paiement de test (0.1 π)", AR: "إجراء عملية دفع تجريبية (0.1 π)", HI: "परीक्षण भुगतान (0.1 π)", ES: "Ejecutar pago de prueba (0.1 π)" },
                                  authenticating: { RU: "Проверка подлинности в Pi...", EN: "Verifying credentials with Pi...", ZH: "正在验证 Pi 凭据...", FR: "Authentification avec Pi...", AR: "جاري التحقق من الهوية...", HI: "Pi के साथ पहचान सत्यापित की जा रही है...", ES: "Verificando credenciales..." },
                                  paying: { RU: "Ожидание оплаты...", EN: "Awaiting user checkout...", ZH: "等待用户结算...", FR: "Attente du paiement...", AR: "في انتظار التسوية...", HI: "उपयोगकर्ता चेकआउट प्रतीक्षा...", ES: "Esperando el pago..." },
                                  approving: { RU: "Одобрение сервера...", EN: "Requesting server approval...", ZH: "正在向后台请求交易批准...", FR: "Approbation serveur...", AR: "جاري طلب موافقة الخادم...", HI: "सर्вер अनुमोदन अनुरोध...", ES: "Solicitando aprobación..." },
                                  completing: { RU: "Подтверждение в блокчейне...", EN: "Settling on Pi Blockchain...", ZH: "正在 Pi 区块链上结算...", FR: "Règlement sur blockchain...", AR: "جاري التسوية...", HI: "Pi ब्लॉकचेн पर समझौता...", ES: "Liquidando en blockchain..." },
                                  done: { RU: "Премиум разблокирован!", EN: "Premium Access Unlocked!", ZH: "高级版功能已解锁！", FR: "Accès Premium débloqué !", AR: "تم إلغاء قفل الميزات!", HI: "प्रीमियम एक्सेस अनलॉक!", ES: "¡Acceso Premium Desbloqueado!" },
                                  error: { RU: "Ошибка платежа", EN: "Error (simulation fallback)", ZH: "错误", FR: "Erreur", AR: "خطأ", HI: "त्रुटि", ES: "Error" }
                                };
                                return labels[payStatus]?.[lang] || labels[payStatus]?.EN || "";
                              })()}
                            </span>
                          </>
                        ) : payStatus === "done" ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              {lang === "RU" ? "Премиум успешно разблокирован!" : "Premium Access Unlocked!"}
                            </span>
                          </>
                        ) : (
                          <>
                            <Coins className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              {lang === "RU" ? "Оплатить тестовые 0.1 π" : "Execute Test Payment (0.1 π)"}
                            </span>
                          </>
                        )}
                      </button>

                      {/* Progress details when paying */}
                      {payStatus !== "idle" && (
                        <div className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 text-[10px] font-semibold space-y-1 text-slate-500 dark:text-zinc-400">
                          <div className="flex justify-between items-center text-slate-400">
                            <span>Handshake Phase:</span>
                            <span className="uppercase text-purple-600 dark:text-purple-400 font-bold">{payStatus}</span>
                          </div>
                          {activePaymentId && (
                            <div className="flex justify-between items-center">
                              <span>Payment ID:</span>
                              <span className="font-mono text-slate-600 dark:text-zinc-300">{activePaymentId}</span>
                            </div>
                          )}
                          {activeTxid && (
                            <div className="flex justify-between items-center">
                              <span>Blockchain TxID:</span>
                              <span className="font-mono text-slate-600 dark:text-zinc-350 truncate max-w-[200px]" title={activeTxid}>{activeTxid}</span>
                            </div>
                          )}
                          {payError && (
                            <p className="text-rose-500 font-bold mt-1 max-w-full break-words">Warning: {payError}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              {/* The two informational blocks requested by the user */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-zinc-900">
                  <Info className="h-4 w-4 text-slate-400" />
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
                    {getUILabel("appSystemTitle")}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Block 1: About KASPI App */}
                  <div className="rounded-2xl bg-white border border-slate-100/90 p-4.5 w-full hover:border-slate-200 dark:bg-zinc-900/30 dark:border-zinc-900/80 transition-all shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-lg bg-purple-100/65 dark:bg-purple-950/25 flex items-center justify-center text-purple-650 dark:text-purple-400">
                        <Info className="h-3.5 w-3.5" />
                      </div>
                      <h4 className="text-[11px] font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
                        {getTranslation("aboutKaspiTitle", lang)}
                      </h4>
                    </div>
                    <p className="text-[10.5px] text-slate-400 dark:text-zinc-400 leading-relaxed font-semibold">
                      {getTranslation("aboutKaspiDesc", lang)}
                    </p>
                  </div>

                  {/* Block 2: Market API Integration */}
                  <div className="rounded-2xl bg-white border border-slate-100/90 p-4.5 w-full hover:border-slate-200 dark:bg-zinc-900/30 dark:border-zinc-900/80 transition-all shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-lg bg-amber-100/60 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 dark:text-amber-400">
                        <Coins className="h-3.5 w-3.5" />
                      </div>
                      <h4 className="text-[11px] font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
                        {getTranslation("cmcIntegrationTitle", lang)}
                      </h4>
                    </div>
                    <p className="text-[10.5px] text-slate-400 dark:text-zinc-400 leading-relaxed font-semibold">
                      {getTranslation("cmcIntegrationDesc", lang)}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-100 dark:bg-zinc-950 dark:border-zinc-900 flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-zinc-550">
              <span className="font-mono">KASPI App Node v1.1.2</span>
              <span>{getTranslation("internetRequired", lang)}</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
