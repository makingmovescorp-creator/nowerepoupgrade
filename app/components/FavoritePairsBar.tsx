'use client';
import { useState, useEffect } from 'react';
import { FEATURED_PAIRS, type FeaturedKey } from '@/data/pairs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSwapState } from '@/lib/state';
import { useFavoritesStore } from '@/lib/favorites';

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
const MARKET_DATA: Record<string, { lastPrice: number; change24h: number }> = {
  'plsx-wpls': { lastPrice: 0.00095, change24h: 2.45 },
  'weth-wpls': { lastPrice: 95.2, change24h: -1.23 },
  'hex-wpls': { lastPrice: 0.0508, change24h: 5.67 },
  'pdai-wpls': { lastPrice: 0.000023, change24h: 0.15 },
  'pwbtc-wpls': { lastPrice: 42500.0, change24h: 1.85 }
};

function getPairIcons(pairKey: string) {
  const [token1, token2] = pairKey.split('-');
  const icon1 = TOKEN_ICONS[token1.toUpperCase()];
  const icon2 = TOKEN_ICONS[token2.toUpperCase()];
  
  return (
    <div className="flex items-center gap-1">
      <img 
        src={icon1} 
        alt={token1.toUpperCase()} 
        className="w-4 h-4"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <img 
        src={icon2} 
        alt={token2.toUpperCase()} 
        className="w-4 h-4"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}

export default function FavoritePairsBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const { setPair } = useSwapState();
  const { favoritePairs } = useFavoritesStore();

  const handlePairClick = async (pairKey: FeaturedKey) => {
    const preset = FEATURED_PAIRS.find(p => p.key === pairKey);
    if (!preset) return;

    try {
      const { token0, token1 } = await import('@/lib/pairs').then(m => 
        m.readPairTokens(preset.pool as any)
      );
      setPair(preset.key, preset.pool as any, token0, token1);
      
      // Update URL
      const params = new URLSearchParams(sp.toString());
      params.set('pair', preset.key);
      router.push(`?${params.toString()}`);
    } catch (error) {
      console.error('Failed to load pair:', error);
    }
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  const formatChange = (change: number) => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  return (
    <div className="w-full max-w-full px-1">
      <div className="flex items-center gap-3 overflow-x-auto py-2">
        {favoritePairs.map((pairKey) => {
          const preset = FEATURED_PAIRS.find(p => p.key === pairKey);
          const data = MARKET_DATA[pairKey];
          if (!preset || !data) return null;

          const changeColor = data.change24h >= 0 ? 'text-emerald-400' : 'text-red-400';

          return (
            <button
              key={pairKey}
              onClick={() => handlePairClick(pairKey)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors duration-150 flex-shrink-0"
            >
              {getPairIcons(pairKey)}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white">{preset.label}</span>
                <span className={`text-xs ${changeColor}`}>{formatChange(data.change24h)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
