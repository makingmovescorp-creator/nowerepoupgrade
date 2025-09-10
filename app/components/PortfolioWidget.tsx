'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function PortfolioWidget() {
  const [activeTab, setActiveTab] = useState<'swaps' | 'liquidity'>('swaps');
  const { swaps, liquidityPools, loading, error, isConnected } = usePortfolioData();

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (!isConnected) {
    return (
      <div className="h-full bg-black/40 backdrop-blur-md border border-white/5 rounded-lg">
        <div className="p-4">
          <div className="text-sm font-medium text-neutral-400 mb-4">Portfolio</div>
          <div className="flex items-center justify-center h-full text-neutral-500">
            <div className="text-center">
              <div className="text-sm mb-2">Connect wallet to view portfolio</div>
              <div className="text-xs opacity-60">Recent swaps and liquidity positions</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-black/40 backdrop-blur-md border border-white/5 rounded-lg">
        <div className="p-4">
          <div className="text-sm font-medium text-neutral-400 mb-4">Portfolio</div>
          <div className="flex items-center justify-center h-full text-red-400">
            <div className="text-center">
              <div className="text-sm mb-2">Error loading portfolio</div>
              <div className="text-xs opacity-60">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black/40 backdrop-blur-md border border-white/5 rounded-lg">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-neutral-400">Portfolio</div>
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('swaps')}
              className={`px-2 py-1 text-xs rounded-md transition ${
                activeTab === 'swaps'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Swaps
            </button>
            <button
              onClick={() => setActiveTab('liquidity')}
              className={`px-2 py-1 text-xs rounded-md transition ${
                activeTab === 'liquidity'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Liquidity
            </button>
          </div>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-1"></div>
                <div className="h-3 bg-white/5 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : activeTab === 'swaps' ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {swaps.length === 0 ? (
              <div className="text-center text-neutral-500 text-xs py-4">
                No recent swaps
              </div>
            ) : (
              swaps.map(swap => (
                <div key={swap.id} className="border-b border-white/5 pb-2 last:border-b-0">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-300">{swap.tokenIn}</span>
                      <span className="text-neutral-500">→</span>
                      <span className="text-neutral-300">{swap.tokenOut}</span>
                    </div>
                    <span className="text-neutral-500">{formatTime(swap.timestamp)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-neutral-400">
                      {swap.amountIn} {swap.tokenIn} → {swap.amountOut} {swap.tokenOut}
                    </span>
                    <a
                      href={`https://scan.pulsechain.com/tx/${swap.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {liquidityPools.length === 0 ? (
              <div className="text-center text-neutral-500 text-xs py-4">
                No liquidity positions
              </div>
            ) : (
              liquidityPools.map((pool, index) => (
                <div key={index} className="border-b border-white/5 pb-2 last:border-b-0">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-300">{pool.token0Symbol}</span>
                      <span className="text-neutral-500">/</span>
                      <span className="text-neutral-300">{pool.token1Symbol}</span>
                    </div>
                    <span className="text-emerald-400">{pool.share}</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    Liquidity: {pool.liquidity} {pool.token0Symbol} + {pool.token1Symbol}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
