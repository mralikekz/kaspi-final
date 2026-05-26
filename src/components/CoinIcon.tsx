import React, { useState, useEffect } from "react";

interface CoinIconProps {
  symbol: string;
  className?: string;
  size?: number;
}

// Chain of dynamic fallbacks to ensure the original, authentic logos always render successfully:
// 1. Official CoinGecko or high-res CoinMarketCap direct logo asset (bypassing hotlinking constraints with referrerPolicy="no-referrer")
// 2. High-res CDN backup paths
const ICON_FALLBACKS: Record<string, string[]> = {
  PI: [
    "https://s3.coinmarketcap.com/static-gravity/image/09bec179568b4c189d2ce1ef5bc56ba4.png",
    "https://images.weserv.nl/?url=s3.coinmarketcap.com/static-gravity/image/09bec179568b4c189d2ce1ef5bc56ba4.png",
    "https://assets.coingecko.com/coins/images/28581/large/pi_logo.png"
  ],
  BTC: [
    "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    "https://images.weserv.nl/?url=s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
  ],
  ETH: [
    "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    "https://images.weserv.nl/?url=s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
  ],
  XRP: [
    "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
    "https://images.weserv.nl/?url=s2.coinmarketcap.com/static/img/coins/64x64/52.png",
    "https://assets.coingecko.com/coins/images/44/large/xrp.png"
  ],
  HBAR: [
    "https://s2.coinmarketcap.com/static/img/coins/64x64/4642.png",
    "https://images.weserv.nl/?url=s2.coinmarketcap.com/static/img/coins/64x64/4642.png",
    "https://assets.coingecko.com/coins/images/3688/large/hedera-hashgraph.png"
  ],
  ZYPTO: [
    "https://s2.coinmarketcap.com/static/img/coins/64x64/29812.png",
    "https://images.weserv.nl/?url=s2.coinmarketcap.com/static/img/coins/64x64/29812.png",
    "https://assets.coingecko.com/coins/images/35882/large/zypto.png"
  ],
  XLM: [
    "https://s2.coinmarketcap.com/static/img/coins/64x64/512.png",
    "https://images.weserv.nl/?url=s2.coinmarketcap.com/static/img/coins/64x64/512.png",
    "https://assets.coingecko.com/coins/images/100/large/stellar.png"
  ],
  BNB: [
    "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    "https://images.weserv.nl/?url=s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png"
  ],
  TON: [
    "https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png",
    "https://images.weserv.nl/?url=s2.coinmarketcap.com/static/img/coins/64x64/11419.png",
    "https://assets.coingecko.com/coins/images/17980/large/ton_token.png"
  ],
  TWT: [
    "https://share.google/nc5KQVdTO5yymhH3j",
    "https://s2.coinmarketcap.com/static/img/coins/64x64/5928.png",
    "https://images.weserv.nl/?url=s2.coinmarketcap.com/static/img/coins/64x64/5928.png",
    "https://assets.coingecko.com/coins/images/11085/large/Trust.png"
  ],
  ONDO: [
    "https://s2.coinmarketcap.com/static/img/coins/64x64/21159.png",
    "https://images.weserv.nl/?url=s2.coinmarketcap.com/static/img/coins/64x64/21159.png",
    "https://s2.coinmarketcap.com/static/img/coins/200x200/21159.png",
    "https://images.weserv.nl/?url=s2.coinmarketcap.com/static/img/coins/200x200/21159.png",
    "https://assets.coingecko.com/coins/images/34685/large/ondo-finance.png"
  ]
};

export default function CoinIcon({ symbol, className = "h-6 w-6", size = 24 }: CoinIconProps) {
  const sym = symbol.toUpperCase();
  const [urlIndex, setUrlIndex] = useState(0);

  // Reset fallback logic when token symbol changes
  useEffect(() => {
    setUrlIndex(0);
  }, [sym]);

  const fallbackUrls = ICON_FALLBACKS[sym] || [];

  // If there are unattempted high-res public image options, load them
  if (urlIndex < fallbackUrls.length) {
    return (
      <img
        src={fallbackUrls[urlIndex]}
        alt={`${symbol} original logo`}
        className={`${className} object-contain rounded-full shadow-xs bg-white dark:bg-zinc-800`}
        style={{ width: size, height: size }}
        onError={() => {
          setUrlIndex((prev) => prev + 1);
        }}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Ultimate fallback to custom interactive raw SVGs if all hotlinking attempts fail:
  switch (sym) {
    case "PI":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} text-amber-500`}
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
          <path
            d="M8 8H16M10 8V16C10 17 9 17 8 17M14 8V16C14 17.5 15 17.5 16 17"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "BTC":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} text-amber-600 dark:text-amber-400`}
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
          <path
            d="M9 7V17M12 7V17M9 7H13.5C14.88 7 16 8.12 16 9.5C16 10.88 14.88 12 13.5 12H9M9 12H14.5C15.88 12 17 13.12 17 14.5C17 15.88 15.88 17 14.5 17H9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "ETH":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} text-blue-600 dark:text-blue-400`}
        >
          <path
            d="M12 2L5 12L12 16.5L19 12L12 2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.08"
          />
          <path
            d="M5 13.5L12 22L19 13.5L12 16.5L5 13.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M12 2V16.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="1 1"
          />
        </svg>
      );

    case "XRP":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} text-sky-600 dark:text-sky-400`}
        >
          <path
            d="M5 19L19 5M19 19L5 5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="5" cy="19" r="2.5" fill="currentColor" />
          <circle cx="19" cy="5" r="2.5" fill="currentColor" />
          <circle cx="5" cy="5" r="2.5" fill="currentColor" />
          <circle cx="19" cy="19" r="2.5" fill="currentColor" />
          <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );

    case "HBAR":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} text-zinc-650 dark:text-zinc-400`}
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            d="M8.5 8.5V15.5M15.5 8.5V15.5M8.5 11.5H15.5M8.5 13.5H15.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "ZYPTO":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} text-pink-500`}
        >
          <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
          <path
            d="M8 8H16L8 16H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "XLM":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} text-cyan-500`}
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
          <path
            d="M17 7L11 13M17 7H13M17 7V11M7 17L10 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "BNB":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} text-yellow-500`}
        >
          <path
            d="M12 2L17.5 7.5L12 13L6.5 7.5L12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <path
            d="M12 11L17.5 16.5L12 22L6.5 16.5L12 11Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <path
            d="M17.5 7.5L22 12L17.5 16.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 7.5L2 12L6.5 16.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "TON":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} text-blue-500 dark:text-cyan-400`}
        >
          <path
            d="M21 3L3 10.5L9.5 14L13.5 18L15 21.5L21 3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.08"
          />
          <path
            d="M9.5 14L21 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "TWT":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} text-indigo-500 dark:text-indigo-400`}
        >
          <path
            d="M12 22C12 22 20 18 20 11V5L12 2L4 5V11C4 18 12 22 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.08"
          />
          <path
            d="M9 11L11 13L15 9"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "ONDO":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} text-cyan-500 dark:text-cyan-400`}
        >
          <circle 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="1.8" 
            fill="currentColor" 
            fillOpacity="0.05" 
          />
          <path 
            d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16" 
            stroke="currentColor" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
          />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      );

    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} text-slate-500`}
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
