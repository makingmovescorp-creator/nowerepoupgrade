"use client";

import {
  TrophyIcon,
  StarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BoltIcon
} from "@heroicons/react/24/outline";

export interface LeagueIconProps {
  leagueName: string;
  className?: string;
}

export const LeagueIcons = {
  pioneer: StarIcon,
  diamond: ShieldCheckIcon,
  gold: TrophyIcon,
  silver: SparklesIcon,
  bronze: BoltIcon,
} as const;

export const LeagueColors = {
  pioneer: {
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    iconBg: "bg-emerald-500/20",
    textColor: "text-emerald-300"
  },
  diamond: {
    color: "text-neutral-300",
    bgColor: "bg-neutral-500/10",
    borderColor: "border-neutral-500/20",
    iconBg: "bg-neutral-500/20",
    textColor: "text-neutral-200"
  },
  gold: {
    color: "text-neutral-400",
    bgColor: "bg-neutral-600/10",
    borderColor: "border-neutral-600/20",
    iconBg: "bg-neutral-600/20",
    textColor: "text-neutral-300"
  },
  silver: {
    color: "text-neutral-500",
    bgColor: "bg-neutral-700/10",
    borderColor: "border-neutral-700/20",
    iconBg: "bg-neutral-700/20",
    textColor: "text-neutral-400"
  },
  bronze: {
    color: "text-neutral-600",
    bgColor: "bg-neutral-800/10",
    borderColor: "border-neutral-800/20",
    iconBg: "bg-neutral-800/20",
    textColor: "text-neutral-500"
  },
} as const;

export function getLeagueIcon(leagueName: string) {
  const normalizedName = leagueName.toLowerCase().replace(/\s+/g, '');

  switch (normalizedName) {
    case 'pioneerleague':
      return LeagueIcons.pioneer;
    case 'diamondleague':
      return LeagueIcons.diamond;
    case 'goldleague':
      return LeagueIcons.gold;
    case 'silverleague':
      return LeagueIcons.silver;
    case 'bronzeleague':
      return LeagueIcons.bronze;
    default:
      return TrophyIcon; // fallback
  }
}

export function getLeagueColor(leagueName: string) {
  const normalizedName = leagueName.toLowerCase().replace(/\s+/g, '');

  switch (normalizedName) {
    case 'pioneerleague':
      return LeagueColors.pioneer;
    case 'diamondleague':
      return LeagueColors.diamond;
    case 'goldleague':
      return LeagueColors.gold;
    case 'silverleague':
      return LeagueColors.silver;
    case 'bronzeleague':
      return LeagueColors.bronze;
    default:
      return LeagueColors.bronze; // fallback
  }
}

export default function LeagueIcon({ leagueName, className = "w-8 h-8" }: LeagueIconProps) {
  const IconComponent = getLeagueIcon(leagueName);

  return <IconComponent className={className} />;
}
