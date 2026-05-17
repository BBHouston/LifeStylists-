// GET /api/pump-data
// Returns bonding curve + price data for $LIFE.
//
// REAL INTEGRATION: Replace getMockPumpData() with:
//   1. DexScreener API — no key needed:
//      https://api.dexscreener.com/latest/dex/tokens/<MINT_ADDRESS>
//   2. Pump.fun trades API (unofficial):
//      https://frontend-api.pump.fun/coins/<MINT_ADDRESS>
//   3. Birdeye API — requires API key (free tier available):
//      https://public-api.birdeye.so/defi/price?address=<MINT_ADDRESS>
//
// Set LIFE_MINT_ADDRESS in .env.local once the token is created.

import { getMockPumpData } from "@/lib/mockData";

export async function GET() {
  // --- REAL IMPLEMENTATION (uncomment when token is live) ---
  // const mint = process.env.LIFE_MINT_ADDRESS;
  // if (mint) {
  //   const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`, {
  //     next: { revalidate: 15 },
  //   });
  //   if (res.ok) {
  //     const json = await res.json();
  //     const pair = json.pairs?.[0];
  //     // map DexScreener response to PumpData shape...
  //     return Response.json(mapped);
  //   }
  // }

  const data = getMockPumpData();
  return Response.json(data);
}
