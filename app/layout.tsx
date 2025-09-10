// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import './styles/rainbowkit-custom.css';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'PulseX Swap Dashboard',
  description: 'Trading dashboard for PulseChain swaps via PulseX',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}