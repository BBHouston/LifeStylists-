"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import BondingCurveChart from "@/components/BondingCurveChart";
import SentimentPanel from "@/components/SentimentPanel";
import HolderDistribution from "@/components/HolderDistribution";
import EngagementMetricsPanel from "@/components/EngagementMetrics";
import AlertsPanel from "@/components/AlertsPanel";
import LiquiditySimulator from "@/components/LiquiditySimulator";
import type {
  PumpData, SentimentData, HolderData, EngagementMetrics, AlertEvent,
} from "@/lib/types";

const REFRESH_INTERVAL = 30_000; // 30 seconds

export default function Dashboard() {
  const [pump,       setPump]       = useState<PumpData | null>(null);
  const [sentiment,  setSentiment]  = useState<SentimentData | null>(null);
  const [holders,    setHolders]    = useState<HolderData | null>(null);
  const [engagement, setEngagement] = useState<EngagementMetrics | null>(null);
  const [alerts,     setAlerts]     = useState<AlertEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab,  setActiveTab]  = useState<"overview" | "sentiment" | "holders" | "liquidity">("overview");
  const prevVolume = useRef<number>(0);
  const prevSentiment = useRef<number>(0);

  const fetchAll = useCallback(async () => {
    setRefreshing(true);
    try {
      const [pumpRes, sentRes, holdRes, engRes] = await Promise.all([
        fetch("/api/pump-data"),
        fetch("/api/sentiment"),
        fetch("/api/holders"),
        fetch("/api/engagement"),
      ]);

      const [pumpData, sentData, holdData, engData]: [
        PumpData, SentimentData, HolderData, EngagementMetrics
      ] = await Promise.all([
        pumpRes.json(), sentRes.json(), holdRes.json(), engRes.json(),
      ]);

      setPump(pumpData);
      setSentiment(sentData);
      setHolders(holdData);
      setEngagement(engData);
      setLastUpdated(new Date());

      // Auto-fire alerts when thresholds crossed
      const newAlerts: AlertEvent[] = [];

      if (prevVolume.current && pumpData.volumeUsd24h > prevVolume.current * 1.25) {
        newAlerts.push({
          id: `vol-${Date.now()}`,
          type: "volume_milestone",
          message: `Volume spiked +25% — now $${(pumpData.volumeUsd24h / 1000).toFixed(1)}k (24h). Potential breakout.`,
          ts: Date.now(),
          severity: "warning",
        });
      }

      if (prevSentiment.current && sentData.score < prevSentiment.current - 15) {
        newAlerts.push({
          id: `sent-${Date.now()}`,
          type: "sentiment_shift",
          message: `Sentiment dropped ${(prevSentiment.current - sentData.score).toFixed(1)} points to ${sentData.score.toFixed(1)}. Monitor for sell pressure.`,
          ts: Date.now(),
          severity: "warning",
        });
      }

      if (pumpData.bondingCurvePct >= 80 && pumpData.bondingCurvePct < 85) {
        newAlerts.push({
          id: `bc-${Date.now()}`,
          type: "bonding_curve_pct",
          message: `Bonding curve at ${pumpData.bondingCurvePct.toFixed(1)}% — approaching graduation. Prepare Raydium liquidity pool.`,
          ts: Date.now(),
          severity: "info",
        });
      }

      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev].slice(0, 20));
      }

      prevVolume.current   = pumpData.volumeUsd24h;
      prevSentiment.current = sentData.score;
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [fetchAll]);

  async function testAlert(platform: "slack" | "discord") {
    const testEvent: AlertEvent = {
      id: `test-${Date.now()}`,
      type: "volume_milestone",
      message: "Test alert from LIFESTYLIST $LIFE Dashboard — alerts are working!",
      ts: Date.now(),
      severity: "info",
    };
    setAlerts((prev) => [testEvent, ...prev].slice(0, 20));
    await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: testEvent, platform }),
    });
  }

  const loading = !pump || !sentiment || !holders || !engagement;

  const TABS = [
    { id: "overview",  label: "Overview" },
    { id: "sentiment", label: "Sentiment" },
    { id: "holders",   label: "Holders" },
    { id: "liquidity", label: "Liquidity Sim" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#060d1a]">
      <Header lastUpdated={lastUpdated} refreshing={refreshing} onRefresh={fetchAll} />

      <main className="mx-auto max-w-screen-2xl px-4 py-6">
        {/* Loading skeleton */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center space-y-3">
              <div className="inline-block w-12 h-12 rounded-full border-2 border-[#d4a017] border-t-transparent animate-spin" />
              <p className="text-gray-500 text-sm">Loading $LIFE data…</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* Top stat bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              <StatCard
                label="Price"
                value={`$${pump.priceUsd.toFixed(7)}`}
                sub={`${pump.priceSol.toFixed(9)} SOL`}
                highlight
              />
              <StatCard
                label="Market Cap"
                value={`$${(pump.marketCapUsd / 1000).toFixed(1)}k`}
                sub={`${pump.marketCapSol.toFixed(1)} SOL`}
                trend="up"
              />
              <StatCard
                label="Volume 24h"
                value={`$${(pump.volumeUsd24h / 1000).toFixed(1)}k`}
                trend={pump.volumeUsd24h > 20000 ? "up" : "neutral"}
              />
              <StatCard
                label="Bonding Curve"
                value={`${pump.bondingCurvePct.toFixed(1)}%`}
                sub="to graduation"
                trend={pump.bondingCurvePct > 75 ? "up" : "neutral"}
              />
              <StatCard
                label="Sentiment"
                value={`${sentiment.score > 0 ? "+" : ""}${sentiment.score.toFixed(0)}`}
                sub={sentiment.overall}
                trend={sentiment.score > 30 ? "up" : sentiment.score < -10 ? "down" : "neutral"}
              />
              <StatCard
                label="Holders"
                value={pump.holderCount.toLocaleString()}
                sub={`+${engagement.newHolders1h}/1h`}
                trend="up"
              />
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 mb-6 border-b border-[#162844] pb-0">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px
                    ${activeTab === tab.id
                      ? "border-[#d4a017] text-[#d4a017]"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Overview tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <BondingCurveChart data={pump} />
                <SentimentPanel data={sentiment} />
                <EngagementMetricsPanel data={engagement} />
                <AlertsPanel events={alerts} onTestAlert={testAlert} />
              </div>
            )}

            {/* Sentiment tab */}
            {activeTab === "sentiment" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SentimentPanel data={sentiment} />
                <EngagementMetricsPanel data={engagement} />
              </div>
            )}

            {/* Holders tab */}
            {activeTab === "holders" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <HolderDistribution data={holders} />
                <AlertsPanel events={alerts} onTestAlert={testAlert} />
              </div>
            )}

            {/* Liquidity simulator tab */}
            {activeTab === "liquidity" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <LiquiditySimulator />
                <div className="space-y-5">
                  <BondingCurveChart data={pump} />
                  <HolderDistribution data={holders} />
                </div>
              </div>
            )}

            {/* Footer */}
            <footer className="mt-10 pt-6 border-t border-[#162844] text-center text-xs text-gray-600">
              <p className="text-gold-gradient font-semibold text-sm mb-1">LIFESTYLIST $LIFE</p>
              <p>Build the system. Own the network. Scale the life.</p>
              <p className="mt-2">
                Data refreshes every {REFRESH_INTERVAL / 1000}s.{" "}
                Simulated data — replace with live APIs before launch.
              </p>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
