import ShaderBackground from '@/app/components/ShaderBackground';
import ConnectWallet from '@/app/components/ConnectWallet';
import BridgeButton from '@/app/components/BridgeButton';

export default function ExplorerPage() {
  return (
    <main className="min-h-screen text-neutral-100 relative">
      <ShaderBackground />
      {/* Top bar (consistent with main page) */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="mx-auto max-w-[1600px] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/img/pulsexpro-white.avif"
              alt="PulseX Pro"
              className="h-7 w-auto"
            />
            <nav className="hidden md:flex items-center gap-3 text-sm text-neutral-400">
              <a href="/" className="px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer transition-colors">Trade</a>
              <a href="/points" className="px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer transition-colors">Points</a>
              <a href="/explorer" className="px-2 py-1 rounded-md bg-white/10 text-neutral-100">Explorer</a>
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
              <div className="absolute top-full left-0 mt-1 bg-black/75 backdrop-blur-xl border border-white/5 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-12">
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

      {/* Explorer content */}
      <div className="h-[calc(100vh-80px)] w-full">
        <iframe
          src="https://ipfs.scan.pulsechain.com"
          className="w-full h-full border-0"
          title="PulseChain IPFS Explorer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals"
        />
      </div>
    </main>
  );
}
