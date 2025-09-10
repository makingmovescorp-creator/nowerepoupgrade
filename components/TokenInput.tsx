'use client';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { formatUnits } from 'viem';
import { useBalanceOf, useTokenInfo } from '@/hooks/useTokenInfo';

type Props = {
  label: string;
  token: Address | undefined;
  setToken: (v: Address) => void;
  amount: string;
  setAmount: (v: string) => void;
  owner?: Address;
  spender?: Address;
  showAllowance?: boolean;
  allowance?: bigint;
};

export default function TokenInput({
  label, token, setToken, amount, setAmount, owner, showAllowance, allowance
}: Props) {
  const { decimals, symbol } = useTokenInfo(token as Address);
  const balance = useBalanceOf(token as Address, owner as Address);
  const formattedBal = useMemo(() => token && owner ? formatUnits(balance ?? 0n, decimals) : '0', [balance, decimals, token, owner]);

  return (
    <div className="space-y-2">
      <label className="text-sm text-neutral-400">{label}</label>
      <input
        className="w-full bg-neutral-800 rounded-xl p-3 outline-none font-mono"
        placeholder="0x... token address"
        value={token ?? ''}
        onChange={e => setToken(e.target.value as Address)}
      />
      <div className="flex items-center gap-2">
        <input
          className="w-full bg-neutral-800 rounded-xl p-3 outline-none"
          placeholder="0.0"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <div className="px-3 py-2 text-xs bg-neutral-800 rounded-xl">{symbol}</div>
      </div>
      <div className="text-xs text-neutral-400 flex justify-between">
        <span>Balance: {formattedBal}</span>
        {showAllowance && typeof allowance === 'bigint' && (
          <span>Allowance: {formatUnits(allowance, decimals)}</span>
        )}
      </div>
    </div>
  );
}


