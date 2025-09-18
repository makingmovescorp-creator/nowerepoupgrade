"use client";

import { useTreasuryValue } from "@/hooks/useTreasuryValue";
import { CurrencyDollarIcon, BanknotesIcon } from "@heroicons/react/24/outline";

export default function TreasuryValueWidget() {
  const { treasuryAddress, balancePLS, balanceUSD, loading, error } = useTreasuryValue();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: bigint) => {
    const plsAmount = Number(balance) / 1e18;
    return plsAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  const formatUSD = (usd: number) => {
    return usd.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 bg-white/10 rounded w-32"></div>
            <div className="h-4 bg-white/10 rounded w-20"></div>
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BanknotesIcon className="w-5 h-5 text-neutral-400" />
            <h3 className="text-sm font-medium text-neutral-400">Treasury Value</h3>
          </div>
        </div>
        <div className="text-center py-4">
          <div className="text-red-400 text-sm mb-2">Error loading treasury data</div>
          <div className="text-neutral-500 text-xs">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BanknotesIcon className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-medium text-neutral-400">Treasury Value</h3>
        </div>
        <div className="text-xs text-neutral-500">
          Ready for Distribution
        </div>
      </div>

      <div className="space-y-3">
        {/* USD Value */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-neutral-300">USD Value</span>
          </div>
          <div className="text-base font-semibold text-white">
            ${formatUSD(balanceUSD)}
          </div>
        </div>

        {/* PLS Balance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-400">PLS</span>
            </div>
            <span className="text-sm text-neutral-300">PLS Balance</span>
          </div>
          <div className="text-sm text-neutral-400">
            {formatBalance(balancePLS)} PLS
          </div>
        </div>

        {/* Treasury Address */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">Treasury Address</span>
            <a
              href={`https://scan.pulsechain.com/address/${treasuryAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {treasuryAddress && formatAddress(treasuryAddress)}
            </a>
          </div>
        </div>

        {/* Distribution Info */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 mt-3">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-emerald-400">💰</span>
            </div>
            <div>
              <div className="text-sm font-medium text-emerald-300 mb-1">
                Trader Rewards
              </div>
              <div className="text-xs text-neutral-400">
                This treasury holds fees collected from trades and is ready to be distributed among active traders who earn points through the PulseX Fee Wrapper.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
