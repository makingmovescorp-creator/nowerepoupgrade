"use client";

import React from 'react';
import Image from 'next/image';

export interface LeagueIconProps {
  leagueName: string;
  className?: string;
}

// League image paths
export const LeagueImages = {
  pioneer: '/img/pioneer.avif',
  gold: '/img/gold.avif',
  silver: '/img/silver.avif',
  stone: '/img/stone.avif',
  bronze: '/img/bronze.avif',
} as const;

// Create image components for each league
const createLeagueImage = (src: string) => {
  return ({ className = "w-8 h-8" }: { className?: string }) => (
    <Image
      src={src}
      alt="League icon"
      width={32}
      height={32}
      className={className}
      priority
    />
  );
};

export const LeagueIcons = {
  pioneer: createLeagueImage(LeagueImages.pioneer),
  gold: createLeagueImage(LeagueImages.gold),
  silver: createLeagueImage(LeagueImages.silver),
  stone: createLeagueImage(LeagueImages.stone),
  bronze: createLeagueImage(LeagueImages.bronze),
} as const;

export const LeagueColors = {
  pioneer: {
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    iconBg: "bg-emerald-500/20",
    textColor: "text-emerald-300"
  },
  gold: {
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    iconBg: "bg-yellow-500/20",
    textColor: "text-yellow-300"
  },
  silver: {
    color: "text-neutral-300",
    bgColor: "bg-neutral-500/10",
    borderColor: "border-neutral-500/20",
    iconBg: "bg-neutral-500/20",
    textColor: "text-neutral-200"
  },
  stone: {
    color: "text-neutral-400",
    bgColor: "bg-neutral-600/10",
    borderColor: "border-neutral-600/20",
    iconBg: "bg-neutral-600/20",
    textColor: "text-neutral-300"
  },
  bronze: {
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    iconBg: "bg-orange-500/20",
    textColor: "text-orange-300"
  },
} as const;

export function getLeagueIcon(leagueName: string) {
  const normalizedName = leagueName.toLowerCase().replace(/\s+/g, '');

  switch (normalizedName) {
    case 'pioneerleague':
      return LeagueIcons.pioneer;
    case 'goldleague':
      return LeagueIcons.gold;
    case 'silverleague':
      return LeagueIcons.silver;
    case 'stoneleague':
      return LeagueIcons.stone;
    case 'bronzeleague':
      return LeagueIcons.bronze;
    default:
      return createLeagueImage(LeagueImages.bronze); // fallback
  }
}

export function getLeagueColor(leagueName: string) {
  const normalizedName = leagueName.toLowerCase().replace(/\s+/g, '');

  switch (normalizedName) {
    case 'pioneerleague':
      return LeagueColors.pioneer;
    case 'goldleague':
      return LeagueColors.gold;
    case 'silverleague':
      return LeagueColors.silver;
    case 'stoneleague':
      return LeagueColors.stone;
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
