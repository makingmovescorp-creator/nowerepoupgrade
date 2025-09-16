import { Suspense } from 'react';
import ChartWidget from '@/app/components/ChartWidget';
import TradePanel from '@/app/components/TradePanel';
import PortfolioWidget from '@/app/components/PortfolioWidget';
import PairSelectWidget from '@/app/components/PairSelectWidget';
import FavoritePairsBar from '@/app/components/FavoritePairsBar';
import ConnectWallet from '@/app/components/ConnectWallet';
import BridgeButton from '@/app/components/BridgeButton';
import ShaderBackground from '@/app/components/ShaderBackground';
import { Card } from '@/components/ui/card';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  return (
    <main className="min-h-screen text-neutral-100 relative">
      <ShaderBackground />
      {/* Top bar (Hyperliquid-like) */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="mx-auto max-w-[1600px] px-4 py-3 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <img
                     src="/img/pulsexpro-white.avif"
                     alt="PulseX Pro"
                     className="h-8 w-auto"
                   />
                   <nav className="hidden md:flex items-center gap-3 text-sm text-neutral-400">
              <span className="px-2 py-1 rounded-md bg-white/10 text-neutral-100">Trade</span>
              <span className="px-2 py-1 rounded-md hover:bg-white/5 cursor-default">Points</span>
              <span className="px-2 py-1 rounded-md hover:bg-white/5 cursor-default">Explorer</span>
              <span className="px-2 py-1 rounded-md hover:bg-white/5 cursor-default">Farms</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-1 hover:bg-white/5 rounded-md p-1 transition">
                <img
                  src="/icons/WPLS.avif"
                  alt="PulseChain"
                  className="h-4 w-4"
                />
                <svg className="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              <div className="absolute top-full left-0 mt-1 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-12">
                <div className="py-1">
                  <button className="w-full flex items-center justify-center p-2 text-sm text-neutral-300 hover:bg-white/10 transition rounded">
                    <img
                      src="/icons/WPLS.avif"
                      alt="PulseChain"
                      className="h-4 w-4"
                    />
                  </button>
                  <button className="w-full flex items-center justify-center p-2 text-sm text-neutral-300 hover:bg-white/10 transition rounded cursor-not-allowed" disabled>
                    <img
                      src="/icons/eth.avif"
                      alt="Ethereum"
                      className="h-4 w-4 opacity-50"
                    />
                  </button>
                </div>
              </div>
            </div>
            <BridgeButton />
            <ConnectWallet />
          </div>
        </div>
      </header>

      {/* Main content grid */}
      <div className="mx-auto max-w-[1600px] px-1 py-1 grid grid-cols-12 gap-1 h-[calc(100vh-80px)]">
        <section className="col-span-12 lg:col-span-9 flex flex-col gap-1">
          {/* Favorite pairs bar */}
          <FavoritePairsBar />

          {/* Pair select widget */}
          <PairSelectWidget />

          {/* Chart section - większa część */}
          <Card className="flex-[3]">
            <ChartWidget />
          </Card>

          {/* Portfolio section - mniejsza część */}
          <div className="flex-[1]">
            <PortfolioWidget />
          </div>
        </section>
        <aside className="col-span-12 lg:col-span-3 flex flex-col">
          <TradePanel />
        </aside>
      </div>
    </main>
  );
}