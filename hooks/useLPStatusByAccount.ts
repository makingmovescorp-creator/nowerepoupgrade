'use client';

import { useState, useEffect } from 'react';
import { Address } from 'viem';
import { readContract } from '@wagmi/core';
import { config } from '@/app/config/wagmi';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';

export default function useLPStatusByAccount(
  pairAddress: Address | undefined,
  baseToken: any
) {
  const [balance, setBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const { address } = useAccount();

  useEffect(() => {
    const fetchLPStatus = async () => {
      if (!pairAddress || !address) return;

      try {
        // Get user balance of LP tokens
        const erc20Abi = [
          {
            inputs: [{ internalType: "address", name: "account", type: "address" }],
            name: "balanceOf",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function"
          }
        ];

        const userBalance = await readContract(config, {
          address: pairAddress,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [address],
        }) as bigint;

        // Get total supply of LP tokens
        const totalSupplyResult = await readContract(config, {
          address: pairAddress,
          abi: erc20Abi,
          functionName: 'totalSupply',
          args: [],
        }) as bigint;

        setBalance(Number(formatEther(userBalance)));
        setTotalSupply(Number(formatEther(totalSupplyResult)));
      } catch (error) {
        console.error('Error fetching LP status:', error);
        setBalance(0);
        setTotalSupply(0);
      }
    };

    fetchLPStatus();
  }, [pairAddress, address, baseToken]);

  return { balance, totalSupply };
}
