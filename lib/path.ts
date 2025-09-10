// lib/path.ts
import type { Address } from 'viem';

export function buildPath(tokenIn: Address, tokenOut: Address, wpls: Address) {
  if (!tokenIn || !tokenOut) return [] as Address[];
  // jeśli to nie WPLS po żadnej stronie — spróbuj przez WPLS
  if (tokenIn !== wpls && tokenOut !== wpls) return [tokenIn, wpls, tokenOut];
  return [tokenIn, tokenOut];
}
