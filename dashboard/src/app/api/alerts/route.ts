// POST /api/alerts  — fire an alert to Slack or Discord
// Body: { event: AlertEvent, platform: "slack"|"discord", webhookUrl: string }
//
// The frontend posts here when a threshold is crossed; this keeps webhook
// URLs server-side and out of the browser bundle.
// Store webhook URLs in .env.local:
//   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
//   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

import { dispatchAlert } from "@/lib/webhooks";
import type { AlertEvent } from "@/lib/types";

export async function POST(req: Request) {
  let body: { event: AlertEvent; platform: "slack" | "discord"; webhookUrl?: string };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { event, platform } = body;

  // Prefer env-var webhook (never expose the real URL to the client)
  const webhookUrl =
    platform === "slack"
      ? process.env.SLACK_WEBHOOK_URL ?? ""
      : process.env.DISCORD_WEBHOOK_URL ?? "";

  if (!webhookUrl) {
    return Response.json(
      { error: `No ${platform.toUpperCase()}_WEBHOOK_URL set in environment.` },
      { status: 503 }
    );
  }

  const ok = await dispatchAlert(event, platform, webhookUrl);

  return Response.json({ ok, ts: Date.now() }, { status: ok ? 200 : 502 });
}
