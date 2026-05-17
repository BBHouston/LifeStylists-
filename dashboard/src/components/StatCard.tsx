"use client";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  highlight?: boolean;
}

export default function StatCard({ label, value, sub, trend, highlight }: StatCardProps) {
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-gray-400";
  const trendArrow = trend === "up" ? "▲" : trend === "down" ? "▼" : "";

  return (
    <div className={`card-glow rounded-xl border p-4 transition-colors
      ${highlight
        ? "border-[#d4a017]/60 bg-[#d4a017]/8"
        : "border-[#162844] bg-[#0a1628]"
      }`
    }>
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-bold font-mono leading-none ${highlight ? "text-gold-gradient" : "text-white"}`}>
        {value}
      </p>
      {sub && (
        <p className={`text-xs mt-1 ${trendColor}`}>
          {trendArrow} {sub}
        </p>
      )}
    </div>
  );
}
