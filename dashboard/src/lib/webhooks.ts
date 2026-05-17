// Webhook sender for Slack and Discord alerts.
// Set SLACK_WEBHOOK_URL and/or DISCORD_WEBHOOK_URL in your .env.local file.

import type { AlertEvent } from "./types";

const SEVERITY_COLOR = {
  info:     { slack: "#2196F3", discord: 2196243 },
  warning:  { slack: "#d4a017", discord: 13934615 },
  critical: { slack: "#e63946", discord: 15096134 },
};

export async function sendSlackAlert(event: AlertEvent, webhookUrl: string): Promise<boolean> {
  const color = SEVERITY_COLOR[event.severity].slack;
  const payload = {
    attachments: [
      {
        color,
        title: `$LIFE Alert — ${event.type.replace(/_/g, " ").toUpperCase()}`,
        text: event.message,
        footer: "LIFESTYLIST $LIFE Dashboard",
        ts: Math.floor(event.ts / 1000),
        fields: [
          { title: "Severity", value: event.severity.toUpperCase(), short: true },
          { title: "Time",     value: new Date(event.ts).toUTCString(), short: true },
        ],
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendDiscordAlert(event: AlertEvent, webhookUrl: string): Promise<boolean> {
  const color = SEVERITY_COLOR[event.severity].discord;
  const payload = {
    embeds: [
      {
        title: `$LIFE Alert — ${event.type.replace(/_/g, " ").toUpperCase()}`,
        description: event.message,
        color,
        footer: { text: "LIFESTYLIST $LIFE Dashboard" },
        timestamp: new Date(event.ts).toISOString(),
        fields: [
          { name: "Severity", value: event.severity.toUpperCase(), inline: true },
        ],
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function dispatchAlert(
  event: AlertEvent,
  platform: "slack" | "discord",
  webhookUrl: string
): Promise<boolean> {
  if (!webhookUrl) return false;
  return platform === "slack"
    ? sendSlackAlert(event, webhookUrl)
    : sendDiscordAlert(event, webhookUrl);
}
