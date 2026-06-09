import React, { useEffect, useState } from "react";
import { 
  Coins, 
  Search, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  HelpCircle, 
  AlertCircle, 
  Info, 
  ArrowUpRight, 
  Layers, 
  Activity, 
  Calculator, 
  Moon, 
  Sun,
  Github
} from "lucide-react";
import { CoinPriceInfo, KaspiLang } from "./types";
import { getTranslation } from "./utils/translations";
import Header from "./components/Header";
import CoinCard from "./components/CoinCard";
import CoinDetailModal from "./components/CoinDetailModal";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import SettingsModal from "./components/SettingsModal";
import PiDeveloperSandbox from "./components/PiDeveloperSandbox";

const STATIC_COINS: CoinPriceInfo[] = [
  { symbol: "PI", name: "Pi Network", category: "Utility / Network Coin", price: 41.25, change24h: 1.45, marketCap: 0, volume24h: 3521040, lastUpdated: new Date().toISOString() },
  { symbol: "BTC", name: "Bitcoin", category: "Store of Value", price: 89450.00, change24h: -1.12, marketCap: 1750400120100, volume24h: 28100500120, lastUpdated: new Date().toISOString() },
  { symbol: "ETH", name: "Ethereum", category: "Smart Contracts", price: 2740.15, change24h: 0.85, marketCap: 329100500600, volume24h: 14500100200, lastUpdated: new Date().toISOString() },
  { symbol: "XRP", name: "XRP", category: "Cross-border Payments", price: 1.15, change24h: -2.41, marketCap: 65000210340, volume24h: 1200150200, lastUpdated: new Date().toISOString() },
  { symbol: "HBAR", name: "Hedera", category: "Enterprise Ledger", price: 0.125, change24h: 4.21, marketCap: 4250100200, volume24h: 152010400, lastUpdated: new Date().toISOString() },
  { symbol: "ZYPTO", name: "Zypto", category: "Crypto Payments Ecosystem", price: 0.0185, change24h: -3.15, marketCap: 18500120, volume24h: 345100, lastUpdated: new Date().toISOString() },
  { symbol: "XLM", name: "Stellar", category: "DeFi / Payments", price: 0.222, change24h: 0.52, marketCap: 6450120300, volume24h: 230100500, lastUpdated: new Date().toISOString() },
  { symbol: "BNB", name: "BNB", category: "Exchange Token / L1", price: 582.40, change24h: -0.45, marketCap: 85210040500, volume24h: 980120300, lastUpdated: new Date().toISOString() },
  { symbol: "TON", name: "TON", category: "Telegram Ecosystem", price: 5.12, change24h: 2.18, marketCap: 12900410200, volume24h: 185040300, lastUpdated: new Date().toISOString() },
  { symbol: "TWT", name: "TWT", category: "Wallet Utility", price: 1.05, change24h: -1.88, marketCap: 430150200, volume24h: 12040100, lastUpdated: new Date().toISOString() },
  { symbol: "ONDO", name: "Ondo Finance", category: "Real World Assets (RWA)", price: 1.15, change24h: 3.54, marketCap: 1650000000, volume24h: 185000000, lastUpdated: new Date().toISOString() }
];

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [coins, setCoins] = useState<CoinPriceInfo[]>(STATIC_COINS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInPi, setShowInPi] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinPriceInfo | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [source, setSource] = useState("local_cache_simulation");
  const [error, setError] = useState<string | null>(null);

  // Pi Auth states
  const [piUser, setPiUser] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem("pi_user");
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handlePiSignIn = async () => {
    if (authLoading) return;
    setAuthLoading(true);
    setAuthError(null);
    try {
      const piSdk = (window as any).Pi;
      if (!piSdk) {
        throw new Error("Pi SDK is not loaded. Please access this app within the Pi Browser.");
      }

      console.log("[Pi Auth] Initializing Pi SDK...");
      const isSandboxMode = window.location.search.includes("sandbox=true") || 
                             window.location.search.includes("sandbox=1") || 
                             window.location.hostname.includes("sandbox") ||
                             !!(document.referrer && document.referrer.includes("sandbox")) ||
                             true;
      
      // Treat Pi.init(...) as a Promise; await it fully before calling Pi.authenticate(...)
      await piSdk.init({ version: "2.0", sandbox: isSandboxMode });

      const scopes = ["username", "payments"];
      const onIncompletePaymentFound = async (payment: any) => {
        console.log("[Pi Auth] Incomplete payment discovered on load:", payment);
        try {
          const res = await fetch("/api/pi/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: payment.identifier,
              txid: payment.transaction.txid,
              isSandboxSimulation: isSandboxMode
            })
          });
          const completedData = await res.json();
          console.log("[Pi Auth] Incomplete payment auto-completed successfully:", completedData);
        } catch (e) {
          console.error("[Pi Auth] Incomplete payment auto-completion failure:", e);
        }
      };

      console.log("[Pi Auth] Authenticating with extended scopes:", scopes);
      const auth = await piSdk.authenticate(scopes, onIncompletePaymentFound);
      console.log("[Pi Auth] Access token received successfully.");

      // Verify the returned token with the backend
      const verifyRes = await fetch("/api/pi/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: auth.accessToken })
      });

      if (!verifyRes.ok) {
        throw new Error(`Auth verification failed. Server responded with status ${verifyRes.status}`);
      }

      const valData = await verifyRes.json();
      if (valData.success && valData.user) {
        setPiUser(valData.user);
        localStorage.setItem("pi_user", JSON.stringify(valData.user));
        console.log("[Pi Auth] Session successfully established for @", valData.user.username);
      } else {
        throw new Error(valData.error || "Token verification returned empty result");
      }
    } catch (err: any) {
      console.error("[Pi Auth] Error during login:", err);
      setAuthError(err.message || String(err));
    } finally {
      setAuthLoading(false);
    }
  };

  // Automatically trigger Pi authentication when the app loads
  useEffect(() => {
    handlePiSignIn();
  }, []);

  // Router listener to capture back/forward navigation in Pi Browser / sandbox
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleNavigate = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Language representation state
  const [lang, setLang] = useState<KaspiLang>(() => {
    const saved = localStorage.getItem("lang_kaspi") as KaspiLang | null;
    const validLangs: KaspiLang[] = ["RU", "EN", "ZH", "FR", "AR", "HI", "ES"];
    return (saved && validLangs.includes(saved)) ? saved : "RU";
  });

  // Dark mode (boolean state) initialized from localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("darkMode_kaspi");
    return saved === "true" ? true : false;
  });

  // User-adjustable Pi Token price (in USD). Default is ~$41.25
  const [piPrice, setPiPrice] = useState<number>(41.25);

  // Apply dark mode theme class to documentElement on change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode_kaspi", String(darkMode));
  }, [darkMode]);

  // Save selected language state
  useEffect(() => {
    localStorage.setItem("lang_kaspi", lang);
  }, [lang]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Silent retry helper for client-side API requests
  const fetchWithRetry = async (url: string, options?: RequestInit, maxRetries = 3, delayMs = 1200): Promise<Response> => {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const res = await fetch(url, options);
        if (res.ok) {
          return res;
        }
        throw new Error(`Server responded with status: ${res.status}`);
      } catch (err) {
        lastError = err;
        console.warn(`Fetch attempt ${i + 1} failed. Retrying in ${delayMs}ms...`, err);
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    throw lastError || new Error("Failed after all retries");
  };

  // Price polling method with retry logic to suppress transient connection errors
  const fetchPrices = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    setError(null);

    try {
      // Use 3 retries for automatic updates, 2 retries for manual refresh to maintain high responsiveness
      const res = await fetchWithRetry("/api/crypto", {}, isManual ? 2 : 3, 1200);
      const payload = await res.json();
      if (payload.success) {
        setCoins(payload.data);
        setSource(payload.source);
        
        // Dynamically find and pin the Pi price from live database
        const foundPi = payload.data.find((c: CoinPriceInfo) => c.symbol === "PI");
        if (foundPi && foundPi.price > 0) {
          setPiPrice(foundPi.price);
        }
      } else {
        throw new Error("Payload did not return successful metrics");
      }
    } catch (err: any) {
      console.error("Failed to load prices:", err);
      setSource("local_offline_mode");
      const offlineMsg: Record<KaspiLang, string> = {
        RU: "Данные временно загружены из локальной автономной базы KASPI. Прогресс пересчета цен Pi Network сохранен.",
        EN: "Metrics temporarily loaded from localized KASPI offline cache. Pi pricing matrix preserved.",
        ZH: "数据已自本地内嵌缓存载入。Pi Network 的定价参数已妥善保留。",
        FR: "Données temporairement chargées du cache hors ligne KASPI. Les taux de Pi Network sont conservés.",
        AR: "تم تحميل البيانات مؤقتًا من ذاكرة التخزين المؤقت المحلية لـ KASPI. تم الحفاظ على معايير تسعير Pi Network.",
        HI: "डेटा अस्थायी रूप से स्थानीय ऑफ़लाइन कैश से लोड किया गया है। Pi Network मूल्य निर्धारण मैट्रिक्स संरक्षित है।",
        ES: "Métricas cargadas temporalmente de la caché local fuera de línea de KASPI. La matriz de precios de Pi se ha preservado."
      };
      setError(offlineMsg[lang] || offlineMsg.EN);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Run initial fetch and set interval loop
  useEffect(() => {
    fetchPrices();
    const interval = setInterval(() => {
      fetchPrices();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [lang]); // Fetch again on lang tweak to ensure proper error translation if needed

  const handleRefresh = () => {
    fetchPrices(true);
  };

  // Filter coins
  const filteredCoins = coins.filter(coin => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return coin.name.toLowerCase().includes(query) || 
           coin.symbol.toLowerCase().includes(query) ||
           coin.category.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300 flex flex-col font-sans">
      
      {/* Top Header Navigation */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        showInPi={showInPi}
        setShowInPi={setShowInPi}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        lang={lang}
        setLang={setLang}
        onHomeClick={() => setIsSettingsOpen(true)}
        piUser={piUser}
        onSignIn={handlePiSignIn}
        authLoading={authLoading}
      />

      {currentPath === "/privacy" ? (
        <PrivacyPolicy lang={lang} onBack={() => handleNavigate("/")} />
      ) : currentPath === "/terms" ? (
        <TermsOfService lang={lang} onBack={() => handleNavigate("/")} />
      ) : (
        /* Main Content Dashboard Container */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
          
          {/* Welcome Banner - Optimized & Smaller layout */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 p-3.5 md:p-4.5 text-white relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 h-32 w-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative">
              {/* Shrunk and lighter alert badge */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-400 text-purple-950 uppercase tracking-wide shadow-xs">
                  <Sparkles className="h-2.5 w-2.5" /> 
                  {getTranslation("kaspiActive", lang)}
                </span>
              </div>

              <p className="text-xs text-purple-100 max-w-2xl leading-relaxed">
                {getTranslation("welcomeText", lang)}
              </p>

              <div className="mt-3.5 flex flex-wrap gap-2.5 items-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/5 rounded-xl px-2.5 py-1.5 flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-lg bg-amber-400/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-amber-300 font-serif">π</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase text-purple-200 tracking-wider font-sans">
                      {getTranslation("basePiRate", lang)}
                    </span>
                    <span className="text-xs font-bold font-mono text-amber-300">
                      ${piPrice.toFixed(2)} USD
                    </span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/5 rounded-xl px-2.5 py-1.5 flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <Activity className="h-3 w-3 text-indigo-300" />
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase text-purple-200 tracking-wider font-sans font-semibold">
                      {getTranslation("dataStatus", lang)}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-100 flex items-center gap-1 font-sans">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      API {source === "coinmarketcap" ? "(Live)" : "(Fallback / Cache)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="relative md:hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              id="mobile-search-input"
              placeholder={getTranslation("searchPlaceholder", lang)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 px-10 text-xs font-semibold focus:border-purple-500 focus:outline-hidden dark:bg-zinc-900 dark:border-zinc-800 dark:text-white transition-all shadow-xs"
            />
          </div>

          {/* Dynamic warning bar */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{getTranslation("syncIssueText", lang)}</p>
                <p className="mt-1 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Main Grid: List of 10 crypto coins */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800/80 pb-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <div className="flex items-center gap-2">
                  <Coins className="h-4.5 w-4.5 text-purple-650 dark:text-purple-400" />
                  <h3 className="font-sans font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider whitespace-nowrap">
                    {getTranslation("coinMarket", lang)}
                  </h3>
                </div>
                <span className="text-[10px] md:text-xs text-slate-500 dark:text-zinc-400 font-medium italic">
                  {getTranslation("kaspiQuote", lang)}
                </span>
              </div>
              
              <span className="self-start md:self-auto text-[9px] font-mono font-bold uppercase bg-slate-100 text-slate-500 py-1 px-2 rounded-full dark:bg-zinc-800 dark:text-zinc-400">
                {getTranslation("showingCoinsCount", lang, String(filteredCoins.length))}
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-450">
                <span className="h-7 w-7 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <p className="mt-4 text-xs font-medium dark:text-zinc-400">
                  {getTranslation("resolvingRates", lang)}
                </p>
              </div>
            ) : filteredCoins.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCoins.map((coin) => (
                  <CoinCard
                    key={coin.symbol}
                    coin={coin}
                    piPrice={piPrice}
                    isSelected={selectedCoin?.symbol === coin.symbol}
                    onClick={() => setSelectedCoin(coin)}
                    showInPi={showInPi}
                    lang={lang}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 rounded-2xl bg-white border border-slate-150 dark:bg-zinc-900 dark:border-zinc-800 p-6">
                <p className="text-slate-400 text-xs text-center font-medium">
                  {getTranslation("noCoinsFound", lang)}
                </p>
                <button
                  id="reset-search-btn"
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-xs text-purple-650 font-bold hover:underline cursor-pointer font-sans"
                >
                  {getTranslation("clearFilter", lang)}
                </button>
              </div>
            )}
          </div>

          {/* Interactive Pi Network Sandbox Store and Payment Console */}
          <PiDeveloperSandbox 
            lang={lang}
            piUser={piUser}
            piPrice={piPrice}
            onRefreshSession={handlePiSignIn}
          />

        </main>
      )}

      {/* Footer Banner */}
      <footer className="w-full border-t border-slate-150 py-8 text-center text-xs text-slate-400 dark:border-zinc-900 dark:text-zinc-500 bg-white dark:bg-zinc-950 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Compliant documents links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-bold text-purple-650 dark:text-purple-400">
            <button 
              onClick={() => handleNavigate("/privacy")} 
              className="hover:text-purple-800 dark:hover:text-purple-300 transition-colors cursor-pointer select-none active:scale-95"
            >
              {lang === "RU" ? "Политика Конфиденциальности" : "Privacy Policy"}
            </button>
            <span className="text-slate-300 dark:text-zinc-800">|</span>
            <button 
              onClick={() => handleNavigate("/terms")} 
              className="hover:text-purple-800 dark:hover:text-purple-300 transition-colors cursor-pointer select-none active:scale-95"
            >
              {lang === "RU" ? "Пользовательское Соглашение" : "Terms of Service"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-sans pt-2 border-t border-slate-100 dark:border-zinc-900/60">
            <p className="text-[11px] text-slate-400 dark:text-zinc-500">
              {getTranslation("copyrightText", lang)}
            </p>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span>Powered by</span>
              <span className="font-bold text-slate-600 dark:text-zinc-300 font-sans">KASPI Proxy</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Detail overlay modal when card clicked */}
      {selectedCoin && (
        <CoinDetailModal
          coin={selectedCoin}
          piPrice={piPrice}
          onClose={() => setSelectedCoin(null)}
          lang={lang}
        />
      )}

      {/* Settings & Info overlay modal triggered by clicking KASPI brand logo */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lang={lang}
        setLang={setLang}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        showInPi={showInPi}
        setShowInPi={setShowInPi}
      />

    </div>
  );
}
