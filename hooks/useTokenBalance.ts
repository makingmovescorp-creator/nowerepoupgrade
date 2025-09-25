'use client';
import { useAccount, useBalance } from 'wagmi';
import type { Address } from 'viem';

export function useTokenBalance(token: any, isSwapping: boolean) {
  const { address } = useAccount();

  const native = useBalance({
    address: address as Address | undefined,
    query: {
      enabled: Boolean(address) && Boolean(token?.isNative),
      refetchInterval: 8000,
    },
  });

  const erc20 = useBalance({
    address: address as Address | undefined,
    token: token && !token?.isNative ? (token.address as Address | undefined) : undefined,
    query: {
      enabled: Boolean(address) && Boolean(token && !token?.isNative && token?.address),
      refetchInterval: 8000,
    },
  });

  const data = token?.isNative ? native.data : erc20.data;
  const formatted = data?.formatted ? parseFloat(data.formatted) : 0;

  void isSwapping;

  return formatted;
}
