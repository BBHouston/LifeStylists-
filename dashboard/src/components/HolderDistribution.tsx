"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { HolderData } from "@/lib/types";

interface Props { data: HolderData }

const RISK_LABEL: Record<string, { label: string; color: string }> = {
  low:    { label: "Low Risk",    color: "#22c55e" },
  medium: { label: "Medium Risk", color: "#d4a017" },
  high:   { label: "High Risk",   color: "#ef4444" },
};

function concentrationRisk(gini: number) {
  if (gini < 0.55) return "low";
  if (gini < 0.72) return "medium";
  return "high";
}

export default function HolderDistribution({ data }: Props) {
  const risk = concentrationRisk(data.giniCoefficient);
  const { label: riskLabel, color: riskColor } = RISK_LABEL[risk];

  return (
    <div className="card-glow rounded-xl border border-[#162844] bg-[#0a1628] p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-0.5">
            Holder Distribution
          </h2>
          <p className="text-xs text-gray-500">{data.totalHolders.toLocaleString()} total holders</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold px-2 py-1 rounded border text-xs"
            style={{ color: riskColor, borderColor: riskColor + "44", background: riskColor + "11" }}>
            {riskLabel}
          </span>
          <p className="text-xs text-gray-500 mt-1">Gini: {data.giniCoefficient}</p>
        </div>
      </div>

      {/* Donut chart */}
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data.distribution}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            dataKey="pct"
            paddingAngle={2}
            label={false}
            labelLine={false}
          >
            {data.distribution.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value}%`, "Share"]}
            contentStyle={{ background: "#0a1628", border: "1px solid #d4a017", borderRadius: 8, fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {data.distribution.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ background: d.color }} />
            <span className="text-xs text-gray-400 truncate">{d.label}</span>
            <span className="text-xs text-white ml-auto font-mono">{d.pct}%</span>
          </div>
        ))}
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4 pt-3 border-t border-[#162844]">
        <div className="text-center">
          <p className="text-xs text-gray-500">Top 10</p>
          <p className="font-mono text-sm text-[#d4a017]">{data.top10Pct}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Dev Wallet</p>
          <p className="font-mono text-sm" style={{ color: data.devWalletPct > 10 ? "#ef4444" : "#22c55e" }}>
            {data.devWalletPct}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Community</p>
          <p className="font-mono text-sm text-emerald-400">{data.communityPct}%</p>
        </div>
      </div>

      {/* Top holders table */}
      <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">Top Holders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-600 border-b border-[#162844]">
              <th className="text-left pb-1">#</th>
              <th className="text-left pb-1">Address</th>
              <th className="text-right pb-1">%</th>
              <th className="text-right pb-1">Tokens</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#162844]">
            {data.topHolders.map((h) => (
              <tr key={h.rank} className="text-gray-400">
                <td className="py-1 text-gray-600">{h.rank}</td>
                <td className="py-1">
                  <span className="font-mono">{h.address.slice(0, 8)}…</span>
                  {h.label && (
                    <span className="ml-1 px-1 py-0.5 rounded text-[10px] bg-[#162844] text-[#d4a017]">
                      {h.label}
                    </span>
                  )}
                </td>
                <td className="py-1 text-right font-mono text-white">{h.pct}%</td>
                <td className="py-1 text-right font-mono">
                  {(h.amountTokens / 1_000_000).toFixed(1)}M
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
