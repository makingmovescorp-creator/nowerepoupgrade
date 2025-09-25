

import { TOKEN_LIST } from "@/app/abis/Tokens"
import { Address } from "viem";
import { pulsechain } from "@/lib/chains/pulsechain";

//For test 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9

export interface IToken {
  name: string;
  isNative: boolean;
  address: string;
  decimal: number;
}

const routerAddr = process.env.NEXT_PUBLIC_PULSEX_ROUTER;
const factoryAddr = process.env.NEXT_PUBLIC_PULSEX_FACTORY;

export const DEXRouter = routerAddr as Address;
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_WRAPPER_ADDRESS as Address;
export const FACTORY = factoryAddr as Address;

export const nativeCoin = TOKEN_LIST[0]
export const currentChain = pulsechain;

export const fee = 0.3; // 100