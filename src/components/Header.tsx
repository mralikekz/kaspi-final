import React from "react";
import { Sun, Moon, Search, Sparkles, Coins, RefreshCw, Settings } from "lucide-react";
import { KaspiLang } from "../types";
import { getTranslation } from "../utils/translations";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  showInPi: boolean;
  setShowInPi: (val: boolean) => void;
  onRefresh: () => void;
  refreshing: boolean;
  lang: KaspiLang;
  setLang: (val: KaspiLang) => void;
  onHomeClick?: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  darkMode,
  toggleDarkMode,
  showInPi,
  setShowInPi,
  onRefresh,
  refreshing,
  lang,
  setLang,
  onHomeClick
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md dark:bg-zinc-950/95 dark:border-zinc-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand/Logo Section matching Pi Browser theme with premium black and white icon acting as a settings gateway */}
          <div 
            onClick={onHomeClick}
            className="flex items-center gap-2.5 cursor-pointer select-none active:scale-95 group rounded-2xl transition-all duration-200"
            title={lang === "RU" ? "Открыть настройки и информацию KASPI" : "Open KASPI settings & system details"}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black dark:bg-zinc-900 shadow-md transition-transform duration-300 group-hover:scale-105 relative group-active:scale-95">
              <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white relative">
                <span className="text-sm font-serif font-black text-black pb-0.5 leading-none select-none">π</span>
              </div>
              {/* Floating gear badge when hovered */}
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-lg bg-purple-600 border border-white dark:border-zinc-950 flex items-center justify-center text-white scale-0 group-hover:scale-110 duration-300 shadow-sm">
                <Settings className="h-2.5 w-2.5 animate-spin-slow text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h1 className="text-sm md:text-base font-black tracking-wider text-slate-900 dark:text-white leading-none group-hover:text-purple-650 dark:group-hover:text-purple-400 transition-colors">
                  KASPI
                </h1>
                <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse mt-0.5" title={getTranslation("networkActive", lang)} />
                {/* Tiny settings hint label */}
                <span className="text-[7.5px] font-bold uppercase tracking-wider text-purple-600/80 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-1 py-0.5 rounded ml-1 scale-0 group-hover:scale-100 transition-transform origin-left duration-250">
                  ⚙️ {lang === "RU" ? "КФГ" : "CFG"}
                </span>
              </div>
              <p className="text-[9px] font-bold text-slate-450 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                {getTranslation("infoPortal", lang)}
              </p>
            </div>
          </div>

          {/* Search bar inside header for a desktop dashboard vibe */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              id="header-search-desktop"
              placeholder={getTranslation("searchPlaceholderDetailed", lang)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-150 py-1.5 pl-10 pr-4 text-xs font-semibold focus:border-purple-500 focus:outline-hidden dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-purple-400 transition-all font-sans"
            />
          </div>

          {/* Dynamic Configuration Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language switcher select */}
            <div className="relative">
              <select
                id="language-selector-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as KaspiLang)}
                className="appearance-none flex items-center justify-center pl-2 target-select pr-5 h-9 rounded-xl bg-slate-50 border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-slate-800 dark:hover:text-white cursor-pointer text-[10px] font-extrabold transition-colors font-mono focus:outline-hidden pr-6"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>")`,
                  backgroundPosition: "right 6px center",
                  backgroundSize: "9px",
                  backgroundRepeat: "no-repeat"
                }}
                title={getTranslation("switchLanguage", lang)}
              >
                <option value="RU" className="bg-white text-slate-800 dark:bg-zinc-900 dark:text-white">RU</option>
                <option value="EN" className="bg-white text-slate-800 dark:bg-zinc-900 dark:text-white">EN</option>
                <option value="ZH" className="bg-white text-slate-800 dark:bg-zinc-900 dark:text-white">ZH</option>
                <option value="FR" className="bg-white text-slate-800 dark:bg-zinc-900 dark:text-white">FR</option>
                <option value="AR" className="bg-white text-slate-800 dark:bg-zinc-900 dark:text-white">AR</option>
                <option value="HI" className="bg-white text-slate-800 dark:bg-zinc-900 dark:text-white">HI</option>
                <option value="ES" className="bg-white text-slate-800 dark:bg-zinc-900 dark:text-white">ES</option>
              </select>
            </div>

            {/* Global Refresh rate */}
            <button
              id="refresh-prices-btn"
              onClick={onRefresh}
              disabled={refreshing}
              className={`flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800 text-slate-500 dark:text-zinc-405 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-transform ${
                refreshing ? "rotate-180 duration-500" : ""
              }`}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            {/* Currency toggle switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-150 dark:bg-zinc-900 dark:border-zinc-800">
              <button
                id="toggle-currency-usd"
                onClick={() => setShowInPi(false)}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  !showInPi
                    ? "bg-white text-slate-800 shadow-xs dark:bg-zinc-800 dark:text-white"
                    : "text-slate-450 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300"
                }`}
              >
                USD
              </button>
              <button
                id="toggle-currency-pi"
                onClick={() => setShowInPi(true)}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg flex items-center gap-0.5 transition-all cursor-pointer ${
                  showInPi
                    ? "bg-white text-purple-750 shadow-xs dark:bg-zinc-800 dark:text-purple-400"
                    : "text-slate-450 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300"
                }`}
              >
                <span className="font-serif">π</span> PI
              </button>
            </div>

            {/* Dark & Light view switcher */}
            <button
              id="theme-toggle-btn"
              onClick={toggleDarkMode}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800 text-slate-500 dark:text-zinc-405 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors"
              title={darkMode ? getTranslation("lightTheme", lang) : getTranslation("darkTheme", lang)}
            >
              {darkMode ? (
                <Sun className="h-4.5 w-4.5 text-amber-500 hover:scale-110 duration-200" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-purple-650 hover:scale-110 duration-200" />
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

