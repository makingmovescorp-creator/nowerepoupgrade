'use client';
import { create } from 'zustand';
import type { Address } from 'viem';

type State = {
  selectedKey?: string;
  pool?: Address;
  token0?: Address;
  token1?: Address;
  setPair: (key: string, pool: Address, token0: Address, token1: Address) => void;
};

export const useSwapState = create<State>((set) => ({
  selectedKey: undefined,
  pool: undefined,
  token0: undefined,
  token1: undefined,
  setPair: (selectedKey, pool, token0, token1) => set({ selectedKey, pool, token0, token1 }),
}));


