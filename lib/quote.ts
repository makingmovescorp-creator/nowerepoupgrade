// lib/quote.ts
import type { Address } from 'viem';
import { createPublicClient, http } from 'viem';
import { pulsechain } from '@/lib/chains/pulsechain';
import routerAbi from '@/abis/pulsexRouter.json';

const client = createPublicClient({
  chain: pulsechain,
  transport: http('https://rpc.pulsechain.com'),
});

export async function getQuote(amountIn: bigint, path: Address[], router: Address) {
  if (amountIn === 0n || path.length < 2) return 0n;
  const amounts = await client.readContract({
    address: router,
    abi: routerAbi.abi as any,
    functionName: 'getAmountsOut',
    args: [amountIn, path]
  }) as bigint[];
  return amounts.at(-1) ?? 0n;
}
