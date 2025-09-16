'use client';

import { useState, useEffect } from 'react';
import { Address } from 'viem';
import { readContract } from '@wagmi/core';
import { wagmiConfig as config } from '@/lib/wallet';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { getReserves } from '@/lib/actions';

export default function useLPStatusByAccount(
  pairAddress: Address | undefined,
  baseToken: any
) {
  const [balance, setBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [receiveBaseAmount, setReceiveBaseAmount] = useState(0);
  const [receiveQuoteAmount, setReceiveQuoteAmount] = useState(0);
  const [receiveOutOrder, setReceiveOutOrder] = useState(false);
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

        const balanceValue = Number(formatEther(userBalance));
        const totalSupplyValue = Number(formatEther(totalSupplyResult));

        setBalance(balanceValue);
        setTotalSupply(totalSupplyValue);

        // Calculate receive amounts using actual reserves
        if (balanceValue > 0 && totalSupplyValue > 0) {
          try {
            // Get reserves from the pair contract
            const reserves = await getReserves(pairAddress);

            // Get token addresses to determine order
            const uniswapV2PairAbi = [
              {
                inputs: [],
                name: "token0",
                outputs: [{ type: "address" }],
                stateMutability: "view",
                type: "function"
              },
              {
                inputs: [],
                name: "token1",
                outputs: [{ type: "address" }],
                stateMutability: "view",
                type: "function"
              }
            ];

            const token0Address = await readContract(config, {
              address: pairAddress,
              abi: uniswapV2PairAbi,
              functionName: 'token0',
            }) as Address;

            const token1Address = await readContract(config, {
              address: pairAddress,
              abi: uniswapV2PairAbi,
              functionName: 'token1',
            }) as Address;

            // Calculate user's share of the pool
            const userShareRatio = balanceValue / totalSupplyValue;

            // Calculate amounts user will receive
            const reserve0Value = Number(formatEther(reserves.reserve0));
            const reserve1Value = Number(formatEther(reserves.reserve1));

            const receiveAmount0 = reserve0Value * userShareRatio;
            const receiveAmount1 = reserve1Value * userShareRatio;

            // Determine if baseToken is token0 or token1
            const isBaseToken0 = baseToken?.address?.toLowerCase() === token0Address.toLowerCase();

            if (isBaseToken0) {
              setReceiveBaseAmount(receiveAmount0);
              setReceiveQuoteAmount(receiveAmount1);
              setReceiveOutOrder(false);
            } else {
              setReceiveBaseAmount(receiveAmount1);
              setReceiveQuoteAmount(receiveAmount0);
              setReceiveOutOrder(true);
            }
          } catch (error) {
            console.error('Error calculating receive amounts:', error);
            // Fallback to placeholder logic
            setReceiveBaseAmount(balanceValue * 0.5);
            setReceiveQuoteAmount(balanceValue * 0.5);
            setReceiveOutOrder(false);
          }
        }
      } catch (error) {
        console.error('Error fetching LP status:', error);
        setBalance(0);
        setTotalSupply(0);
        setReceiveBaseAmount(0);
        setReceiveQuoteAmount(0);
        setReceiveOutOrder(false);
      }
    };

    fetchLPStatus();
  }, [pairAddress, address, baseToken]);

  return {
    balance,
    totalSupply,
    receiveBaseAmount,
    receiveQuoteAmount,
    receiveOutOrder
  };
}
