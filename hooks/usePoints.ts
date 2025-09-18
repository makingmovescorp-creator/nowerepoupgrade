"use client";

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Address } from 'viem';
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
  const [data, setData] = useState<PointsData>({
    totalVolume: 0,
    totalPoints: 0,
    transactions: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!isConnected || !address) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchPointsData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Użyj przykładowych danych zamiast obciążania RPC
        // W rzeczywistej aplikacji należałoby zaimplementować:
        // 1. Pobieranie transakcji użytkownika z API
        // 2. Filtrowanie transakcji PulseXFeeWrapper
        // 3. Obliczanie punktów na podstawie rzeczywistych transakcji

        const transactions: Transaction[] = [];
        let totalVolume = 0;

        // Przykładowe transakcje dla demonstracji
        const sampleTransactions = [
          {
            hash: '0x1234567890123456789012345678901234567890abcdef',
            timestamp: Date.now() - 86400000, // 1 dzień temu
            volumeUSD: 12500,
            type: 'swap' as const,
            details: {
              functionName: 'swapExactETHForTokens',
              amountIn: 12500,
              tokenIn: 'WPLS',
              tokenOut: 'USDC'
            }
          },
          {
            hash: '0xabcdef1234567890123456789012345678901234567890',
            timestamp: Date.now() - 172800000, // 2 dni temu
            volumeUSD: 8300,
            type: 'swap' as const,
            details: {
              functionName: 'swapExactTokensForTokens',
              amountIn: 8300,
              tokenIn: 'USDC',
              tokenOut: 'WPLS'
            }
          },
          {
            hash: '0xfedcba9876543210fedcba9876543210fedcba9876543210',
            timestamp: Date.now() - 259200000, // 3 dni temu
            volumeUSD: 15600,
            type: 'swap' as const,
            details: {
              functionName: 'swapExactTokensForETH',
              amountIn: 15600,
              tokenIn: 'USDC',
              tokenOut: 'WPLS'
            }
          }
        ];

        // Oblicz punkty na podstawie przykładowych transakcji
        for (const tx of sampleTransactions) {
          const points = Math.floor((tx.volumeUSD / 10000) * 100); // 10000$ = 100 points

          transactions.push({
            hash: tx.hash,
            timestamp: tx.timestamp,
            volumeUSD: tx.volumeUSD,
            points,
            type: tx.type,
            details: tx.details,
          });

          totalVolume += tx.volumeUSD;
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
  }, [address, isConnected]);

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
