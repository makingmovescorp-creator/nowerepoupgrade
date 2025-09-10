'use client';
import { useState, useEffect } from 'react';

// Mock USD price hook - replace with real price feed
export function useUSDprice(token: any, amount: number) {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // Mock price calculation - replace with real price feed
    const mockPrices: Record<string, number> = {
      'PLSX': 0.00095,
      'WPLS': 0.000023,
      'WETH': 95.2,
      'HEX': 0.0508,
      'DAI': 1.0,
      'USDC': 1.0,
      'pWBTC': 42500.0,
      'pDAI': 1.0
    };

    const tokenSymbol = token?.symbol || 'UNKNOWN';
    const tokenPrice = mockPrices[tokenSymbol] || 0;
    setPrice(amount * tokenPrice);
  }, [token, amount]);

  return price;
}
