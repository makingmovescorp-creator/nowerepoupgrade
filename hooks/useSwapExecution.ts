'use client';
import { useState, useCallback } from 'react';
import type { Address } from 'viem';
import { parseUnits, formatUnits } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import wrapperAbi from '@/abis/PulseXFeeWrapper.json';

export function useSwapExecution() {
  const { writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt();
  const [isExecuting, setIsExecuting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const executeSwap = useCallback(async (
    wrapperAddress: Address,
    tokenIn: Address,
    tokenOut: Address,
    amountIn: string,
    amountOutMin: string,
    path: Address[],
    deadline: bigint,
    isNativeIn: boolean,
    isNativeOut: boolean
  ) => {
    if (!wrapperAddress || !tokenIn || !tokenOut || !amountIn || !amountOutMin || !path.length) {
      throw new Error('Missing required parameters for swap');
    }

    setIsExecuting(true);
    setTxHash(null);

    try {
      let hash: string;

      if (isNativeIn && isNativeOut) {
        // Native PLS -> Native PLS (through WPLS)
        hash = await writeContractAsync({
          address: wrapperAddress,
          abi: wrapperAbi.abi as any,
          functionName: 'swapExactETHForTokens',
          args: [BigInt(amountOutMin), path, tokenOut, deadline],
          value: BigInt(amountIn),
        });
      } else if (isNativeIn) {
        // Native PLS -> Token
        hash = await writeContractAsync({
          address: wrapperAddress,
          abi: wrapperAbi.abi as any,
          functionName: 'swapExactETHForTokens',
          args: [BigInt(amountOutMin), path, tokenOut, deadline],
          value: BigInt(amountIn),
        });
      } else if (isNativeOut) {
        // Token -> Native PLS
        hash = await writeContractAsync({
          address: wrapperAddress,
          abi: wrapperAbi.abi as any,
          functionName: 'swapExactTokensForETH',
          args: [BigInt(amountIn), BigInt(amountOutMin), path, tokenOut, deadline],
        });
      } else {
        // Token -> Token
        hash = await writeContractAsync({
          address: wrapperAddress,
          abi: wrapperAbi.abi as any,
          functionName: 'swapExactTokensForTokens',
          args: [BigInt(amountIn), BigInt(amountOutMin), path, tokenOut, deadline],
        });
      }

      setTxHash(hash);
      return hash;
    } catch (error) {
      console.error('Swap execution failed:', error);
      throw error;
    } finally {
      setIsExecuting(false);
    }
  }, [writeContractAsync]);

  return {
    executeSwap,
    isExecuting,
    isConfirming,
    isConfirmed,
    txHash,
  };
}
