import { motion } from "motion/react";
import { ArrowUpRight, ArrowDownRight, Coins, RefreshCw } from "lucide-react";
import { CoinPriceInfo, KaspiLang } from "../types";
import { getTranslation, getCategoryTranslation } from "../utils/translations";
import CoinIcon from "./CoinIcon";

interface CoinCardProps {
  coin: CoinPriceInfo;
  piPrice: number;
  isSelected: boolean;
  onClick: () => void;
  showInPi: boolean;
  lang: KaspiLang;
}

// Map styles for each coin to make them look incredibly distinct
const getCoinStyles = (symbol: string) => {
  switch (symbol) {
    case "PI":
      return {
        bgGlow: "rgba(147, 51, 234, 0.08)",
        borderActive: "border-purple-600 dark:border-purple-400",
        pillBg: "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300",
        iconColor: "text-purple-600 dark:text-purple-400",
        gradient: "from-purple-500/10 via-amber-500/5 to-transparent",
        accent: "purple"
      };
    case "BTC":
      return {
        bgGlow: "rgba(247, 147, 26, 0.08)",
        borderActive: "border-amber-500 dark:border-amber-400",
        pillBg: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
        iconColor: "text-amber-500 dark:text-amber-400",
        gradient: "from-amber-500/10 via-transparent to-transparent",
        accent: "amber"
      };
    case "ETH":
      return {
        bgGlow: "rgba(98, 126, 234, 0.08)",
        borderActive: "border-blue-500 dark:border-blue-400",
        pillBg: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
        iconColor: "text-blue-500 dark:text-blue-400",
        gradient: "from-blue-500/10 via-transparent to-transparent",
        accent: "blue"
      };
    case "XRP":
      return {
        bgGlow: "rgba(0, 96, 151, 0.08)",
        borderActive: "border-sky-500 dark:border-sky-400",
        pillBg: "bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
        iconColor: "text-sky-500 dark:text-sky-400",
        gradient: "from-sky-500/10 via-transparent to-transparent",
        accent: "sky"
      };
    case "HBAR":
      return {
        bgGlow: "rgba(63, 63, 70, 0.08)",
        borderActive: "border-zinc-500 dark:border-zinc-400",
        pillBg: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
        iconColor: "text-zinc-600 dark:text-zinc-400",
        gradient: "from-zinc-500/10 via-transparent to-transparent",
        accent: "zinc"
      };
    case "ZYPTO":
      return {
        bgGlow: "rgba(236, 72, 153, 0.08)",
        borderActive: "border-pink-500 dark:border-pink-400",
        pillBg: "bg-pink-100 text-pink-800 dark:bg-pink-950/40 dark:text-pink-300",
        iconColor: "text-pink-500 dark:text-pink-400",
        gradient: "from-pink-500/10 via-transparent to-transparent",
        accent: "pink"
      };
    case "XLM":
      return {
        bgGlow: "rgba(6, 182, 212, 0.08)",
        borderActive: "border-cyan-500 dark:border-cyan-400",
        pillBg: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300",
        iconColor: "text-cyan-500 dark:text-cyan-400",
        gradient: "from-cyan-500/10 via-transparent to-transparent",
        accent: "cyan"
      };
    case "BNB":
      return {
        bgGlow: "rgba(234, 179, 8, 0.08)",
        borderActive: "border-yellow-500 dark:border-yellow-400",
        pillBg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300",
        iconColor: "text-yellow-500 dark:text-yellow-400",
        gradient: "from-yellow-400/10 via-transparent to-transparent",
        accent: "yellow"
      };
    case "TON":
      return {
        bgGlow: "rgba(14, 165, 233, 0.08)",
        borderActive: "border-indigo-500 dark:border-indigo-400",
        pillBg: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300",
        iconColor: "text-blue-500 dark:text-indigo-400",
        gradient: "from-indigo-500/10 via-transparent to-transparent",
        accent: "indigo"
      };
    default:
      return {
        bgGlow: "rgba(99, 102, 241, 0.08)",
        borderActive: "border-violet-500 dark:border-violet-400",
        pillBg: "bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
        iconColor: "text-violet-500 dark:text-violet-400",
        gradient: "from-violet-500/10 via-transparent to-transparent",
        accent: "violet"
      };
  }
};

// Generates an elegant pseudo-deterministic seed path for micro trendline
const makeTrendlinePath = (change24h: number, symbol: string) => {
  const isUp = change24h >= 0;
  // Generate slightly wavy line with 6 points ending higher or lower based on 24hr change
  const pts = [
    { x: 0, y: 30 },
    { x: 20, y: isUp ? 28 : 34 },
    { x: 40, y: isUp ? 22 : 38 },
    { x: 60, y: isUp ? 32 : 28 },
    { x: 80, y: isUp ? 15 : 42 },
    { x: 100, y: isUp ? 8 : 46 }
  ];
  return `M ${pts.map(p => `${p.x} ${p.y}`).join(" L ")}`;
};

export default function CoinCard({ coin, piPrice, isSelected, onClick, showInPi, lang }: CoinCardProps) {
  const styles = getCoinStyles(coin.symbol);
  const isNegative = coin.change24h < 0;

  // Format currency with standard configurations
  const formatUSD = (val: number) => {
    if (val === 0) return "$0.00";
    if (val < 0.1) return `$${val.toFixed(4)}`;
    if (val < 2) return `$${val.toFixed(3)}`;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2
    }).format(val);
  };

  const getPriceInPi = () => {
    if (piPrice <= 0 || coin.symbol === "PI") return "-";
    const piEquivalent = coin.price / piPrice;
    if (piEquivalent < 0.0001) return piEquivalent.toFixed(6);
    if (piEquivalent < 1) return piEquivalent.toFixed(4);
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2
    }).format(piEquivalent);
  };

  const formatLargeNumber = (val: number) => {
    if (val === 0) return "-";
    if (val >= 1.0e12) return `$${(val / 1.0e12).toFixed(2)}T`;
    if (val >= 1.0e9) return `$${(val / 1.0e9).toFixed(2)}B`;
    if (val >= 1.0e6) return `$${(val / 1.0e6).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <motion.div
      id={`coin-card-${coin.symbol.toLowerCase()}`}
      onClick={onClick}
      whileHover={{ scale: 1.015, translateY: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative cursor-pointer overflow-hidden rounded-2xl border bg-white p-5 transition-all outline-none duration-300 select-none ${
        isSelected
          ? `${styles.borderActive} shadow-lg ring-1 ring-purple-500/20`
          : "border-slate-100 hover:border-slate-300 shadow-xs dark:border-zinc-800 dark:hover:border-zinc-700"
      } dark:bg-zinc-900/95`}
      style={{
        boxShadow: isSelected ? `0 10px 30px -10px ${styles.bgGlow}` : ""
      }}
    >
      {/* Dynamic Background subtle gradient */}
      <div className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl ${styles.gradient} rounded-full blur-2xl pointer-events-none`} />

      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 dark:bg-zinc-800 dark:border-zinc-700">
            <CoinIcon symbol={coin.symbol} size={24} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-sans font-semibold tracking-tight text-slate-800 dark:text-zinc-100 text-sm">
                {coin.name}
              </h3>
              {coin.rank && (
                <span className="text-[10px] font-mono font-bold py-0.5 px-1 bg-amber-50 dark:bg-amber-950/45 text-amber-600 dark:text-amber-400 rounded">
                  #{coin.rank}
                </span>
              )}
              <span className="text-[10px] font-mono font-medium py-0.5 px-1.5 text-slate-400 bg-slate-100 rounded dark:bg-zinc-800/80 dark:text-zinc-500">
                {coin.symbol}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-400 mt-0.5 font-medium">
              {getCategoryTranslation(coin.category, lang)}
            </p>
          </div>
        </div>

        {/* 24h Change badge */}
        <div
          className={`flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${
            isNegative
              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
          }`}
        >
          {isNegative ? (
            <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
          )}
          {Math.abs(coin.change24h).toFixed(2)}%
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <div>
          {/* Main Price Display */}
          <div className="text-xl font-bold font-sans tracking-tight text-slate-900 dark:text-white">
            {showInPi && coin.symbol !== "PI" ? (
              <span className="flex items-center gap-1 font-sans text-purple-600 dark:text-purple-400">
                <span className="font-bold text-amber-500 font-serif">π</span>
                {getPriceInPi()}
              </span>
            ) : (
              formatUSD(coin.price)
            )}
          </div>
          
          {/* Sub-price display if toggled */}
          {showInPi && coin.symbol !== "PI" ? (
            <p className="text-xs font-medium text-slate-400 dark:text-zinc-500 mt-1">
              {getTranslation("equivalentLabel", lang)}{formatUSD(coin.price)}
            </p>
          ) : coin.symbol !== "PI" && piPrice > 0 ? (
            <p className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 mt-1 flex items-center gap-0.5">
              <Coins className="h-3 w-3 text-amber-500" />
              {getPriceInPi()} <span className="font-serif text-amber-500 font-bold">π</span>
            </p>
          ) : (
            <p className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 mt-1">
              {getTranslation("basePiTokenName", lang)}
            </p>
          )}
        </div>

        {/* Micro-spark trend svg */}
        <div className="h-10 w-24 opacity-85 hover:opacity-100 transition-opacity">
          <svg className="h-full w-full overflow-visible" viewBox="0 0 100 50">
            <defs>
              <linearGradient id={`grad-${coin.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isNegative ? "#ef4444" : "#10b981"} stopOpacity="0.15" />
                <stop offset="100%" stopColor={isNegative ? "#ef4444" : "#10b981"} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={makeTrendlinePath(coin.change24h, coin.symbol)}
              fill="none"
              stroke={isNegative ? "rgba(244, 63, 94, 0.75)" : "rgba(16, 185, 129, 0.75)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Area fill */}
            <path
              d={`${makeTrendlinePath(coin.change24h, coin.symbol)} L 100 50 L 0 50 Z`}
              fill={`url(#grad-${coin.symbol})`}
            />
          </svg>
        </div>
      </div>

      {/* Vol / Market cap metadata grid */}
      <div className="mt-4 pt-3 border-t border-slate-50 dark:border-zinc-800/80 grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-400">
        <div>
          <span className="block text-[10px] uppercase text-slate-350 dark:text-zinc-600 tracking-wider">
            {getTranslation("metricCap", lang)}
          </span>
          <span className="font-mono text-slate-600 dark:text-zinc-300 font-semibold mt-0.5 block">
            {formatLargeNumber(coin.marketCap)}
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase text-slate-350 dark:text-zinc-600 tracking-wider">
            {getTranslation("metricVol24", lang)}
          </span>
          <span className="font-mono text-slate-600 dark:text-zinc-300 font-semibold mt-0.5 block">
            {formatLargeNumber(coin.volume24h)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
