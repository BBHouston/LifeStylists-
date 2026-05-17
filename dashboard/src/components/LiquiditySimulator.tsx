"use client";

import { useState, useMemo } from "react";
import { simulateLiquidity } from "@/lib/liquiditySimulator";
import type { LiquiditySimResult } from "@/lib/types";

const READINESS_STYLE: Record<LiquiditySimResult["migrationReadiness"], {
  label: string; color: string; bg: string; border: string;
}> = {
  not_ready:  { label: "Not Ready",   color: "#60a5fa", bg: "#1e3a5f22", border: "#1e3a5f" },
  borderline: { label: "Borderline",  color: "#d4a017", bg: "#d4a01711", border: "#d4a01766" },
  ready:      { label: "Ready to Migrate", color: "#22c55e", bg: "#14532d22", border: "#166534" },
  overdue:    { label: "Overdue — Migrate Now!", color: "#ef4444", bg: "#7f1d1d22", border: "#991b1b" },
};

export default function LiquiditySimulator() {
  const [marketCapSol, setMarketCapSol]  = useState(45);
  const [devPct, setDevPct]              = useState(5);
  const [slippage, setSlippage]          = useState(1);
  const [depthUsd, setDepthUsd]          = useState(5000);

  const result = useMemo(
    () =>
      simulateLiquidity({
        currentMarketCapSol: marketCapSol,
        devAllocationPct: devPct,
        communityPct: 100 - devPct,
        targetSlippagePct: slippage,
        targetLiquidityDepthUsd: depthUsd,
      }),
    [marketCapSol, devPct, slippage, depthUsd]
  );

  const readiness = READINESS_STYLE[result.migrationReadiness];
  const progressPct = Math.min(100, (marketCapSol / 69) * 100);

  return (
    <div className="card-glow rounded-xl border border-[#162844] bg-[#0a1628] p-5">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-1">
        Liquidity Migration Simulator
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Model the Pump.fun → Raydium transition. Adjust parameters to find your optimal pool setup.
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <label className="block">
          <span className="text-xs text-gray-500 mb-1 block">
            Bonding Curve SOL ({marketCapSol} / 69 SOL)
          </span>
          <input
            type="range" min={1} max={69} step={0.5}
            value={marketCapSol}
            onChange={(e) => setMarketCapSol(+e.target.value)}
            className="w-full accent-[#d4a017]"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>0 SOL</span>
            <span className="text-[#d4a017]">{progressPct.toFixed(0)}% full</span>
            <span>69 SOL</span>
          </div>
        </label>

        <label className="block">
          <span className="text-xs text-gray-500 mb-1 block">Dev Wallet % ({devPct}%)</span>
          <input
            type="range" min={0} max={20} step={0.5}
            value={devPct}
            onChange={(e) => setDevPct(+e.target.value)}
            className="w-full accent-[#d4a017]"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>0%</span>
            <span className={devPct > 10 ? "text-red-400" : "text-gray-500"}>{devPct}%</span>
            <span>20%</span>
          </div>
        </label>

        <label className="block">
          <span className="text-xs text-gray-500 mb-1 block">Target Slippage ({slippage}%)</span>
          <input
            type="range" min={0.1} max={5} step={0.1}
            value={slippage}
            onChange={(e) => setSlippage(+e.target.value)}
            className="w-full accent-[#d4a017]"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>0.1%</span>
            <span>5%</span>
          </div>
        </label>

        <label className="block">
          <span className="text-xs text-gray-500 mb-1 block">Target Depth ${depthUsd.toLocaleString()}</span>
          <input
            type="range" min={1000} max={50000} step={500}
            value={depthUsd}
            onChange={(e) => setDepthUsd(+e.target.value)}
            className="w-full accent-[#d4a017]"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>$1k</span>
            <span>$50k</span>
          </div>
        </label>
      </div>

      {/* Migration readiness badge */}
      <div
        className="rounded-lg border p-3 mb-4 text-center"
        style={{ background: readiness.bg, borderColor: readiness.border }}
      >
        <span className="font-bold text-sm" style={{ color: readiness.color }}>
          {readiness.label}
        </span>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {[
          { label: "Recommended Liquidity",  value: `${result.recommendedLiqSol} SOL`,         color: "#d4a017" },
          { label: "Liquidity in USD",        value: `$${result.recommendedLiqUsd.toLocaleString()}`, color: "#f4e08a" },
          { label: "$1k Trade Impact",        value: `${result.priceImpact1kUsd}%`,             color: result.priceImpact1kUsd > 2 ? "#ef4444" : "#22c55e" },
          { label: "$10k Trade Impact",       value: `${result.priceImpact10kUsd}%`,            color: result.priceImpact10kUsd > 5 ? "#ef4444" : "#d4a017" },
          { label: "Est. Raydium Fee APY",    value: `${result.raydiumFeeApy}%`,                color: "#60a5fa" },
          { label: "Token Price (post-mig)", value: `$${result.initialPricePerToken.toFixed(7)}`, color: "#a855f7" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg bg-[#162844] p-3">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="font-mono font-bold text-sm" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Notes */}
      {result.notes.length > 0 && (
        <div className="space-y-1.5">
          {result.notes.map((note, i) => (
            <div key={i} className="flex gap-2 text-xs text-[#d4a017] bg-[#d4a017]/8 border border-[#d4a017]/20 rounded p-2">
              <span className="flex-shrink-0 mt-0.5">⚠</span>
              <span>{note}</span>
            </div>
          ))}
        </div>
      )}

      {/* How-to note */}
      <details className="mt-4">
        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition-colors">
          How to add liquidity on Raydium →
        </summary>
        <div className="mt-2 text-xs text-gray-400 space-y-1 leading-relaxed">
          <p>1. Go to raydium.io → Liquidity → Create Pool</p>
          <p>2. Select Base Token: paste your $LIFE mint address</p>
          <p>3. Select Quote Token: SOL (or USDC)</p>
          <p>4. Enter the recommended SOL amount above as the initial liquidity</p>
          <p>5. Set initial price by entering token amount to match target</p>
          <p>6. Click "Initialize Liquidity Pool" and confirm wallet</p>
          <p>7. Your LP tokens represent your pool share — save them to remove liquidity later</p>
          <p className="text-gray-600">Raydium standard fee: 0.25% per swap (0.22% to LPs)</p>
        </div>
      </details>
    </div>
  );
}
