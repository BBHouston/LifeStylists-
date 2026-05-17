"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import type { PumpData } from "@/lib/types";

interface Props { data: PumpData }

function fmt(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function BondingCurveChart({ data }: Props) {
  const pct = data.bondingCurvePct;
  const readinessColor =
    pct >= 90 ? "#22c55e" :
    pct >= 60 ? "#d4a017" :
    "#60a5fa";

  const chartData = data.priceHistory.map((p) => ({
    time: fmt(p.ts),
    price: p.price,
    sol: p.sol,
  }));

  return (
    <div className="card-glow rounded-xl border border-[#162844] bg-[#0a1628] p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-0.5">
            Bonding Curve
          </h2>
          <p className="text-xs text-gray-500">
            {data.bondingCurveSol.toFixed(2)} / {data.graduationThresholdSol} SOL
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold font-mono" style={{ color: readinessColor }}>
            {pct.toFixed(1)}%
          </span>
          <p className="text-xs text-gray-500">to graduation</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-4 rounded-full bg-[#162844] mb-1 overflow-hidden">
        <div
          className="fill-bar h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, #d4a017 0%, #f4e08a ${pct}%, #d4a017 100%)`,
          }}
        />
        {/* Graduation marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-emerald-400/80"
          style={{ left: "100%" }}
          title="Graduation threshold"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600 mb-4">
        <span>0 SOL</span>
        <span className="text-emerald-400/70">Graduation → Raydium</span>
        <span>{data.graduationThresholdSol} SOL</span>
      </div>

      {/* Price history chart */}
      <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">Price History (48h)</h3>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#d4a017" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#d4a017" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#162844" />
          <XAxis dataKey="time" tick={{ fill: "#4b5563", fontSize: 10 }} interval={7} />
          <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} tickFormatter={(v) => `$${v.toFixed(7)}`} />
          <Tooltip
            contentStyle={{ background: "#0a1628", border: "1px solid #d4a017", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#d4a017" }}
            itemStyle={{ color: "#f4e08a" }}
          />
          <Area type="monotone" dataKey="price" stroke="#d4a017" fill="url(#priceGrad)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>

      {/* Key stats row */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#162844]">
        <div className="text-center">
          <p className="text-xs text-gray-500">Price USD</p>
          <p className="font-mono text-sm text-white">${data.priceUsd.toFixed(7)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Market Cap</p>
          <p className="font-mono text-sm text-[#d4a017]">
            ${(data.marketCapUsd / 1000).toFixed(1)}k
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">24h Volume</p>
          <p className="font-mono text-sm text-white">
            ${(data.volumeUsd24h / 1000).toFixed(1)}k
          </p>
        </div>
      </div>
    </div>
  );
}
