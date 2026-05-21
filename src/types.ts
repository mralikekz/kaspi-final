export type KaspiLang = "RU" | "EN" | "ZH" | "FR" | "AR" | "HI" | "ES";

export interface CoinPriceInfo {
  symbol: string;
  name: string;
  category: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: string;
  rank?: number;
  circulatingSupply?: number;
  maxSupply?: number;
}

export interface CoinMetadata {
  symbol: string;
  name: string;
  geckoId: string;
  category: string;
  ruDescription: string;
  explorerUrl: string;
}

export interface CryptoExplainResponse {
  success: boolean;
  source: string;
  analysis: string;
}
