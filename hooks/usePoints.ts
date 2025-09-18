"use client";

import { useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { Address, formatEther, parseEther } from 'viem';
import { CONTRACT_ADDRESS } from '@/app/config';
import PulseXFeeWrapperABI from '@/abis/PulseXFeeWrapper.json';
import { useUSDprice } from './useUSDprice';
import { useTokenInfo } from './useTokenInfo';

interface Transaction {
  hash: string;
  timestamp: number;
  volumeUSD: number;
  points: number;
  type: 'swap' | 'unknown';
  details: {
    functionName: string;
    amountIn?: number;
    tokenIn?: string;
    tokenOut?: string;
  };
}

interface PointsData {
  totalVolume: number;
  totalPoints: number;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

export function usePoints(): PointsData {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [data, setData] = useState<PointsData>({
    totalVolume: 0,
    totalPoints: 0,
    transactions: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!isConnected || !address || !publicClient) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchPointsData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Get the latest block to start from
        const latestBlock = await publicClient.getBlockNumber();

        // Get logs for the last ~10000 blocks (adjust as needed for your use case)
        // Note: In production, you might want to implement pagination or limit the block range
        const fromBlock = latestBlock - BigInt(10000); // Look back 10000 blocks

        // Get all transactions to the PulseXFeeWrapper contract from this user
        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          fromBlock,
          toBlock: latestBlock,
        });

        const transactions: Transaction[] = [];
        let totalVolume = 0;

        // Process each log to find transactions from this user
        // Limit to prevent excessive processing (adjust as needed)
        const maxTransactions = 100;
        let processedCount = 0;

        for (const log of logs) {
          if (processedCount >= maxTransactions) break;
          try {
            // Get transaction details
            const tx = await publicClient.getTransaction({ hash: log.transactionHash });

            // Check if this transaction is from our user
            if (tx.from.toLowerCase() !== address.toLowerCase()) continue;

            // Get transaction receipt to get the timestamp
            const receipt = await publicClient.getTransactionReceipt({ hash: log.transactionHash });
            const block = await publicClient.getBlock({ blockNumber: tx.blockNumber });
            const timestamp = Number(block.timestamp) * 1000; // Convert to milliseconds

            // Decode the function call
            const functionData = decodeFunctionCall(tx.input);

            if (functionData) {
              let volumeUSD = 0;

              // Calculate volume based on function type
              if (functionData.functionName === 'swapExactTokensForTokens') {
                // For token-to-token swaps, we need to estimate the USD value
                // This is simplified - in reality you'd need price data for each token
                const amountIn = functionData.amountIn || 0;
                // Assuming we're dealing with major tokens, estimate roughly
                volumeUSD = amountIn * 0.01; // Placeholder - replace with actual price calculation
              } else if (functionData.functionName === 'swapExactETHForTokens') {
                // For ETH swaps, we can get the value directly
                volumeUSD = Number(formatEther(tx.value));
              } else if (functionData.functionName === 'swapExactTokensForETH') {
                // For token-to-ETH swaps, estimate based on input amount
                const amountIn = functionData.amountIn || 0;
                volumeUSD = amountIn * 0.01; // Placeholder - replace with actual price calculation
              }

              // Only count transactions with volume > 0
              if (volumeUSD > 0) {
                const points = Math.floor((volumeUSD / 10000) * 100); // 10000$ = 100 points

                transactions.push({
                  hash: log.transactionHash,
                  timestamp,
                  volumeUSD,
                  points,
                  type: 'swap',
                  details: functionData,
                });

                totalVolume += volumeUSD;
                processedCount++;
              }
            }
          } catch (error) {
            console.warn('Error processing transaction:', log.transactionHash, error);
          }
        }

        // Sort transactions by timestamp (newest first)
        transactions.sort((a, b) => b.timestamp - a.timestamp);

        // Calculate total points
        const totalPoints = Math.floor((totalVolume / 10000) * 100);

        setData({
          totalVolume,
          totalPoints,
          transactions,
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error fetching points data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch points data',
        }));
      }
    };

    fetchPointsData();
  }, [address, isConnected, publicClient]);

  return data;
}

// Helper function to decode function calls
function decodeFunctionCall(input: string): {
  functionName: string;
  amountIn?: number;
  tokenIn?: string;
  tokenOut?: string;
} | null {
  try {
    if (!input || input === '0x') return null;

    // Extract function signature (first 4 bytes)
    const functionSignature = input.slice(0, 10);

    // Map function signatures to names
    const functionMap: Record<string, string> = {
      '0x7ff36ab5': 'swapExactETHForTokens',
      '0x18cbafe5': 'swapExactTokensForETH',
      '0x38ed1739': 'swapExactTokensForTokens',
    };

    const functionName = functionMap[functionSignature];
    if (!functionName) return null;

    // For now, return basic function name
    // In a real implementation, you'd decode the full parameters
    return {
      functionName,
      amountIn: 0, // Placeholder
      tokenIn: '', // Placeholder
      tokenOut: '', // Placeholder
    };
  } catch (error) {
    console.warn('Error decoding function call:', error);
    return null;
  }
}
