'use client';
import { Card, CardContent } from '@/components/ui/card';
import ExtendedPairSelect from './ExtendedPairSelect';
import PairInfo from './PairInfo';

export default function PairSelectWidget() {
  return (
    <div className="h-auto bg-black/40 backdrop-blur-md border border-white/5 rounded-lg">
      <div className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <ExtendedPairSelect />
            <PairInfo />
          </div>
          <div className="text-xs text-neutral-400 opacity-60">
            TradingView
          </div>
        </div>
      </div>
    </div>
  );
}
