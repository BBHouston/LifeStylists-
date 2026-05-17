// Core data shapes for the $LIFE dashboard

export interface PumpData {
  mintAddress: string;
  name: string;
  symbol: string;
  priceUsd: number;
  priceSol: number;
  marketCapUsd: number;
  marketCapSol: number;
  volumeUsd24h: number;
  bondingCurvePct: number;      // 0-100, graduation at 100
  bondingCurveSol: number;      // SOL currently in bonding curve
  graduationThresholdSol: number; // Default 69 SOL on Pump.fun
  txCount24h: number;
  holderCount: number;
  createdAt: string;
  priceHistory: PricePoint[];
  volumeHistory: VolumePoint[];
}

export interface PricePoint {
  ts: number;       // unix ms
  price: number;    // USD
  sol: number;
}

export interface VolumePoint {
  ts: number;
  buyVol: number;  // USD
  sellVol: number; // USD
}

export interface SentimentData {
  overall: "bullish" | "bearish" | "neutral";
  score: number;        // -100 to +100
  positivePct: number;
  negativePct: number;
  neutralPct: number;
  mentionsX: number;    // last 1h
  mentionsTg: number;   // last 1h
  topKeywords: string[];
  history: SentimentPoint[];
  recentPosts: SocialPost[];
}

export interface SentimentPoint {
  ts: number;
  score: number;
}

export interface SocialPost {
  platform: "x" | "telegram";
  author: string;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  ts: number;
  likes?: number;
  retweets?: number;
}

export interface HolderData {
  totalHolders: number;
  top10Pct: number;      // % held by top 10
  devWalletPct: number;
  communityPct: number;
  distribution: HolderBucket[];
  topHolders: TopHolder[];
  giniCoefficient: number; // 0=perfect equality, 1=max concentration
}

export interface HolderBucket {
  label: string;
  pct: number;
  color: string;
}

export interface TopHolder {
  rank: number;
  address: string;
  pct: number;
  amountTokens: number;
  label?: string; // "Dev Wallet", "Whale", "CEX" etc
  isKnown: boolean;
}

export interface EngagementMetrics {
  uniqueBuyers1h: number;
  uniqueSellers1h: number;
  buyPressure: number;    // 0-100
  newHolders1h: number;
  avgHoldTime: number;    // minutes
  aiAgentTxPct: number;   // estimated % of txs from bots/AI
  communityScore: number; // composite 0-100
  tgMemberCount: number;
  xFollowerCount: number;
  activityHistory: ActivityPoint[];
}

export interface ActivityPoint {
  ts: number;
  buyers: number;
  sellers: number;
  newHolders: number;
}

export interface AlertConfig {
  id: string;
  type: AlertType;
  threshold: number;
  webhookUrl: string;
  platform: "slack" | "discord";
  enabled: boolean;
  lastTriggered?: number;
}

export type AlertType =
  | "volume_milestone"
  | "sentiment_shift"
  | "holder_whale"
  | "bonding_curve_pct"
  | "price_change";

export interface AlertEvent {
  id: string;
  type: AlertType;
  message: string;
  ts: number;
  severity: "info" | "warning" | "critical";
}

export interface LiquiditySimParams {
  currentMarketCapSol: number;
  devAllocationPct: number;
  communityPct: number;
  targetSlippagePct: number;  // desired slippage tolerance
  targetLiquidityDepthUsd: number;
}

export interface LiquiditySimResult {
  recommendedLiqSol: number;
  recommendedLiqUsd: number;
  initialPricePerToken: number;
  priceImpact1kUsd: number;
  priceImpact10kUsd: number;
  raydiumFeeApy: number;
  migrationReadiness: "not_ready" | "borderline" | "ready" | "overdue";
  notes: string[];
}
