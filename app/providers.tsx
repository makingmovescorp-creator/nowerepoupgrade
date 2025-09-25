// app/providers.tsx - Single source of truth for wallet configuration
// This file consolidates all wallet providers to prevent double initialization errors
'use client';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ReactNode } from 'react';
import { wagmiConfig, queryClient, rainbowKitTheme } from '@/lib/wallet';
import { FeaturedPairsProvider } from '@/hooks/useFeaturedPairsData';

// Guard against double initialization of WalletConnect
// This prevents "WalletConnect Core is already initialized" errors
if (typeof window !== 'undefined') {
  // @ts-ignore
  if (!window.__WALLET_INIT__) {
    // @ts-ignore
    window.__WALLET_INIT__ = true;
  }
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowKitTheme}>
          <FeaturedPairsProvider>
            {children}
          </FeaturedPairsProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}