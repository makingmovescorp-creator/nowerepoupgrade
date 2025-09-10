'use client';
import { useState, useCallback } from 'react';
import type { Address } from 'viem';
import { useWriteContract } from 'wagmi';
import erc20 from '@/abis/erc20.json';

export function useApprove() {
  const { writeContractAsync } = useWriteContract();
  const [pending, setPending] = useState(false);
  const approve = useCallback(async (token: Address, spender: Address, amount: bigint) => {
    setPending(true);
    try {
      const hash = await writeContractAsync({
        address: token,
        abi: erc20.abi as any,
        functionName: 'approve',
        args: [spender, amount],
      });
      return hash;
    } finally { setPending(false); }
  }, [writeContractAsync]);
  return { approve, pending };
}


