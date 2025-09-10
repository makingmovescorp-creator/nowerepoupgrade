import { Address, createPublicClient, http } from 'viem';
import { pulsechain } from '@/lib/chains/pulsechain';
import pairAbi from '@/abis/uniswapV2Pair.json';

const client = createPublicClient({ chain: pulsechain, transport: http('https://rpc.pulsechain.com') });

export async function readPairTokens(pool: Address): Promise<{ token0: Address; token1: Address }> {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const [t0, t1] = await Promise.all([
    client.readContract({ address: pool, abi: pairAbi.abi as any, functionName: 'token0', args: [] }),
    client.readContract({ address: pool, abi: pairAbi.abi as any, functionName: 'token1', args: [] }),
  ]);
  return { token0: t0 as Address, token1: t1 as Address };
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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
      '0x2db5ef4e8a7dbe195defae2d9b79948096a03274': {
        token0: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as Address, // DAI
        token1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address  // USDC
      }
    };
    
    if (fallbackTokens[pool]) {
      return fallbackTokens[pool];
    }
    
    throw error;
  }
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
}


