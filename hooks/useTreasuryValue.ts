"use client";

import { useEffect, useState } from 'react';
import { usePublicClient, useBalance } from 'wagmi';
import { readContract } from '@wagmi/core';
import { wagmiConfig } from '@/lib/wallet';
import { CONTRACT_ADDRESS } from '@/app/config';
import PulseXFeeWrapperABI from '@/abis/PulseXFeeWrapper.json';
import { Address } from 'viem';

interface TreasuryData {
  treasuryAddress: Address | null;
  balancePLS: bigint;
  balanceUSD: number;
  loading: boolean;
  error: string | null;
}

export function useTreasuryValue(): TreasuryData {
  const publicClient = usePublicClient();
  const [data, setData] = useState<TreasuryData>({
    treasuryAddress: null,
    balancePLS: BigInt(0),
    balanceUSD: 0,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const fetchTreasuryData = async () => {
      if (!publicClient) return;

      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Pobierz adres treasury z kontraktu PulseXFeeWrapper
        const treasuryAddress = await readContract(wagmiConfig, {
          address: CONTRACT_ADDRESS,
          abi: PulseXFeeWrapperABI.abi,
          functionName: 'treasury',
        }) as Address;

        // Pobierz saldo treasury w PLS
        const balancePLS = await publicClient.getBalance({
          address: treasuryAddress,
        });

        // Przelicz na USD (zakładamy kurs ~$0.0000001 PLS, ale w rzeczywistości należy użyć prawdziwego kursu)
        // W produkcyjnym środowisku należałoby użyć prawdziwego API do kursów lub kontraktu cenowego
        const plsToUsdRate = 0.0000001; // Placeholder - replace with real rate
        const balanceUSD = Number(balancePLS) * plsToUsdRate / 1e18; // Convert from wei to PLS

        setData({
          treasuryAddress,
          balancePLS,
          balanceUSD,
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error fetching treasury data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch treasury data',
        }));
      }
    };

    fetchTreasuryData();
  }, [publicClient]);

  return data;
}
