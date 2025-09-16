'use client';

import { useState, useEffect } from 'react';
import { Address } from 'viem';
import { readContract } from '@wagmi/core';
import { wagmiConfig as config } from '@/lib/wallet';
import { useAccount } from 'wagmi';

export function useApprovedStatusPair(
  pairAddress: Address | undefined,
  DEXRouter: Address,
  amount: number,
  isProcessing: boolean
): boolean {
  const [isApproved, setIsApproved] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    const checkPairApproval = async () => {
      if (!pairAddress || !DEXRouter || amount <= 0 || isProcessing || !address) {
        setIsApproved(true);
        return;
      }

      try {
        // Check allowance for LP tokens to DEXRouter
        const allowance = await readContract(config, {
          address: pairAddress,
          abi: [
            {
              inputs: [
                { internalType: "address", name: "owner", type: "address" },
                { internalType: "address", name: "spender", type: "address" }
              ],
              name: "allowance",
              outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
              stateMutability: "view",
              type: "function"
            }
          ],
          functionName: 'allowance',
          args: [address, DEXRouter],
        }) as bigint;

        const amountWei = BigInt(amount * Math.pow(10, 18)); // Assuming 18 decimals for LP tokens
        setIsApproved(allowance >= amountWei);
      } catch (error) {
        console.error('Error checking pair approval status:', error);
        setIsApproved(false);
      }
    };

    checkPairApproval();
  }, [pairAddress, DEXRouter, amount, isProcessing, address]);

  return isApproved;
}
