'use client';

import { useMemo } from 'react';
import type { Token } from '@/app/types';

export function useTotalStatusInSwap(
  isApprovedBase: boolean,
  isApprovedQuote: boolean,
  isCreated: boolean,
  isProcessing: boolean,
  baseToken: Token,
  quoteToken: Token
): number {
  return useMemo(() => {
    // Status mapping:
    // 0: Need to create pair
    // 1: Ready to add liquidity
    // 2: Need to approve both tokens
    // 3: Need to approve base token only
    // 4: Need to approve quote token only

    if (!isCreated) {
      return 0;
    }

    if (isProcessing) {
      return 1; // Show processing state
    }

    const baseNeedsApproval = !baseToken.isNative && !isApprovedBase;
    const quoteNeedsApproval = !quoteToken.isNative && !isApprovedQuote;

    if (baseNeedsApproval && quoteNeedsApproval) {
      return 2;
    }

    if (baseNeedsApproval) {
      return 3;
    }

    if (quoteNeedsApproval) {
      return 4;
    }

    return 1; // Ready to add liquidity
  }, [isApprovedBase, isApprovedQuote, isCreated, isProcessing, baseToken, quoteToken]);
}
