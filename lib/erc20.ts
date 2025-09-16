import { Address, createPublicClient, http } from 'viem';
import { pulsechain } from '@/lib/chains/pulsechain';
import erc20 from '@/abis/erc20.json';

const client = createPublicClient({ chain: pulsechain, transport: http('https://rpc.pulsechain.com') });

export async function readDecimals(token: Address) {
  return await client.readContract({ address: token, abi: erc20.abi as any, functionName: 'decimals', args: [] }) as number;
}
export async function readSymbol(token: Address) {
  try { return await client.readContract({ address: token, abi: erc20.abi as any, functionName: 'symbol', args: [] }) as string; }
  catch { return 'TKN'; }
}
export async function readName(token: Address) {
  try { return await client.readContract({ address: token, abi: erc20.abi as any, functionName: 'name', args: [] }) as string; }
  catch { return 'Token'; }
}
export async function readBalance(token: Address, owner: Address) {
  return await client.readContract({ address: token, abi: erc20.abi as any, functionName: 'balanceOf', args: [owner] }) as bigint;
}
export async function readAllowance(token: Address, owner: Address, spender: Address) {
  return await client.readContract({ address: token, abi: erc20.abi as any, functionName: 'allowance', args: [owner, spender] }) as bigint;
}


