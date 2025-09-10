// components/TradePanel.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Address } from 'viem';
import { parseUnits, formatUnits } from 'viem';
import { useAccount } from 'wagmi';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import TokenInput from '@/components/TokenInput';
=======
import TokenSlider from '@/components/TokenSlider';
>>>>>>> Stashed changes
=======
import TokenSlider from '@/components/TokenSlider';
>>>>>>> Stashed changes
=======
import TokenSlider from '@/components/TokenSlider';
>>>>>>> Stashed changes
import { buildPath } from '@/lib/path';
import { getQuote } from '@/lib/quote';
import { useAllowance } from '@/hooks/useTokenInfo';
import { useApprove } from '@/hooks/useApprove';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { useSearchParams } from 'next/navigation';
import { useSwapState } from '@/lib/state';

type HexAddress = `0x${string}`;
const FEE_BPS = 1;
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
import { useSearchParams, useRouter } from 'next/navigation';
import { useSwapState } from '@/lib/state';

type HexAddress = `0x${string}`;
type TabType = 'market' | 'limit' | 'pro';
type SideType = 'buy' | 'sell';

const FEE_BPS = 30; // 0.3% = 30 basis points
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

export default function TradePanel() {
  const { address } = useAccount();
  const sp = useSearchParams();
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const { token0, token1 } = useSwapState();
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  const router = useRouter();
  const { token0, token1 } = useSwapState();
  
  const [activeTab, setActiveTab] = useState<TabType>('market');
  const [side, setSide] = useState<SideType>('buy');
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

  const ROUTER = process.env.NEXT_PUBLIC_PULSEX_ROUTER as HexAddress | undefined;
  const WPLS   = process.env.NEXT_PUBLIC_WPLS as HexAddress | undefined;
  const WRAPPER= process.env.NEXT_PUBLIC_WRAPPER_ADDRESS as HexAddress | undefined;

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const [tokenIn, setTokenIn]   = useState<HexAddress>('0x0000000000000000000000000000000000000000');
  const [tokenOut, setTokenOut] = useState<HexAddress>('0x0000000000000000000000000000000000000000');
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  const [amountIn, setAmountIn] = useState<string>('');
  const [slippage, setSlippage] = useState<string>('0.5');

  // TODO: dynamic decimals from ERC20 (PR#5)
  const decimalsIn = 18;
  const decimalsOut = 18;

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  useEffect(() => {
    const urlIn  = sp.get('in') as HexAddress | null;
    const urlOut = sp.get('out') as HexAddress | null;
    if (urlIn && urlOut) {
      setTokenIn(urlIn);
      setTokenOut(urlOut);
      return;
    }
    if (token0 && token1) {
      setTokenIn(token0 as HexAddress);
      setTokenOut(token1 as HexAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token0, token1]);
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  // Determine tokenIn and tokenOut based on side
  // For pair WETH/WPLS:
  // Buy = WPLS → WETH (token1 → token0)
  // Sell = WETH → WPLS (token0 → token1)
  const tokenIn = useMemo(() => {
    if (!token0 || !token1) return '0x0000000000000000000000000000000000000000' as HexAddress;
    return side === 'buy' ? (token1 as HexAddress) : (token0 as HexAddress);
  }, [token0, token1, side]);

  const tokenOut = useMemo(() => {
    if (!token0 || !token1) return '0x0000000000000000000000000000000000000000' as HexAddress;
    return side === 'buy' ? (token0 as HexAddress) : (token1 as HexAddress);
  }, [token0, token1, side]);

  // Update URL when side changes
  useEffect(() => {
    if (token0 && token1) {
      const q = new URLSearchParams(Array.from(sp.entries()));
      q.set('in', tokenIn);
      q.set('out', tokenOut);
      router.replace(`/?${q.toString()}`);
    }
  }, [tokenIn, tokenOut, token0, token1, sp, router]);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

  const amountParsed = useMemo(() => {
    try { return amountIn ? parseUnits(amountIn, decimalsIn) : 0n; }
    catch { return 0n; }
  }, [amountIn]);

  const fee = useMemo(() => (amountParsed * BigInt(FEE_BPS)) / 10_000n, [amountParsed]);
  const net = useMemo(() => (amountParsed > fee ? amountParsed - fee : 0n), [amountParsed, fee]);

  const path = useMemo<Address[]>(() => {
    if (!tokenIn || !tokenOut || !WPLS) return [];
    return buildPath(tokenIn as Address, tokenOut as Address, WPLS as Address);
  }, [tokenIn, tokenOut, WPLS]);

  const [quoteOut, setQuoteOut] = useState<bigint>(0n);
  const [outMin, setOutMin] = useState<bigint>(0n);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!ROUTER || !WPLS || net === 0n || path.length < 2) {
        if (!cancelled) { setQuoteOut(0n); setOutMin(0n); }
        return;
      }
      try {
        const q = await getQuote(net, path, ROUTER as Address);
        if (cancelled) return;
        setQuoteOut(q);

        const slipPct = Number(slippage || '0');
        const outMinLocal = slipPct > 0
          ? q - (q * BigInt(Math.floor(slipPct * 100)) / 10_000n)
          : q;
        setOutMin(outMinLocal);
      } catch {
        if (!cancelled) { setQuoteOut(0n); setOutMin(0n); }
      }
    })();
    return () => { cancelled = true; };
  }, [ROUTER, WPLS, net, path, slippage]);

  // ALLOWANCE (dla approval -> WRAPPER), włączone dopiero gdy mamy WRAPPER
  const allowance = useAllowance(
    (tokenIn as Address),
    (address as Address | undefined),
    (WRAPPER as Address | undefined)
  );

  const needApproval = useMemo(() => {
    if (!WRAPPER || !address) return false;
    if (!amountParsed) return false;
    return allowance < amountParsed;
  }, [allowance, amountParsed, WRAPPER, address]);

  const { approve, pending } = useApprove();

  const onApprove = async () => {
    if (!WRAPPER || !tokenIn || !amountParsed) return;
    await approve(tokenIn as Address, WRAPPER as Address, amountParsed);
  };

  // Avoid SSR/CSR hydration mismatch: compute time-based values after mount
  const [deadline, setDeadline] = useState<string>('');
  useEffect(() => {
    setDeadline(String(BigInt(Math.floor(Date.now()/1000) + 60*10)));
  }, []);
  const canSwap = Boolean(WRAPPER && address && !needApproval && amountParsed > 0n && path.length >= 2);

  return (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    <div className="bg-[#131a1f] rounded-2xl p-4 space-y-4">
      <div className="text-xl font-semibold">Swap</div>

      <TokenInput
        label="Z tokenu"
        token={tokenIn}
        setToken={(v)=>setTokenIn(v as HexAddress)}
        amount={amountIn}
        setAmount={setAmountIn}
        owner={address as Address}
        spender={WRAPPER as Address}
        showAllowance={Boolean(WRAPPER)}
        allowance={allowance}
      />

      <TokenInput
        label="Na token"
        token={tokenOut}
        setToken={(v)=>setTokenOut(v as HexAddress)}
        amount={formatUnits(quoteOut, decimalsOut)}
        setAmount={() => {}}
      />

      <div className="space-y-2">
        <label className="text-sm text-neutral-400">Slippage (%)</label>
        <input
          className="w-full bg-neutral-800 rounded-xl p-3 outline-none"
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-lg p-4 space-y-4">
      {/* Header with tabs */}
      <div className="flex items-center justify-center">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('market')}
            className={`px-3 py-1 text-xs rounded-md transition ${
              activeTab === 'market'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setActiveTab('limit')}
            className={`px-3 py-1 text-xs rounded-md transition ${
              activeTab === 'limit'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
            disabled
          >
            Limit (soon)
          </button>
          <button
            onClick={() => setActiveTab('pro')}
            className={`px-3 py-1 text-xs rounded-md transition ${
              activeTab === 'pro'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
            disabled
          >
            Pro (soon)
          </button>
        </div>
      </div>

      {/* Buy/Sell buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
            side === 'buy'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-white/5 text-neutral-400 hover:bg-white/10'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
            side === 'sell'
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-white/5 text-neutral-400 hover:bg-white/10'
          }`}
        >
          Sell
        </button>
      </div>

      {/* Token inputs */}
      <div className="space-y-3">
        <TokenSlider
          label="Pay with"
          token={tokenIn}
          token0={token0}
          token1={token1}
          amount={amountIn}
          setAmount={setAmountIn}
          owner={address as Address}
          spender={WRAPPER as Address}
          showAllowance={Boolean(WRAPPER)}
          allowance={allowance}
          side={side}
        />


        <div className="bg-white/5 rounded-lg p-3 text-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400">{side === 'buy' ? 'Receive' : 'Pay with'}</span>
            <span className="text-neutral-300">{formatUnits(quoteOut, decimalsOut)}</span>
          </div>
          <div className="text-xs text-neutral-500">
            {side === 'buy' ? 'Estimated amount you will receive' : 'Amount to pay'}
          </div>
        </div>
      </div>

      {/* Slippage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-neutral-400">Slippage</label>
          <span className="text-xs text-neutral-500">{slippage}%</span>
        </div>
        <input
          className="w-full bg-white/5 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500/50"
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
          placeholder="0.5"
          value={slippage}
          onChange={e => setSlippage(e.target.value)}
        />
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        <div className="bg-neutral-800 rounded-xl p-3 text-sm space-y-1">
          <div className="flex justify-between"><span>Opłata (0.01%)</span><span>{formatUnits(fee, decimalsIn)}</span></div>
          <div className="flex justify-between"><span>Wejście netto</span><span>{formatUnits(net, decimalsIn)}</span></div>
          <div className="flex justify-between"><span>Quote (out)</span><span>{formatUnits(quoteOut, decimalsOut)}</span></div>
          <div className="flex justify-between"><span>Min. out</span><span>{formatUnits(outMin, decimalsOut)}</span></div>
          <div className="flex justify-between"><span>Path</span><span className="truncate max-w-[50%] text-right">{path.join(' → ')}</span></div>
          <div className="flex justify-between"><span>Deadline</span><span suppressHydrationWarning>{deadline || '—'}</span></div>
        </div>
      </div>

=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      </div>

      {/* Summary */}
      <div className="bg-white/5 rounded-lg p-3 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="group relative border-b border-dashed border-neutral-400">
            Fees (0.3%)
            <div className="absolute bottom-full left-0 mb-2 px-2 py-1 text-xs bg-black/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              PulseX V1/V2 (0.29%) + Taker fee (0.01%)
            </div>
          </span>
          <span>{formatUnits(fee, decimalsIn)}</span>
        </div>
        <div className="flex justify-between"><span>Net in</span><span>{formatUnits(net, decimalsIn)}</span></div>
        <div className="flex justify-between"><span>Min out</span><span>{formatUnits(outMin, decimalsOut)}</span></div>
        <div className="flex justify-between"><span>Deadline</span><span suppressHydrationWarning>{deadline || '—'}</span></div>
      </div>

      {/* Action buttons */}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      {WRAPPER ? (
        <button
          onClick={onApprove}
          disabled={!needApproval || pending}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          className={`w-full rounded-2xl py-3 transition ${needApproval ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-white/5 cursor-not-allowed'}`}
        >
          {pending ? 'Potwierdź w portfelu…' : (needApproval ? 'Approve (dla wrappera)' : 'Approve niepotrzebny')}
        </button>
      ) : (
        <div className="text-xs text-neutral-400">
          Brak <code>NEXT_PUBLIC_WRAPPER_ADDRESS</code> – approve i swap wyłączone (tryb podglądu).
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
          className={`w-full rounded-lg py-3 text-sm font-medium transition ${
            needApproval 
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
              : 'bg-white/5 cursor-not-allowed text-neutral-400'
          }`}
        >
          {pending ? 'Confirm in wallet…' : (needApproval ? 'Approve' : 'Approved')}
        </button>
      ) : (
        <div className="text-xs text-neutral-400 text-center">
          No wrapper address – preview mode only
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        </div>
      )}

      <button
        disabled={!canSwap}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        className={`w-full rounded-2xl py-3 transition ${canSwap ? 'bg-white/10 hover:bg-white/20 text-emerald-300' : 'bg-white/5 cursor-not-allowed'}`}
      >
        {canSwap ? 'Swap' : 'Swap (zablokowany)'}
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        className={`w-full rounded-lg py-3 text-sm font-medium transition ${
          canSwap 
            ? side === 'buy' 
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-red-600 hover:bg-red-500 text-white'
            : 'bg-white/5 cursor-not-allowed text-neutral-400'
        }`}
      >
        {canSwap ? (side === 'buy' ? 'Buy' : 'Sell') : 'Connect wallet'}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      </button>
    </div>
  );
}