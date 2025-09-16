'use client';

import { useState, useEffect } from 'react';
import { Address } from 'viem';
import { readContract } from '@wagmi/core';
import { wagmiConfig as config } from '@/lib/wallet';

export function useStakerInfo(address: Address | undefined, isSwapping?: boolean) {
  const [stakerInfo, setStakerInfo] = useState({
    staked: 0,
    reward: 0,
    balance: 0,
  });

  useEffect(() => {
    const fetchStakerInfo = async () => {
      if (!address) return;

      try {
        const stakingAddress = process.env.NEXT_PUBLIC_STAKING_ADDRESS as Address;

        // This is a placeholder - you would need the actual staking contract ABI
        const info = await readContract(config, {
          address: stakingAddress,
          abi: [
            {
              inputs: [{ internalType: "address", name: "staker", type: "address" }],
              name: "getStakerInfo",
              outputs: [
                { internalType: "uint256", name: "stakedAmount", type: "uint256" },
                { internalType: "uint256", name: "rewards", type: "uint256" },
                { internalType: "uint256", name: "balance", type: "uint256" }
              ],
              stateMutability: "view",
              type: "function"
            }
          ],
          functionName: 'getStakerInfo',
          args: [address],
        }) as [bigint, bigint, bigint];

        setStakerInfo({
          staked: Number(info[0]) / Math.pow(10, 18), // Convert from wei
          reward: Number(info[1]) / Math.pow(10, 18), // Convert from wei
          balance: Number(info[2]) / Math.pow(10, 18), // Convert from wei
        });
      } catch (error) {
        console.error('Error fetching staker info:', error);
        setStakerInfo({
          staked: 0,
          reward: 0,
          balance: 0,
        });
      }
    };

    if (!isSwapping) {
      fetchStakerInfo();
    }
  }, [address, isSwapping]);

  return stakerInfo;
}
