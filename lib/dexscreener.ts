// lib/dexscreener.ts
export type DexPair = {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceUsd?: string;
  priceChange?: { h24?: number };
  liquidity?: { usd?: number; base?: number; quote?: number };
  volume?: { h24?: number };
};

export type DexSearchResponse = {
  schemaVersion: string;
  pairs: DexPair[];
};

const BASE = 'https://api.dexscreener.com';

export async function searchPairs(q: string, signal?: AbortSignal): Promise<DexPair[]> {
  const res = await fetch(`${BASE}/latest/dex/search?q=${encodeURIComponent(q)}`, { signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`Dexscreener HTTP ${res.status}`);
  const data = (await res.json()) as DexSearchResponse;
  return data.pairs ?? [];
}

export async function getPairsById(chainId: string, pairIdsCsv: string, signal?: AbortSignal): Promise<DexPair[]> {
  const res = await fetch(`${BASE}/latest/dex/pairs/${chainId}/${pairIdsCsv}`, { signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`Dexscreener HTTP ${res.status}`);
  const data = (await res.json()) as DexSearchResponse;
  return data.pairs ?? [];
}
