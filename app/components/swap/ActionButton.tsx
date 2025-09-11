"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSwitchChain, useChainId } from "wagmi";
import { pulsechain } from "@/lib/chains/pulsechain";
import Image from "next/image";

export default function ConnectWalletButton({
  callback,
  text,
}: {
  callback: (() => Promise<void>) | undefined;
  text?: string;
}) {
  const { chains, switchChain, error } = useSwitchChain();
  const chainId = useChainId();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        const switchChainHandle = async () => {
          switchChain({ chainId: pulsechain.id });
        };

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="w-full px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-150"
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
              if (chainId != pulsechain.id) {
                return (
                  <button
                    onClick={switchChainHandle}
                    type="button"
                    className="w-full px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-150"
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
                    Switch network
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="w-full px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-150"
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
                <button
                  onClick={() =>{
                    if(callback != undefined) return callback();
                  }}
                  disabled={!callback}
                  className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-purple hover:bg-purple-bright"
                >
                  <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                    {text}
                  </h1>
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
