"use client";

import { useEffect, useState } from "react";

interface HeaderProps {
  lastUpdated: Date | null;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function Header({ lastUpdated, refreshing, onRefresh }: HeaderProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const secAgo = lastUpdated ? Math.floor((Date.now() - lastUpdated.getTime()) / 1000) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-[#162844] bg-[#060d1a]/95 backdrop-blur">
      <div className="mx-auto max-w-screen-2xl px-4 py-3 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          {/* Inline SVG infinity logo matching brand */}
          <svg width="40" height="26" viewBox="0 0 80 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hg" x1="0" y1="0" x2="80" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#d4a017" />
                <stop offset="50%"  stopColor="#f4e08a" />
                <stop offset="100%" stopColor="#d4a017" />
              </linearGradient>
            </defs>
            <path
              d="M20 26 C20 14 10 6 0 6 C-10 6 -16 14 -16 26 C-16 38 -10 46 0 46 C10 46 20 38 20 26 Z
                 M60 26 C60 14 70 6 80 6 C90 6 96 14 96 26 C96 38 90 46 80 46 C70 46 60 38 60 26 Z
                 M20 26 C20 14 30 6 40 6 C50 6 60 14 60 26 C60 38 50 46 40 46 C30 46 20 38 20 26 Z"
              stroke="url(#hg)"
              strokeWidth="4"
              fill="none"
            />
            <path d="M32 20 L42 26 L32 32" stroke="url(#hg)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
          <div>
            <div className="text-gold-gradient font-bold text-lg leading-none tracking-widest">
              LIFESTYLIST
            </div>
            <div className="text-[#d4a017] text-xs font-mono tracking-[0.4em]">$LIFE DASHBOARD</div>
          </div>
        </div>

        {/* Center: live indicator */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 pulse-gold" />
          <span>LIVE</span>
          {secAgo !== null && (
            <span className="text-xs text-gray-500">
              — updated {secAgo < 5 ? "just now" : `${secAgo}s ago`}
            </span>
          )}
        </div>

        {/* Right: refresh + network */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-[#0a1628] border border-[#162844] text-xs text-[#d4a017] font-mono">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#9945FF]" />
            Solana
          </span>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#d4a017]/40 text-[#d4a017] text-xs font-medium hover:bg-[#d4a017]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>
    </header>
  );
}
