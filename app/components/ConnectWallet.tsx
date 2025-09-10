'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="flex items-center gap-3">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-150"
                      style={{ 
                        background: 'linear-gradient(30deg, rgba(0, 255, 85, 0.8) 0%, rgba(0, 255, 153, 0.8) 100%)',
                        border: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(30deg, rgba(0, 255, 102, 0.8) 0%, rgba(0, 255, 170, 0.8) 100%)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 255, 85, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(30deg, rgba(0, 255, 85, 0.8) 0%, rgba(0, 255, 153, 0.8) 100%)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-150"
                      style={{ 
                        background: 'linear-gradient(-30deg, rgba(255, 0, 0, 0.8) 0%, rgba(255, 0, 51, 0.8) 100%)',
                        border: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(-30deg, rgba(255, 17, 17, 0.8) 0%, rgba(255, 17, 68, 0.8) 100%)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(-30deg, rgba(255, 0, 0, 0.8) 0%, rgba(255, 0, 51, 0.8) 100%)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors duration-150"
                    >
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      {account.displayName}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
