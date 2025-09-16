'use client';

import { useState, useEffect } from 'react';
import { Address } from 'viem';
import { readContract } from '@wagmi/core';
import { wagmiConfig as config } from '@/lib/wallet';
import { FACTORY } from '@/app/config';
import type { Token } from '@/app/types';

export default function useLPPair(
  baseToken: Token,
  quoteToken: Token,
  isProcessing: boolean
) {
  const [isCreated, setIsCreated] = useState(false);
  const [address, setAddress] = useState<Address | undefined>();

  useEffect(() => {
    const checkPairExists = async () => {
      if (!baseToken || !quoteToken || isProcessing) return;

      try {
        const pairAddress = await readContract(config, {
          address: FACTORY,
          abi: [
            {
              inputs: [
                { internalType: "address", name: "", type: "address" },
                { internalType: "address", name: "", type: "address" }
              ],
              name: "getPair",
              outputs: [{ internalType: "address", name: "", type: "address" }],
              stateMutability: "view",
              type: "function"
            }
          ],
          functionName: 'getPair',
          args: [baseToken.address as Address, quoteToken.address as Address],
        }) as Address;

        const isPairCreated = pairAddress !== '0x0000000000000000000000000000000000000000';
        setIsCreated(isPairCreated);
        setAddress(isPairCreated ? pairAddress : undefined);
      } catch (error) {
        console.error('Error checking pair existence:', error);
        setIsCreated(false);
        setAddress(undefined);
      }
    };

    checkPairExists();
  }, [baseToken, quoteToken, isProcessing]);

  return { isCreated, address };
}
