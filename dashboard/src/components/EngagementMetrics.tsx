"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import type { EngagementMetrics } from "@/lib/types";

interface Props { data: EngagementMetrics }

function fmt(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function EngagementMetricsPanel({ data }: Props) {
  const chartData = data.activityHistory.slice(-12).map((p) => ({
    time: fmt(p.ts),
    Buyers: p.buyers,
    Sellers: p.sellers,
    "New Holders": p.newHolders,
  }));

  const buyPressureColor =
    data.buyPressure > 65 ? "#22c55e" :
    data.buyPressure > 40 ? "#d4a017" :
    "#ef4444";

  return (
    <div className="card-glow rounded-xl border border-[#162844] bg-[#0a1628] p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-0.5">
            Engagement Metrics
          </h2>
          <p className="text-xs text-gray-500">Community + AI-agent activity</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold font-mono" style={{ color: buyPressureColor }}>
            {data.buyPressure.toFixed(0)}%
          </span>
          <p className="text-xs text-gray-500">buy pressure</p>
        </div>
      </div>

      {/* Buy pressure bar */}
      <div className="h-3 rounded-full bg-[#162844] mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${data.buyPressure}%`,
            background: `linear-gradient(90deg, #ef4444 0%, ${buyPressureColor} 100%)`,
          }}
        />
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {[
          { label: "Buyers / 1h",     value: data.uniqueBuyers1h,           color: "#22c55e" },
          { label: "Sellers / 1h",    value: data.uniqueSellers1h,          color: "#ef4444" },
          { label: "New Holders / 1h",value: data.newHolders1h,             color: "#d4a017" },
          { label: "Avg Hold Time",   value: `${data.avgHoldTime}min`,      color: "#60a5fa" },
          { label: "AI Bot Txs",      value: `${data.aiAgentTxPct}%`,       color: "#a855f7" },
          { label: "Community Score", value: `${data.communityScore}/100`,  color: "#d4a017" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg bg-[#162844] p-3">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="font-mono font-bold text-sm" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Social reach */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-[#060d1a] border border-[#162844] p-3 flex items-center gap-3">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <div>
            <p className="text-xs text-gray-500">X Followers</p>
            <p className="font-mono text-sm text-white">{data.xFollowerCount.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-lg bg-[#060d1a] border border-[#162844] p-3 flex items-center gap-3">
          <svg className="w-5 h-5 text-[#2AABEE]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          <div>
            <p className="text-xs text-gray-500">TG Members</p>
            <p className="font-mono text-sm text-white">{data.tgMemberCount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Activity chart */}
      <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">Activity (12h)</h3>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#162844" />
          <XAxis dataKey="time" tick={{ fill: "#4b5563", fontSize: 10 }} interval={3} />
          <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: "#0a1628", border: "1px solid #d4a017", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#d4a017" }}
          />
          <Bar dataKey="Buyers"      stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Sellers"     stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
          <Bar dataKey="New Holders" fill="#d4a017" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* AI agent note */}
      <div className="mt-4 p-3 rounded-lg bg-purple-900/20 border border-purple-800/40 text-xs text-purple-300">
        <span className="font-semibold text-purple-200">AI Agent Activity:</span>{" "}
        {data.aiAgentTxPct.toFixed(1)}% of recent transactions match automated bot patterns.
        {data.aiAgentTxPct > 25
          ? " High bot activity — monitor for wash trading."
          : " Normal range for a Pump.fun launch."}
      </div>
    </div>
  );
}
