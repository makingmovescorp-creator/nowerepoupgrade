'use client';

import { Address, parseEther, formatEther } from 'viem';
import { wagmiConfig as config } from '@/lib/wallet';
import { DEXRouter, FACTORY } from '@/app/config';
import { writeContract, readContract } from '@wagmi/core';
import { waitForTransactionReceipt } from '@wagmi/core';
import type { Token } from '@/app/types';
import { pulsechain } from '@/lib/chains/pulsechain';

// ABI imports
import uniswapV2Router from '@/abis/pulsexRouter.json';
import uniswapV2Factory from '@/abis/uniswapV2Factory.json';
import uniswapV2Pair from '@/abis/uniswapV2Pair.json';

export async function addLiquidityETH(
  amountTokenDesired: number,
  token: Token,
  amountTokenMin: number,
  amountETHMin: number,
  amountETHMin2: number,
  to: Address,
  deadline: number
) {
  try {
    const amountTokenDesiredWei = parseEther(amountTokenDesired.toString());
    const amountTokenMinWei = parseEther(amountTokenMin.toString());
    const amountETHMinWei = parseEther(amountETHMin.toString());

    const hash = await writeContract(config, {
      address: DEXRouter,
      abi: uniswapV2Router.abi,
      functionName: 'addLiquidityETH',
      args: [
        token.address as Address,
        amountTokenDesiredWei,
        amountTokenMinWei,
        amountETHMinWei,
        to,
        BigInt(deadline)
      ],
    });

    await waitForTransactionReceipt(config, { hash });
    return hash;
  } catch (error) {
    console.error('addLiquidityETH error:', error);
    throw error;
  }
}

export async function addLiquidity(
  tokenA: Token,
  tokenB: Token,
  amountADesired: number,
  amountBDesired: number,
  amountAMin: number,
  amountBMin: number,
  to: Address,
  deadline: number
) {
  try {
    const amountADesiredWei = parseEther(amountADesired.toString());
    const amountBDesiredWei = parseEther(amountBDesired.toString());
    const amountAMinWei = parseEther(amountAMin.toString());
    const amountBMinWei = parseEther(amountBMin.toString());

    const hash = await writeContract(config, {
      address: DEXRouter,
      abi: uniswapV2Router.abi,
      functionName: 'addLiquidity',
      args: [
        tokenA.address as Address,
        tokenB.address as Address,
        amountADesiredWei,
        amountBDesiredWei,
        amountAMinWei,
        amountBMinWei,
        to,
        BigInt(deadline)
      ],
    });

    await waitForTransactionReceipt(config, { hash });
    return hash;
  } catch (error) {
    console.error('addLiquidity error:', error);
    throw error;
  }
}

export async function createPair(tokenA: Token, tokenB: Token) {
  try {
    const hash = await writeContract(config, {
      address: FACTORY,
      abi: uniswapV2Factory.abi,
      functionName: 'createPair',
      args: [tokenA.address as Address, tokenB.address as Address],
    });

    await waitForTransactionReceipt(config, { hash });
    return hash;
  } catch (error) {
    console.error('createPair error:', error);
    throw error;
  }
}

export async function getPair(tokenA: Token, tokenB: Token): Promise<Address> {
  try {
    const pairAddress = await readContract(config, {
      address: FACTORY,
      abi: uniswapV2Factory.abi,
      functionName: 'getPair',
      args: [tokenA.address as Address, tokenB.address as Address],
    }) as Address;

    return pairAddress;
  } catch (error) {
    console.error('getPair error:', error);
    throw error;
  }
}

export async function getReserves(pairAddress: Address): Promise<{ reserve0: bigint; reserve1: bigint; blockTimestampLast: number }> {
  try {
    const reserves = await readContract(config, {
      address: pairAddress,
      abi: uniswapV2Pair.abi,
      functionName: 'getReserves',
    }) as [bigint, bigint, number];

    return {
      reserve0: reserves[0],
      reserve1: reserves[1],
      blockTimestampLast: reserves[2]
    };
  } catch (error) {
    console.error('getReserves error:', error);
    throw error;
  }
}

export async function approve(
  config: any,
  token: Token,
  amount: bigint,
  spender: Address
) {
  try {
    const erc20Abi = [
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" }
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function"
      }
    ];

    const hash = await writeContract(config, {
      address: token.address as Address,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, amount],
    });

    return hash;
  } catch (error) {
    console.error('approve error:', error);
    throw error;
  }
}

export async function removeLiquidity(
  tokenA: Token,
  tokenB: Token,
  liquidity: number,
  amountAMin: number,
  amountBMin: number,
  to: Address,
  deadline: number
) {
  try {
    const liquidityWei = parseEther(liquidity.toString());
    const amountAMinWei = parseEther(amountAMin.toString());
    const amountBMinWei = parseEther(amountBMin.toString());

    const hash = await writeContract(config, {
      address: DEXRouter,
      abi: uniswapV2Router.abi,
      functionName: 'removeLiquidity',
      args: [
        tokenA.address as Address,
        tokenB.address as Address,
        liquidityWei,
        amountAMinWei,
        amountBMinWei,
        to,
        BigInt(deadline)
      ],
    });

    await waitForTransactionReceipt(config, { hash });
    return hash;
  } catch (error) {
    console.error('removeLiquidity error:', error);
    throw error;
  }
}

export async function removeLiquidityETH(
  token: Token,
  pairAddress: Address,
  liquidity: number,
  amountTokenMin: number,
  amountETHMin: number,
  to: Address,
  deadline: number
) {
  try {
    const liquidityWei = parseEther(liquidity.toString());
    const amountTokenMinWei = parseEther(amountTokenMin.toString());
    const amountETHMinWei = parseEther(amountETHMin.toString());

    const hash = await writeContract(config, {
      address: DEXRouter,
      abi: uniswapV2Router.abi,
      functionName: 'removeLiquidityETH',
      args: [
        token.address as Address,
        liquidityWei,
        amountTokenMinWei,
        amountETHMinWei,
        to,
        BigInt(deadline)
      ],
    });

    await waitForTransactionReceipt(config, { hash });
    return hash;
  } catch (error) {
    console.error('removeLiquidityETH error:', error);
    throw error;
  }
}

export async function getAmountsOutFromDEX(
  tokenIn: Token,
  tokenOut: Token,
  amountIn: number
): Promise<number> {
  try {
    const amountInWei = parseEther(amountIn.toString());

    const amounts = await readContract(config, {
      address: DEXRouter,
      abi: uniswapV2Router.abi,
      functionName: 'getAmountsOut',
      args: [amountInWei, [tokenIn.address as Address, tokenOut.address as Address]],
    }) as bigint[];

    const amountOut = Number(formatEther(amounts[1]));
    return amountOut;
  } catch (error) {
    console.error('getAmountsOutFromDEX error:', error);
    throw error;
  }
}

// Test function to verify getPair and getReserves work correctly
export async function testGetPairAndReserves(tokenA: Token, tokenB: Token) {
  try {
    console.log('Testing getPair and getReserves functionality...');

    // 1. Get pair address from factory
    console.log('1. Getting pair address from factory...');
    const pairAddress = await getPair(tokenA, tokenB);
    console.log(`Pair address: ${pairAddress}`);

    if (pairAddress === '0x0000000000000000000000000000000000000000') {
      console.log('Pair does not exist - this is expected for some token pairs');
      return { pairExists: false, pairAddress, reserves: null };
    }

    // 2. Get reserves from pair contract
    console.log('2. Getting reserves from pair contract...');
    const reserves = await getReserves(pairAddress);
    console.log(`Reserve0: ${reserves.reserve0}`);
    console.log(`Reserve1: ${reserves.reserve1}`);
    console.log(`Block timestamp: ${reserves.blockTimestampLast}`);

    console.log('✅ getPair and getReserves functions are working correctly!');
    return { pairExists: true, pairAddress, reserves };
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}
