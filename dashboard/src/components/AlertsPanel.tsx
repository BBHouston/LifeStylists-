"use client";

import { useState } from "react";
import type { AlertConfig, AlertEvent, AlertType } from "@/lib/types";

interface Props {
  events: AlertEvent[];
  onTestAlert: (platform: "slack" | "discord") => void;
}

const ALERT_TYPES: { type: AlertType; label: string; defaultThreshold: number; unit: string }[] = [
  { type: "volume_milestone",  label: "Volume Milestone",     defaultThreshold: 50000, unit: "USD" },
  { type: "bonding_curve_pct", label: "Bonding Curve %",      defaultThreshold: 80,    unit: "%" },
  { type: "sentiment_shift",   label: "Sentiment Shift",      defaultThreshold: -20,   unit: "pts" },
  { type: "holder_whale",      label: "Whale Accumulation",   defaultThreshold: 5,     unit: "%" },
  { type: "price_change",      label: "Price Change Alert",   defaultThreshold: 30,    unit: "%" },
];

const SEVERITY_STYLE = {
  info:     "border-blue-700  bg-blue-900/20  text-blue-300",
  warning:  "border-[#d4a017] bg-[#d4a017]/10 text-[#f4e08a]",
  critical: "border-red-700   bg-red-900/20   text-red-300",
};

const SEVERITY_DOT = {
  info: "bg-blue-400",
  warning: "bg-[#d4a017]",
  critical: "bg-red-400",
};

export default function AlertsPanel({ events, onTestAlert }: Props) {
  const [platform, setPlatform] = useState<"slack" | "discord">("discord");
  const [webhookInput, setWebhookInput] = useState("");
  const [saved, setSaved] = useState(false);

  function saveWebhook() {
    if (webhookInput.trim()) {
      localStorage.setItem(`${platform}_webhook`, webhookInput.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div className="card-glow rounded-xl border border-[#162844] bg-[#0a1628] p-5">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">
        Automated Alerts
      </h2>

      {/* Alert triggers */}
      <div className="space-y-2 mb-5">
        {ALERT_TYPES.map(({ type, label, defaultThreshold, unit }) => (
          <div
            key={type}
            className="flex items-center justify-between rounded-lg bg-[#060d1a] border border-[#162844] px-3 py-2"
          >
            <div>
              <p className="text-xs font-medium text-gray-300">{label}</p>
              <p className="text-xs text-gray-600">
                Trigger when &gt; {defaultThreshold}{unit}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono">
                {defaultThreshold}{unit}
              </span>
              <div className="w-8 h-4 rounded-full bg-[#d4a017]/30 relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-[#d4a017]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Webhook config */}
      <div className="rounded-lg bg-[#060d1a] border border-[#162844] p-4 mb-4">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Webhook Config</p>
        <div className="flex gap-2 mb-3">
          {(["slack", "discord"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors
                ${platform === p
                  ? "bg-[#d4a017] text-black"
                  : "border border-[#162844] text-gray-400 hover:border-[#d4a017]/40"
                }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="url"
          placeholder={`Paste your ${platform} webhook URL…`}
          value={webhookInput}
          onChange={(e) => setWebhookInput(e.target.value)}
          className="w-full bg-[#0a1628] border border-[#162844] rounded px-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#d4a017]/60 mb-2"
        />
        <div className="flex gap-2">
          <button
            onClick={saveWebhook}
            className="flex-1 py-1.5 rounded bg-[#d4a017] text-black text-xs font-semibold hover:bg-[#e6bb30] transition-colors"
          >
            {saved ? "Saved!" : "Save Webhook"}
          </button>
          <button
            onClick={() => onTestAlert(platform)}
            className="px-3 py-1.5 rounded border border-[#d4a017]/40 text-[#d4a017] text-xs hover:bg-[#d4a017]/10 transition-colors"
          >
            Test
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {platform === "slack"
            ? "Create at: Slack → Apps → Incoming Webhooks"
            : "Create at: Discord channel → Edit → Integrations → Webhooks"}
        </p>
      </div>

      {/* Alert log */}
      <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">Alert Log</h3>
      {events.length === 0 ? (
        <p className="text-xs text-gray-600 text-center py-6">
          No alerts fired yet. Monitoring active.
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {events.map((ev) => (
            <div
              key={ev.id}
              className={`rounded-lg border p-3 text-xs ${SEVERITY_STYLE[ev.severity]}`}
            >
              <div className="flex items-center gap-1.5 mb-0.5 font-semibold">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${SEVERITY_DOT[ev.severity]}`} />
                {ev.type.replace(/_/g, " ").toUpperCase()}
              </div>
              <p className="leading-relaxed">{ev.message}</p>
              <p className="text-gray-500 mt-1">{new Date(ev.ts).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
