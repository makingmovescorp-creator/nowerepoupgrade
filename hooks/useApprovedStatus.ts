'use client';

import { useState, useEffect } from 'react';
import { Address } from 'viem';
import { readContract } from '@wagmi/core';
import { config } from '@/app/config/wagmi';
import type { Token } from '@/app/types';

export function useApprovedStatus(
  token: Token,
  amount: number,
  isProcessing: boolean
): boolean {
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const checkApproval = async () => {
      if (!token || token.isNative || amount <= 0 || isProcessing) {
        setIsApproved(true);
        return;
      }

      try {
        const erc20Abi = [
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
        ];

        const DEXRouter = process.env.NEXT_PUBLIC_PULSEX_ROUTER as Address;

        const allowance = await readContract(config, {
          address: token.address as Address,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [config.address || '0x0000000000000000000000000000000000000000', DEXRouter],
        }) as bigint;

        const amountWei = BigInt(amount * Math.pow(10, token.decimal));
        setIsApproved(allowance >= amountWei);
      } catch (error) {
        console.error('Error checking approval status:', error);
        setIsApproved(false);
      }
    };

    checkApproval();
  }, [token, amount, isProcessing]);

  return isApproved;
}
