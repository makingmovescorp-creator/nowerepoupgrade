'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLinkIcon } from 'lucide-react';

export default function BridgeButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const bridges = [
    {
      name: 'PulseChain Bridge',
      url: 'https://bridge.pulsechain.com',
      description: 'Official PulseChain bridge for transferring assets from Ethereum to PulseChain'
    },
    {
      name: 'LibertySwap Bridge',
      url: 'https://libertyswap.finance',
      description: 'Alternative bridge solution for cross-chain asset transfers'
    }
  ];

  if (!mounted) {
    return (
      <div className="px-4 py-2 bg-white/5 text-white text-sm font-medium rounded-lg flex items-center gap-2 opacity-0 pointer-events-none">
        Bridge
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="h-10 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors duration-150 flex items-center gap-2"
      >
        Bridge
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </button>

      {/* Pop-up modal with RainbowKit-like animations - rendered in portal */}
      {isOpen && mounted && createPortal(
        <>
          {/* Backdrop with fade-in animation */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal with slide-in animation */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-black/40 backdrop-blur-md border border-white/5 rounded-lg shadow-2xl z-[101] animate-in zoom-in-95 fade-in duration-200">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Bridge to PulseChain</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-400 hover:text-white transition-colors duration-150 p-1 rounded-md hover:bg-white/5"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-400 mb-4">
                Use one of these bridges to transfer your assets from Ethereum to PulseChain:
              </p>

              {/* Bridge options */}
              <div className="space-y-2">
                {bridges.map((bridge, index) => (
                  <a
                    key={index}
                    href={bridge.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-150 group border border-white/5 hover:border-white/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white group-hover:text-emerald-400 transition-colors duration-150">
                            {bridge.name}
                          </h4>
                          <ExternalLinkIcon className="w-3 h-3 text-neutral-400 group-hover:text-emerald-400 transition-colors duration-150" />
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors duration-150">
                          {bridge.description}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Footer note */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <p className="text-xs text-neutral-500 text-center">
                  After bridging, refresh this page to see your assets
                </p>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
