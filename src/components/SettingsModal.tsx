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
  Sliders
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
  setShowInPi
}: SettingsModalProps) {

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
