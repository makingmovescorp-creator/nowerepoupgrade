'use client';
import { useState, useEffect } from 'react';
import { FEATURED_PAIRS, type FeaturedKey } from '@/data/pairs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSwapState } from '@/lib/state';
import { useFavoritesStore } from '@/lib/favorites';
import { useFeaturedPairs } from '@/hooks/useFeaturedPairsData';
import { fmtUsd, fmtPct } from '@/lib/format';

// Icon mapping for tokens
const TOKEN_ICONS: Record<string, string> = {
  'PLSX': '/icons/plsx.avif',
  'WPLS': '/icons/WPLS.avif',
  'WETH': '/icons/eth.avif',
  'HEX': '/icons/hex.avif',
  'DAI': '/icons/dai.avif',
  'PDAI': '/icons/dai.avif',
  'USDC': '/icons/usdc.avif',
  'PWBTC': '/icons/pwbtc.avif',
  'INC': '/icons/inc.avif'
};


function getPairIcons(pairKey: string) {
  const [token1, token2] = pairKey.split('-');
  const icon1 = TOKEN_ICONS[token1.toUpperCase()];
  const icon2 = TOKEN_ICONS[token2.toUpperCase()];
  
  return (
    <div className="flex items-center gap-0">
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
  const { data: pairsData, loading } = useFeaturedPairs();

  // Track if we've had initial data load to avoid showing loading on refreshes
  const [hasInitialData, setHasInitialData] = useState(false);

  useEffect(() => {
    if (!loading && pairsData && Object.keys(pairsData).length > 0) {
      setHasInitialData(true);
    }
  }, [loading, pairsData]);

  // Force re-render when favoritePairs changes
  useEffect(() => {
    console.log('FavoritePairsBar favoritePairs changed:', favoritePairs);
    // This effect ensures component re-renders when favoritePairs changes
  }, [favoritePairs]);

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


  // Create infinite loop for more than 4 pairs - use multiple repetitions for smooth continuous flow
  const shouldAnimate = favoritePairs.length > 4;
  const displayPairs = shouldAnimate ? [
    ...favoritePairs,
    ...favoritePairs,
    ...favoritePairs,
    ...favoritePairs
  ] : favoritePairs;

  return (
    <div className="w-full max-w-full px-1 overflow-hidden">
      <div className={`flex items-center gap-3 py-2 ${shouldAnimate ? 'animate-scroll' : ''}`}>
        {displayPairs.map((pairKey, index) => {
          const preset = FEATURED_PAIRS.find(p => p.key === pairKey);
          const pairData = pairsData[pairKey];
          if (!preset) return null;

          const change24h = pairData?.priceChange?.h24 ?? undefined;

          return (
            <button
              key={`${pairKey}-${index}`}
              onClick={() => handlePairClick(pairKey)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors duration-150 flex-shrink-0"
            >
              {getPairIcons(pairKey)}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white">{preset.label}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-300">
                    {!hasInitialData && loading ? '...' : fmtUsd(pairData?.priceUsd)}
                  </span>
                  <span className={`text-xs change-value ${change24h == null ? 'change-null' : change24h > 0 ? 'change-positive' : change24h < 0 ? 'change-negative' : 'change-zero'}`}>
                    {!hasInitialData && loading ? '...' : fmtPct(change24h)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
