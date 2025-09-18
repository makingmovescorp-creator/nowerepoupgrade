"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { usePoints } from "@/hooks/usePoints";
import { ArrowTopRightOnSquareIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export default function TransactionHistory() {
  const { transactions, loading, error } = usePoints();
  const [sortBy, setSortBy] = useState<'date' | 'volume' | 'points'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'swap'>('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-white">Loading transaction history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <Card className="p-6 bg-red-900/20 border-red-500/20">
          <div className="text-red-400 text-center">
            <p className="font-semibold">Error loading transaction history</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  // Filter and sort transactions
  let filteredTransactions = [...transactions];

  if (filterBy !== 'all') {
    filteredTransactions = filteredTransactions.filter(tx => tx.type === filterBy);
  }

  filteredTransactions.sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.timestamp - a.timestamp;
      case 'volume':
        return b.volumeUSD - a.volumeUSD;
      case 'points':
        return b.points - a.points;
      default:
        return 0;
    }
  });

  const formatTransactionHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const getTransactionUrl = (hash: string) => {
    return `https://scan.pulsechain.com/tx/${hash}`;
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <Card className="p-4 bg-black/40 border-white/10 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-neutral-400">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'volume' | 'points')}
              className="bg-black/50 border border-white/20 rounded-md px-3 py-1 text-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="date">Date</option>
              <option value="volume">Volume</option>
              <option value="points">Points</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-neutral-400">Filter:</label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as 'all' | 'swap')}
              className="bg-black/50 border border-white/20 rounded-md px-3 py-1 text-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Transactions</option>
              <option value="swap">Swaps Only</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-neutral-400">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </div>
        </div>
      </Card>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <Card className="p-8 bg-black/40 border-white/10 backdrop-blur-xl text-center">
          <div className="text-neutral-400">
            <ChartBarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">No Transactions Found</h3>
            <p>Try adjusting your filters or start trading to see your transaction history.</p>
          </div>
        </Card>
      ) : (
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Points Earned
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTransactions.map((tx, index) => (
                  <tr key={tx.hash} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                          <span className="text-purple-400 text-sm font-semibold">#{filteredTransactions.length - index}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {formatTransactionHash(tx.hash)}
                          </div>
                          <div className="text-sm text-neutral-400">
                            {tx.details.functionName.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-neutral-400">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        ${tx.volumeUSD.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-purple-400">
                        +{tx.points}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a
                        href={getTransactionUrl(tx.hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 transition-colors flex items-center"
                      >
                        View
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Summary Stats */}
      {filteredTransactions.length > 0 && (
        <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {filteredTransactions.reduce((sum, tx) => sum + tx.volumeUSD, 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-neutral-400">Total Volume ($)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {filteredTransactions.reduce((sum, tx) => sum + tx.points, 0).toLocaleString()}
              </div>
              <div className="text-sm text-neutral-400">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {(filteredTransactions.reduce((sum, tx) => sum + tx.points, 0) / filteredTransactions.length).toFixed(1)}
              </div>
              <div className="text-sm text-neutral-400">Avg Points per Tx</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
