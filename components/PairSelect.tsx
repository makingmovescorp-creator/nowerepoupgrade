'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Address } from 'viem';
import { FEATURED_PAIRS, type FeaturedKey } from '@/data/pairs';
import { readPairTokens } from '@/lib/pairs';
import { useSwapState } from '@/lib/state';

function toKey(k?: string | null): FeaturedKey | undefined {
  const keys = FEATURED_PAIRS.map(p => p.key);
  return (k && keys.includes(k as any)) ? (k as FeaturedKey) : undefined;
}

export default function PairSelect() {
  const router = useRouter();
  const sp = useSearchParams();
  const { setPair } = useSwapState();

  const [pending, setPending] = useState(false);

  const selectedKey = useMemo<FeaturedKey | undefined>(() => {
    return toKey(sp.get('pair'));
  }, [sp]);

  useEffect(() => {
    (async () => {
      const key = toKey(sp.get('pair')) ?? 'plsx-wpls';
      const preset = FEATURED_PAIRS.find(p => p.key === key)!;
      setPending(true);
      try {
        const { token0, token1 } = await readPairTokens(preset.pool as Address);
        setPair(preset.key, preset.pool as Address, token0, token1);
      } finally {
        setPending(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = async (key: FeaturedKey) => {
    const preset = FEATURED_PAIRS.find(p => p.key === key)!;
    setPending(true);
    try {
      const { token0, token1 } = await readPairTokens(preset.pool as Address);
      setPair(preset.key, preset.pool as Address, token0, token1);
      const q = new URLSearchParams(Array.from(sp.entries()));
      q.set('pair', preset.key);
      q.set('in', token0);
      q.set('out', token1);
      router.replace(`/?${q.toString()}`);
    } finally {
      setPending(false);
    }
  };

  return (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    <div className="flex items-center gap-3 p-3">
      <label className="text-sm text-neutral-400">Para:</label>
      <select
        className="bg-neutral-800 rounded-xl px-3 py-2 outline-none"
        value={selectedKey ?? 'plsx-wpls'}
        onChange={(e) => onChange(e.target.value as FeaturedKey)}
        disabled={pending}
      >
        {FEATURED_PAIRS.map(p => (
          <option key={p.key} value={p.key}>{p.label}</option>
        ))}
      </select>
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          className="appearance-none bg-transparent text-sm font-medium text-neutral-100 pr-6 pl-2 py-1 outline-none cursor-pointer hover:text-emerald-300 transition-colors"
          value={selectedKey ?? 'plsx-wpls'}
          onChange={(e) => onChange(e.target.value as FeaturedKey)}
          disabled={pending}
        >
          {FEATURED_PAIRS.map(p => (
            <option key={p.key} value={p.key} className="bg-[#0f1923] text-neutral-100">
              {p.label}
            </option>
          ))}
        </select>
        {/* Custom arrow */}
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg 
            className="w-3 h-3 text-neutral-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      {pending && <span className="text-xs text-neutral-500">Ładowanie…</span>}
    </div>
  );
}


