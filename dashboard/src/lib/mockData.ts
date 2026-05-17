// Realistic simulated data for the $LIFE dashboard.
// Replace these generators with real API calls to:
//   - Pump.fun API / DexScreener API (price + bonding curve)
//   - Helius / Solana RPC (holder distribution)
//   - Twitter API v2 (X sentiment)
//   - Telegram Bot API (Telegram sentiment)
//   - Nansen / Birdeye (on-chain analytics)

import type {
  PumpData, SentimentData, HolderData,
  EngagementMetrics, PricePoint, VolumePoint,
  SentimentPoint, ActivityPoint,
} from "./types";

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function randInt(min: number, max: number) {
  return Math.floor(rand(min, max));
}

function genPriceHistory(basePrice: number, points = 48): PricePoint[] {
  const now = Date.now();
  let price = basePrice * 0.3;
  return Array.from({ length: points }, (_, i) => {
    price = Math.max(0.0000001, price + price * rand(-0.08, 0.12));
    return {
      ts: now - (points - i) * 30 * 60 * 1000,
      price: +price.toFixed(8),
      sol: +(price / 185).toFixed(8),
    };
  });
}

function genVolumeHistory(points = 24): VolumePoint[] {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    ts: now - (points - i) * 60 * 60 * 1000,
    buyVol:  +rand(800, 12000).toFixed(0),
    sellVol: +rand(400, 8000).toFixed(0),
  }));
}

function genSentimentHistory(points = 24): SentimentPoint[] {
  const now = Date.now();
  let score = rand(20, 45);
  return Array.from({ length: points }, (_, i) => {
    score = Math.max(-100, Math.min(100, score + rand(-8, 10)));
    return { ts: now - (points - i) * 60 * 60 * 1000, score: +score.toFixed(1) };
  });
}

function genActivityHistory(points = 24): ActivityPoint[] {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    ts: now - (points - i) * 60 * 60 * 1000,
    buyers:     randInt(12, 180),
    sellers:    randInt(5, 90),
    newHolders: randInt(2, 35),
  }));
}

export function getMockPumpData(): PumpData {
  const bondingCurveSol = +rand(12, 58).toFixed(2);
  const graduationThresholdSol = 69;
  const bondingCurvePct = Math.min(100, (bondingCurveSol / graduationThresholdSol) * 100);
  const priceSol = bondingCurveSol / 1_000_000_000 * rand(0.8, 1.2);
  const priceUsd = priceSol * 185;

  return {
    mintAddress: "LIFExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1111",
    name: "LIFESTYLIST Coin",
    symbol: "LIFE",
    priceUsd: +priceUsd.toFixed(8),
    priceSol: +priceSol.toFixed(10),
    marketCapUsd: +(bondingCurveSol * 185 * rand(4, 8)).toFixed(0),
    marketCapSol: +(bondingCurveSol * rand(4, 8)).toFixed(2),
    volumeUsd24h: +rand(8000, 95000).toFixed(0),
    bondingCurvePct: +bondingCurvePct.toFixed(2),
    bondingCurveSol,
    graduationThresholdSol,
    txCount24h: randInt(180, 2400),
    holderCount: randInt(140, 1800),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    priceHistory: genPriceHistory(priceUsd),
    volumeHistory: genVolumeHistory(),
  };
}

export function getMockSentimentData(): SentimentData {
  const score = +rand(15, 72).toFixed(1);
  const positivePct = +rand(40, 75).toFixed(1);
  const negativePct = +rand(8, 25).toFixed(1);
  const neutralPct = +(100 - positivePct - negativePct).toFixed(1);

  return {
    overall: score > 30 ? "bullish" : score < -20 ? "bearish" : "neutral",
    score,
    positivePct,
    negativePct,
    neutralPct,
    mentionsX: randInt(40, 450),
    mentionsTg: randInt(60, 600),
    topKeywords: ["$LIFE", "LIFESTYLIST", "builders", "pump", "moon", "community", "systems", "operator"],
    history: genSentimentHistory(),
    recentPosts: [
      { platform: "x", author: "@web3_operator", text: "$LIFE is the meme coin for people actually building something. Love the narrative.", sentiment: "positive", ts: Date.now() - 4 * 60000, likes: 47, retweets: 12 },
      { platform: "telegram", author: "CryptoBuilder", text: "Just aped into $LIFE. The branding is fire 🔥", sentiment: "positive", ts: Date.now() - 7 * 60000 },
      { platform: "x", author: "@defi_degen99", text: "New wallet, same story. Watching $LIFE closely.", sentiment: "neutral", ts: Date.now() - 12 * 60000, likes: 8, retweets: 2 },
      { platform: "telegram", author: "LifestyleBuilder", text: "Dev said utility roadmap is coming. Need more details before buying more.", sentiment: "neutral", ts: Date.now() - 18 * 60000 },
      { platform: "x", author: "@solana_alpha", text: "Bonding curve 78% full on $LIFE — graduation incoming?", sentiment: "positive", ts: Date.now() - 25 * 60000, likes: 134, retweets: 41 },
      { platform: "telegram", author: "SolDegen42", text: "Chart looks weak, might take profits soon.", sentiment: "negative", ts: Date.now() - 32 * 60000 },
    ],
  };
}

export function getMockHolderData(): HolderData {
  return {
    totalHolders: randInt(180, 1600),
    top10Pct: +rand(28, 55).toFixed(1),
    devWalletPct: +rand(3, 8).toFixed(1),
    communityPct: +rand(55, 72).toFixed(1),
    giniCoefficient: +rand(0.55, 0.78).toFixed(2),
    distribution: [
      { label: "Dev Wallet",      pct: 5.2,  color: "#e63946" },
      { label: "Top 10 Wallets",  pct: 34.8, color: "#d4a017" },
      { label: "Top 11-50",       pct: 24.1, color: "#f4e08a" },
      { label: "Community (51+)", pct: 35.9, color: "#2a9d8f" },
    ],
    topHolders: [
      { rank: 1, address: "LIFEdevXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  pct: 5.2,  amountTokens: 52_000_000,  label: "Dev Wallet",    isKnown: true  },
      { rank: 2, address: "5xWh...F9mK", pct: 8.4,  amountTokens: 84_000_000,  label: "Whale",         isKnown: false },
      { rank: 3, address: "9aLp...7rTx", pct: 6.1,  amountTokens: 61_000_000,  isKnown: false         },
      { rank: 4, address: "3kBN...2uQa", pct: 4.8,  amountTokens: 48_000_000,  isKnown: false         },
      { rank: 5, address: "7mDc...8sYv", pct: 4.2,  amountTokens: 42_000_000,  isKnown: false         },
      { rank: 6, address: "2nFg...1pWe", pct: 3.7,  amountTokens: 37_000_000,  isKnown: false         },
      { rank: 7, address: "8qTr...4kZn", pct: 3.1,  amountTokens: 31_000_000,  isKnown: false         },
      { rank: 8, address: "6vJs...9mAb", pct: 2.8,  amountTokens: 28_000_000,  isKnown: false         },
      { rank: 9, address: "1cHu...6lRp", pct: 2.4,  amountTokens: 24_000_000,  isKnown: false         },
      { rank: 10, address: "4bKd...3sNw", pct: 2.1, amountTokens: 21_000_000, isKnown: false         },
    ],
  };
}

export function getMockEngagementMetrics(): EngagementMetrics {
  const buyers  = randInt(18, 220);
  const sellers = randInt(8, 110);
  return {
    uniqueBuyers1h:   buyers,
    uniqueSellers1h:  sellers,
    buyPressure:      +((buyers / (buyers + sellers)) * 100).toFixed(1),
    newHolders1h:     randInt(3, 45),
    avgHoldTime:      +rand(12, 180).toFixed(0),
    aiAgentTxPct:     +rand(8, 32).toFixed(1),
    communityScore:   +rand(42, 88).toFixed(0),
    tgMemberCount:    randInt(180, 2400),
    xFollowerCount:   randInt(120, 3200),
    activityHistory:  genActivityHistory(),
  };
}
