// GET /api/holders
// Returns token holder distribution for $LIFE.
//
// REAL INTEGRATION:
//   Helius RPC (free 100k requests/day):
//     POST https://mainnet.helius-rpc.com/?api-key=<KEY>
//     Method: getTokenLargestAccounts
//     Set HELIUS_API_KEY in .env.local
//
//   Alternative — Solscan API:
//     GET https://public-api.solscan.io/token/holders?tokenAddress=<MINT>&limit=50
//     No API key needed for public endpoints.
//
//   To calculate Gini coefficient, fetch all holders and rank by balance.

import { getMockHolderData } from "@/lib/mockData";

export async function GET() {
  // --- REAL IMPLEMENTATION ---
  // const mint = process.env.LIFE_MINT_ADDRESS;
  // const heliusKey = process.env.HELIUS_API_KEY;
  // if (mint && heliusKey) {
  //   const res = await fetch(`https://mainnet.helius-rpc.com/?api-key=${heliusKey}`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getTokenLargestAccounts", params: [mint] }),
  //     next: { revalidate: 30 },
  //   });
  //   // Map to HolderData...
  // }

  const data = getMockHolderData();
  return Response.json(data);
}
