"use client";

import { Card } from "@/components/ui/card";
import { useAccount } from "wagmi";
import { usePoints } from "@/hooks/usePoints";
import { getLeagueIcon, getLeagueColor } from "./LeagueIcons";

interface League {
  name: string;
  minPoints: number;
  maxPoints: number;
  description: string;
}

const LEAGUES: League[] = [
  {
    name: "Pioneer League",
    minPoints: 800,
    maxPoints: 100000,
    description: "Elite trader"
  },
  {
    name: "Diamond League",
    minPoints: 600,
    maxPoints: 799,
    description: "Advanced trader"
  },
  {
    name: "Gold League",
    minPoints: 400,
    maxPoints: 599,
    description: "Experienced trader"
  },
  {
    name: "Silver League",
    minPoints: 200,
    maxPoints: 399,
    description: "Growing trader"
  },
  {
    name: "Bronze League",
    minPoints: 0,
    maxPoints: 199,
    description: "New trader"
  }
];

export default function LeagueWidget() {
  const { isConnected } = useAccount();
  const { totalPoints, loading } = usePoints();

  const getCurrentLeague = (points: number): League => {
    return LEAGUES.find(league => points >= league.minPoints && points <= league.maxPoints) || LEAGUES[LEAGUES.length - 1];
  };

  const getNextLeague = (currentLeague: League): League | null => {
    const currentIndex = LEAGUES.indexOf(currentLeague);
    return currentIndex > 0 ? LEAGUES[currentIndex - 1] : null;
  };

  const getProgressToNextLeague = (points: number, currentLeague: League): number => {
    const nextLeague = getNextLeague(currentLeague);
    if (!nextLeague) return 100; // Already at max league

    const pointsInCurrentRange = points - currentLeague.minPoints;
    const totalPointsNeeded = nextLeague.minPoints - currentLeague.minPoints;

    return Math.min((pointsInCurrentRange / totalPointsNeeded) * 100, 100);
  };

  if (loading) {
    return (
      <div className="h-full bg-black/40 backdrop-blur-md border border-white/5 rounded-lg">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-white/10 rounded mb-4"></div>
            <div className="h-8 bg-white/10 rounded mb-2"></div>
            <div className="h-4 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentLeague = getCurrentLeague(totalPoints);
  const nextLeague = getNextLeague(currentLeague);
  const progress = getProgressToNextLeague(totalPoints, currentLeague);
  const IconComponent = getLeagueIcon(currentLeague.name);
  const leagueColors = getLeagueColor(currentLeague.name);

  return (
    <div className="h-full bg-black/40 backdrop-blur-md border border-white/5 rounded-lg">
      <div className="p-4">
        <div className="text-center">
          {/* League Icon */}
          <div className="mb-4">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/20 ${leagueColors.iconBg}`}>
              <IconComponent className="w-8 h-8" />
            </div>
          </div>

          {/* League Name */}
          <h3 className={`text-lg font-semibold mb-2 ${leagueColors.textColor}`}>
            {currentLeague.name}
          </h3>

          {/* Current Points */}
          <div className="mb-4">
            <div className="text-2xl font-bold text-white">
              {totalPoints.toLocaleString()}
            </div>
            <div className="text-sm text-neutral-400">
              Current Points
            </div>
          </div>

          {/* League Description */}
          <div className={`text-sm mb-4 ${leagueColors.color}`}>
            {currentLeague.description}
          </div>

          {/* Connect Wallet Message for Unconnected Users */}
          {!isConnected && (
            <div className="mb-4 p-3 bg-white/10 rounded-lg border border-white/20">
              <p className="text-sm text-neutral-300 mb-2">
                👋 Connect your wallet to view your actual league and start earning points!
              </p>
              <p className="text-xs text-neutral-400">
                Start trading through PulseX Fee Wrapper to climb the ranks
              </p>
            </div>
          )}

          {/* Progress to Next League */}
          {nextLeague && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-neutral-400 mb-2">
                <span>Progress to {nextLeague.name}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {nextLeague.minPoints - totalPoints} points to next league
              </div>
            </div>
          )}

          {/* League Range */}
          <div className="text-xs text-neutral-500">
            {currentLeague.minPoints.toLocaleString()} - {currentLeague.maxPoints.toLocaleString()} points
          </div>
        </div>

      {/* League Ranking */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <h4 className="text-sm font-semibold text-white mb-3">League Rankings</h4>
        {!isConnected ? (
          <div className="p-3 bg-white/5 rounded-lg text-center">
            <p className="text-sm text-neutral-400 mb-1">🔒 Connect wallet to unlock rankings</p>
            <p className="text-xs text-neutral-500">See where you stand among other traders</p>
          </div>
        ) : (
          <div className="space-y-2">
            {LEAGUES.map((league, index) => {
              const isCurrentLeague = league.name === currentLeague.name;
              const isHigherLeague = LEAGUES.indexOf(league) < LEAGUES.indexOf(currentLeague);
              const leagueColors = getLeagueColor(league.name);

              return (
                <div
                  key={league.name}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    isCurrentLeague
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : isHigherLeague
                      ? 'bg-white/5 text-neutral-400'
                      : 'bg-black/20 text-neutral-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-bold ${isCurrentLeague ? 'text-emerald-400' : 'text-neutral-500'}`}>
                      #{LEAGUES.length - index}
                    </span>
                    <span className={`text-sm ${isCurrentLeague ? 'text-white font-semibold' : 'text-neutral-400'}`}>
                      {league.name}
                    </span>
                  </div>
                  <div className={`text-xs ${isCurrentLeague ? 'text-emerald-400' : 'text-neutral-500'}`}>
                    {league.minPoints}+ pts
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
