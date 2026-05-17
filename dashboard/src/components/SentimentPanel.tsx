"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { SentimentData } from "@/lib/types";

interface Props { data: SentimentData }

function fmt(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const PLATFORM_ICON = {
  x: (
    <svg className="w-3 h-3 inline" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  telegram: (
    <svg className="w-3 h-3 inline" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
};

const SENTIMENT_BADGE = {
  positive: "bg-emerald-900/50 text-emerald-300 border-emerald-700",
  negative: "bg-red-900/50 text-red-300 border-red-700",
  neutral:  "bg-gray-800 text-gray-400 border-gray-600",
};

export default function SentimentPanel({ data }: Props) {
  const scoreColor =
    data.score > 30 ? "#22c55e" :
    data.score < -20 ? "#ef4444" :
    "#d4a017";

  const chartData = data.history.map((p) => ({ time: fmt(p.ts), score: p.score }));

  return (
    <div className="card-glow rounded-xl border border-[#162844] bg-[#0a1628] p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-0.5">
            Live Sentiment
          </h2>
          <p className="text-xs text-gray-500">X (Twitter) + Telegram</p>
        </div>
        <div className="text-right">
          <span
            className="text-2xl font-bold font-mono"
            style={{ color: scoreColor }}
          >
            {data.score > 0 ? "+" : ""}{data.score.toFixed(1)}
          </span>
          <p className="text-xs capitalize" style={{ color: scoreColor }}>
            {data.overall}
          </p>
        </div>
      </div>

      {/* Sentiment bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-3">
        <div className="bg-emerald-500 transition-all" style={{ width: `${data.positivePct}%` }} />
        <div className="bg-gray-600 transition-all"   style={{ width: `${data.neutralPct}%` }} />
        <div className="bg-red-500 transition-all"    style={{ width: `${data.negativePct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mb-4">
        <span className="text-emerald-400">▲ {data.positivePct.toFixed(0)}% positive</span>
        <span>{data.neutralPct.toFixed(0)}% neutral</span>
        <span className="text-red-400">▼ {data.negativePct.toFixed(0)}% negative</span>
      </div>

      {/* Mention counts */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-[#162844] p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">X Mentions / 1h</p>
          <p className="font-mono font-bold text-white">{data.mentionsX}</p>
        </div>
        <div className="rounded-lg bg-[#162844] p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">TG Messages / 1h</p>
          <p className="font-mono font-bold text-white">{data.mentionsTg}</p>
        </div>
      </div>

      {/* Trending keywords */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {data.topKeywords.map((kw) => (
          <span
            key={kw}
            className="px-2 py-0.5 rounded-full text-xs border border-[#d4a017]/40 text-[#d4a017] bg-[#d4a017]/8"
          >
            {kw}
          </span>
        ))}
      </div>

      {/* Sentiment history */}
      <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">Sentiment Score (24h)</h3>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#162844" />
          <XAxis dataKey="time" tick={{ fill: "#4b5563", fontSize: 10 }} interval={5} />
          <YAxis domain={[-100, 100]} tick={{ fill: "#4b5563", fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: "#0a1628", border: "1px solid #d4a017", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#d4a017" }}
            itemStyle={{ color: "#f4e08a" }}
          />
          <ReferenceLine y={0} stroke="#4b5563" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="score" stroke={scoreColor} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      {/* Recent posts */}
      <h3 className="text-xs text-gray-500 uppercase tracking-widest mt-4 mb-2">Recent Posts</h3>
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {data.recentPosts.map((post, i) => (
          <div key={i} className="rounded-lg bg-[#060d1a] border border-[#162844] p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                {PLATFORM_ICON[post.platform]}
                <span className="font-medium text-gray-300">{post.author}</span>
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded border ${SENTIMENT_BADGE[post.sentiment]}`}>
                {post.sentiment}
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{post.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
