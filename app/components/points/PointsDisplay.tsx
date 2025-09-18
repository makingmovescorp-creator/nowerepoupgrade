"use client";

import { Card } from "@/components/ui/card";
import { usePoints } from "@/hooks/usePoints";
import { TrophyIcon, ChartBarIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

export default function PointsDisplay() {
  const { totalVolume, totalPoints, transactions, loading, error } = usePoints();

  if (loading) {
    return (
      <div className="space-y-2 w-full">
        {/* Stats Cards - Loading state */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/20 backdrop-blur-xl">
              <div className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <div className="w-8 h-8 bg-white/10 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-6 bg-white/10 rounded"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* How Points Work - Loading state */}
        <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-xl">
          <div className="animate-pulse">
            <div className="h-6 bg-white/10 rounded mb-4 w-48"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-white/10 rounded w-32"></div>
                  <div className="h-4 bg-white/10 rounded w-48"></div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Transactions - Loading state */}
        <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-xl">
          <div className="animate-pulse">
            <div className="h-6 bg-white/10 rounded mb-4 w-56"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-white/10 rounded mb-1 w-32"></div>
                      <div className="h-3 bg-white/10 rounded w-24"></div>
                    </div>
                  </div>
                  <div>
                    <div className="h-4 bg-white/10 rounded mb-1 w-16"></div>
                    <div className="h-3 bg-white/10 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2 w-full">
        {/* Error Card */}
        <Card className="p-6 bg-red-900/20 border-red-500/20 backdrop-blur-xl">
          <div className="text-center">
            <div className="text-red-400">
              <p className="font-semibold text-lg mb-2">Error loading points data</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Points */}
        <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/20 backdrop-blur-xl">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <TrophyIcon className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Total Points</p>
              <p className="text-2xl font-bold text-white">{totalPoints.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Total Volume */}
        <Card className="p-6 bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/20 backdrop-blur-xl">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Total Volume</p>
              <p className="text-xl font-bold text-white">${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </Card>

        {/* Transactions Count */}
        <Card className="p-6 bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/20 backdrop-blur-xl">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <ChartBarIcon className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Transactions</p>
              <p className="text-xl font-bold text-white">{transactions.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Points Information */}
      <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-white mb-4">How Points Work</h3>
        <div className="space-y-3 text-neutral-300">
          <div className="flex justify-between items-center">
            <span>Exchange Rate:</span>
            <span className="text-white font-semibold">$10,000 volume = 100 points</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Your Current Rate:</span>
            <span className="text-white font-semibold">
              ${totalVolume.toLocaleString()} = {totalPoints} points
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Points per $1,000:</span>
            <span className="text-white font-semibold">10 points</span>
          </div>
        </div>
      </Card>

      {/* Recent Transactions Preview */}
      {transactions.length > 0 && (
        <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx, index) => (
              <div key={tx.hash} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-sm font-semibold">#{transactions.length - index}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Swap Transaction</p>
                    <p className="text-neutral-400 text-sm">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">+{tx.points} points</p>
                  <p className="text-neutral-400 text-sm">${tx.volumeUSD.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          {transactions.length > 5 && (
            <div className="text-center mt-4">
              <button className="text-purple-400 hover:text-purple-300 transition-colors">
                View all {transactions.length} transactions →
              </button>
            </div>
          )}
        </Card>
      )}

      {/* No Transactions Message */}
      {transactions.length === 0 && (
        <Card className="p-8 bg-black/40 border-white/10 backdrop-blur-xl text-center">
          <div className="text-neutral-400">
            <ChartBarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">No Transactions Yet</h3>
            <p className="mb-4">Start trading through PulseX Fee Wrapper to earn points!</p>
            <p className="text-sm">
              Each $10,000 in trading volume earns you 100 points.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
