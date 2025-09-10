'use client';
import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { TF } from '@/lib/url';
import { getTfFromSearch, setQuery } from '@/lib/url';

const TFS: TF[] = ['1m','5m','15m','1h','4h','1d'];

export default function TimeframeBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const tf = useMemo(()=> getTfFromSearch(sp), [sp]);

  return null;
}


