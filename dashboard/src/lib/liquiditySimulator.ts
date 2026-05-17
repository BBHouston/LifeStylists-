// Liquidity migration simulator: models Pump.fun → Raydium transition.
// Bonding curve graduates at 69 SOL; Raydium pool requires seeding both sides.

import type { LiquiditySimParams, LiquiditySimResult } from "./types";

const SOL_PRICE_USD = 185; // update via live oracle in production

export function simulateLiquidity(params: LiquiditySimParams): LiquiditySimResult {
  const {
    currentMarketCapSol,
    devAllocationPct,
    targetSlippagePct,
    targetLiquidityDepthUsd,
  } = params;

  const GRADUATION_THRESHOLD = 69; // SOL
  const progressPct = Math.min(100, (currentMarketCapSol / GRADUATION_THRESHOLD) * 100);

  // Recommended liquidity: aim to achieve target slippage depth
  // Formula: liq = (trade_size / slippage) * 2  (constant product AMM approximation)
  const recommendedLiqUsd = (targetLiquidityDepthUsd / (targetSlippagePct / 100)) * 2;
  const recommendedLiqSol = recommendedLiqUsd / SOL_PRICE_USD;

  // Dev wallet should ideally provide 40-60% of initial liquidity
  const devContributionUsd = (currentMarketCapSol * SOL_PRICE_USD) * (devAllocationPct / 100) * 0.5;

  // Price impact estimates using constant product AMM (x * y = k)
  const poolSize = recommendedLiqUsd / 2; // each side in USD
  const priceImpact1k  = (1000  / (poolSize + 1000))  * 100;
  const priceImpact10k = (10000 / (poolSize + 10000)) * 100;

  // Raydium fee tier is 0.25%; estimate APY based on assumed daily volume
  const assumedDailyVolume = recommendedLiqUsd * 2;
  const raydiumFeeApy = (assumedDailyVolume * 0.0025 * 365) / recommendedLiqUsd * 100;

  // Migration readiness
  let migrationReadiness: LiquiditySimResult["migrationReadiness"] = "not_ready";
  if (progressPct >= 100) migrationReadiness = "overdue";
  else if (progressPct >= 85) migrationReadiness = "ready";
  else if (progressPct >= 60) migrationReadiness = "borderline";

  const notes: string[] = [];
  if (devAllocationPct > 10) notes.push("Dev allocation >10% may signal centralization risk — consider vesting.");
  if (priceImpact1k > 2) notes.push("High price impact on $1k trades — increase pool depth before migration.");
  if (recommendedLiqSol > devContributionUsd / SOL_PRICE_USD * 2)
    notes.push("Community raise or LP incentives recommended to hit target depth.");
  if (progressPct >= 85) notes.push("Bonding curve near graduation — prepare Raydium pool parameters now.");

  // Initial token price after migration (approximate)
  const totalSupply = 1_000_000_000; // standard Pump.fun supply
  const initialPricePerToken = (recommendedLiqUsd / 2) / totalSupply;

  return {
    recommendedLiqSol:      +recommendedLiqSol.toFixed(2),
    recommendedLiqUsd:      +recommendedLiqUsd.toFixed(0),
    initialPricePerToken,
    priceImpact1kUsd:       +priceImpact1k.toFixed(2),
    priceImpact10kUsd:      +priceImpact10k.toFixed(2),
    raydiumFeeApy:          +raydiumFeeApy.toFixed(1),
    migrationReadiness,
    notes,
  };
}
