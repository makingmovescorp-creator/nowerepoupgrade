import { Address, createPublicClient, http } from 'viem';
import { pulsechain } from '@/lib/chains/pulsechain';
import pairAbi from '@/abis/uniswapV2Pair.json';

const client = createPublicClient({ chain: pulsechain, transport: http('https://rpc.pulsechain.com') });

export async function readPairTokens(pool: Address): Promise<{ token0: Address; token1: Address }> {
  try {
    const [t0, t1] = await Promise.all([
      client.readContract({ address: pool, abi: pairAbi.abi as any, functionName: 'token0', args: [] }),
      client.readContract({ address: pool, abi: pairAbi.abi as any, functionName: 'token1', args: [] }),
    ]);
    return { token0: t0 as Address, token1: t1 as Address };
  } catch (error) {
    console.warn(`Failed to read pair tokens for pool ${pool}:`, error);
    // Fallback for known pairs that might not exist on PulseChain
    const fallbackTokens: Record<string, { token0: Address; token1: Address }> = {
      '0xae8429918fdbf9a5867e3243697637dc56aa76a1': {
        token0: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as Address, // pDAI
        token1: '0xA1077a294dDE1B09bB078844df40758a5D0f9a27' as Address  // WPLS
      }
    };
    
    if (fallbackTokens[pool]) {
      return fallbackTokens[pool];
    }
    
    throw error;
  }
}