'use client';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import { createPublicClient, http, formatUnits } from 'viem';
import { pulsechain } from '@/lib/chains/pulsechain';
import erc20 from '@/abis/erc20.json';
import pairAbi from '@/abis/uniswapV2Pair.json';

const client = createPublicClient({ 
  chain: pulsechain, 
  transport: http('https://rpc.pulsechain.com') 
});

type SwapData = {
  id: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  timestamp: number;
  txHash: string;
};

type LiquidityPool = {
  poolAddress: string;
  token0: string;
  token1: string;
  token0Symbol: string;
  token1Symbol: string;
  liquidity: string;
  share: string;
};

// Mock data for now - in real implementation, you'd query blockchain events
const MOCK_SWAPS: SwapData[] = [
  {
    id: '1',
    tokenIn: 'PLSX',
    tokenOut: 'WPLS',
    amountIn: '100.5',
    amountOut: '0.95',
    timestamp: Date.now() - 3600000,
    txHash: '0x1234567890abcdef1234567890abcdef12345678'
  },
  {
    id: '2',
    tokenIn: 'WETH',
    tokenOut: 'WPLS',
    amountIn: '0.1',
    amountOut: '95.2',
    timestamp: Date.now() - 7200000,
    txHash: '0x2345678901bcdef12345678901bcdef123456789'
  },
  {
    id: '3',
    tokenIn: 'HEX',
    tokenOut: 'PLSX',
    amountIn: '1000',
    amountOut: '50.8',
    timestamp: Date.now() - 10800000,
    txHash: '0x3456789012cdef123456789012cdef1234567890'
  }
];

export function usePortfolioData() {
  const { address, isConnected } = useAccount();
  const [swaps, setSwaps] = useState<SwapData[]>([]);
  const [liquidityPools, setLiquidityPools] = useState<LiquidityPool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setSwaps([]);
      setLiquidityPools([]);
      setError(null);
      return;
    }

    const fetchPortfolioData = async () => {
      setLoading(true);
      setError(null);

      try {
        // TODO: Implement real blockchain data fetching
        // For now, simulate API call delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSwaps(MOCK_SWAPS);
        
        // Mock liquidity pools - in real implementation, you'd:
        // 1. Query all LP token contracts the user holds
        // 2. Get token0/token1 from each pool
        // 3. Calculate user's share and liquidity
        setLiquidityPools([
          {
            poolAddress: '0x1b45b9148791d3a104184Cd5DFE5CE57193a3ee9',
            token0: 'PLSX',
            token1: 'WPLS',
            token0Symbol: 'PLSX',
            token1Symbol: 'WPLS',
            liquidity: '500.0',
            share: '0.5%'
          },
          {
            poolAddress: '0x29d66d5900eb0d629e1e6946195520065a6c5aee',
            token0: 'WETH',
            token1: 'WPLS',
            token0Symbol: 'WETH',
            token1Symbol: 'WPLS',
            liquidity: '0.2',
            share: '0.1%'
          }
        ]);

      } catch (err) {
        setError('Failed to load portfolio data');
        console.error('Portfolio data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [address, isConnected]);

  return {
    swaps,
    liquidityPools,
    loading,
    error,
    isConnected
  };
}

// Helper function to get token symbol from address
export async function getTokenSymbol(tokenAddress: Address): Promise<string> {
  try {
    const symbol = await client.readContract({
      address: tokenAddress,
      abi: erc20.abi as any,
      functionName: 'symbol',
      args: []
    });
    return symbol as string;
  } catch {
    return 'UNKNOWN';
  }
}

// Helper function to get pair tokens from pool address
export async function getPairTokens(poolAddress: Address): Promise<{ token0: Address; token1: Address }> {
  try {
    const [token0, token1] = await Promise.all([
      client.readContract({
        address: poolAddress,
        abi: pairAbi.abi as any,
        functionName: 'token0',
        args: []
      }),
      client.readContract({
        address: poolAddress,
        abi: pairAbi.abi as any,
        functionName: 'token1',
        args: []
      })
    ]);
    return { token0: token0 as Address, token1: token1 as Address };
  } catch {
    throw new Error('Failed to get pair tokens');
  }
}
