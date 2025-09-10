'use client';
import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { readDecimals, readSymbol, readName, readBalance, readAllowance } from '@/lib/erc20';

export function useTokenInfo(token?: Address) {
  const [decimals, setDecimals] = useState<number>(18);
  const [symbol, setSymbol] = useState<string>('TKN');
  const [name, setName] = useState<string>('Token');

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!token) return;
      try {
        const [d, s, n] = await Promise.all([readDecimals(token), readSymbol(token), readName(token)]);
        if (!alive) return;
        setDecimals(d); setSymbol(s); setName(n);
      } catch {}
    })();
    return () => { alive = false; };
  }, [token]);

  return { decimals, symbol, name };
}

export function useAllowance(token?: Address, owner?: Address, spender?: Address) {
  const [allowance, setAllowance] = useState<bigint>(0n);
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!token || !owner || !spender) { setAllowance(0n); return; }
      try {
        const a = await readAllowance(token, owner, spender);
        if (alive) setAllowance(a);
      } catch { if (alive) setAllowance(0n); }
    })();
    return () => { alive = false; };
  }, [token, owner, spender]);
  return allowance;
}

export function useBalanceOf(token?: Address, owner?: Address) {
  const [balance, setBalance] = useState<bigint>(0n);
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!token || !owner) { setBalance(0n); return; }
      try {
        const b = await readBalance(token, owner);
        if (alive) setBalance(b);
      } catch { if (alive) setBalance(0n); }
    })();
    return () => { alive = false; };
  }, [token, owner]);
  return balance;
}


