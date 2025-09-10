// lib/wallet.ts
'use client';
import { getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient } from '@tanstack/react-query';
import { pulsechain } from './chains/pulsechain';

export const queryClient = new QueryClient();

export const wagmiConfig = getDefaultConfig({
  appName: 'PulseX Swap Dashboard',
  projectId: '51a8a52bcc0730097ea92eed587f88cb',
  chains: [pulsechain],
  ssr: true,
});

export const rainbowKitTheme = darkTheme({
  accentColor: '#73b36a', // matching connect wallet button color
  accentColorForeground: '#ffffff',
  borderRadius: 'medium',
  overlayBlur: 'small',
});