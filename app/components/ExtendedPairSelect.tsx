'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Address } from 'viem';
import { FEATURED_PAIRS, type FeaturedKey } from '@/data/pairs';
import { readPairTokens } from '@/lib/pairs';
import { useSwapState } from '@/lib/state';
import { useFavoritesStore } from '@/lib/favorites';
import { Star } from 'lucide-react';

function toKey(k?: string | null): FeaturedKey | undefined {
  const keys = FEATURED_PAIRS.map(p => p.key);
  return (k && keys.includes(k as any)) ? (k as FeaturedKey) : undefined;
}

type MarketData = {
  pair: string;
  lastPrice: number;
  change24h: number;
  volume24h: number;
  liquidity: number;
};

// Icon mapping for tokens
const TOKEN_ICONS: Record<string, string> = {
  'PLSX': '/icons/plsx.avif',
  'WPLS': '/icons/WPLS.avif',
  'WETH': '/icons/eth.avif',
  'HEX': '/icons/hex.avif',
  'DAI': '/icons/dai.avif',
  'PDAI': '/icons/dai.avif',
  'USDC': '/icons/usdc.avif',
  'PWBTC': '/icons/pwbtc.avif'
};

// Mock market data for all pairs
const MARKET_DATA: Record<string, MarketData> = {
  'plsx-wpls': {
    pair: 'PLSX/WPLS',
    lastPrice: 0.00095,
    change24h: 2.45,
    volume24h: 1250000,
    liquidity: 2500000
  },
  'weth-wpls': {
    pair: 'WETH/WPLS',
    lastPrice: 95.2,
    change24h: -1.23,
    volume24h: 850000,
    liquidity: 1800000
  },
  'hex-wpls': {
    pair: 'HEX/WPLS',
    lastPrice: 0.0508,
    change24h: 5.67,
    volume24h: 2100000,
    liquidity: 3200000
  },
  'pdai-wpls': {
    pair: 'pDAI/WPLS',
    lastPrice: 0.000023,
    change24h: 0.15,
    volume24h: 1800000,
    liquidity: 4200000
  },
  'pwbtc-wpls': {
    pair: 'pWBTC/WPLS',
    lastPrice: 42500.0,
    change24h: 1.85,
    volume24h: 3200000,
    liquidity: 8500000
  }
};

export default function ExtendedPairSelect() {
  const router = useRouter();
  const sp = useSearchParams();
  const { setPair } = useSwapState();
  const { favoritePairs, toggleFavorite } = useFavoritesStore();

  const [pending, setPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { selectedKey } = useSwapState();
  
  // Use selectedKey from global state as primary source, fallback to URL
  const currentSelectedKey = selectedKey || toKey(sp.get('pair'));

  useEffect(() => {
    (async () => {
      const key = toKey(sp.get('pair')) ?? 'plsx-wpls';
      const preset = FEATURED_PAIRS.find(p => p.key === key)!;
      setPending(true);
      try {
        const { token0, token1 } = await readPairTokens(preset.pool as Address);
        
        // Update global state first
        setPair(preset.key, preset.pool as Address, token0, token1);
        
        // Update URL to keep it in sync
        const q = new URLSearchParams(Array.from(sp.entries()));
        q.set('pair', preset.key);
        q.set('in', token0);
        q.set('out', token1);
        router.replace(`/?${q.toString()}`);
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
      
      // Update global state first - this will trigger re-renders of ChartWidget and TradePanel
      setPair(preset.key, preset.pool as Address, token0, token1);
      
      // Then update URL to keep it in sync
      const q = new URLSearchParams(Array.from(sp.entries()));
      q.set('pair', preset.key);
      q.set('in', token0);
      q.set('out', token1);
      router.replace(`/?${q.toString()}`);
    } finally {
      setPending(false);
    }
    setIsOpen(false);
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return price.toFixed(6);
    } else if (price < 1) {
      return price.toFixed(4);
    } else {
      return price.toFixed(2);
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const getPairIcons = (pairKey: string) => {
    const [token1, token2] = pairKey.split('-');
    const icon1 = TOKEN_ICONS[token1.toUpperCase()];
    const icon2 = TOKEN_ICONS[token2.toUpperCase()];
    
    return (
      <div className="flex items-center gap-0">
        <img 
          src={icon1} 
          alt={token1.toUpperCase()} 
          className="w-5 h-5"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <img 
          src={icon2} 
          alt={token2.toUpperCase()} 
          className="w-5 h-5"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    );
  };

  const selectedData = MARKET_DATA[currentSelectedKey || 'plsx-wpls'];

  return (
    <div className="relative">
      {/* Selected pair display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-transparent text-sm font-medium text-neutral-100 hover:text-emerald-300 transition-colors"
        disabled={pending}
      >
        {getPairIcons(currentSelectedKey || 'plsx-wpls')}
        <span>{selectedData.pair}</span>
        <svg 
          className={`w-3 h-3 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {pending && <span className="text-xs text-neutral-500">Ładowanie…</span>}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[75vw] max-w-4xl bg-black/75 backdrop-blur-xl border border-white/5 rounded-lg shadow-2xl z-50">
          <div className="p-4">
            {/* Header */}
            <div className="grid grid-cols-6 pb-3 border-b border-white/5 text-xs font-medium text-neutral-400" style={{gridTemplateColumns: '24px 1fr 1fr 1fr 1fr 1fr'}}>
              <div></div>
              <div>Pair</div>
              <div className="text-right">Last Price</div>
              <div className="text-right">24h Change</div>
              <div className="text-right">Volume 24h</div>
              <div className="text-right">Liquidity</div>
            </div>

            {/* Data rows */}
            <div className="max-h-80 overflow-y-auto">
              {FEATURED_PAIRS.map((pair) => {
                const data = MARKET_DATA[pair.key];
                const isSelected = pair.key === currentSelectedKey;
                const changeColor = data.change24h >= 0 ? 'text-emerald-400' : 'text-red-400';

                return (
                   <button
                     key={pair.key}
                     onClick={() => onChange(pair.key)}
                     className={`w-full grid py-3 px-2 text-left hover:bg-white/5 transition-colors ${
                       isSelected ? 'bg-emerald-500/10' : ''
                     }`}
                     style={{gridTemplateColumns: '24px 1fr 1fr 1fr 1fr 1fr'}}
                   >
                     <div className="flex items-center justify-center">
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           toggleFavorite(pair.key);
                         }}
                         className="p-1 hover:bg-white/10 rounded transition-colors"
                       >
                         <Star 
                           size={14} 
                           className={favoritePairs.includes(pair.key) ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-400'} 
                         />
                       </button>
                     </div>
                     <div className="flex items-center gap-2 text-sm font-medium text-neutral-100">
                       {getPairIcons(pair.key)}
                       <span>{data.pair}</span>
                     </div>
                    <div className="text-sm text-neutral-300 text-right">
                      ${formatPrice(data.lastPrice)}
                    </div>
                    <div className={`text-sm text-right ${changeColor}`}>
                      {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
                    </div>
                    <div className="text-sm text-neutral-300 text-right">
                      ${formatVolume(data.volume24h)}
                    </div>
                    <div className="text-sm text-neutral-300 text-right">
                      ${formatVolume(data.liquidity)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
