// components/TradePanel.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Address } from 'viem';
import { parseUnits, formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { buildPath } from '@/lib/path';
import { getQuote } from '@/lib/quote';
import { useAllowance } from '@/hooks/useTokenInfo';
import { useApprove } from '@/hooks/useApprove';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSwapState } from '@/lib/state';
import { useUSDprice } from '@/hooks/useUSDprice';
import { usePlayDEX } from '@/hooks/usePlayDEX';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import BottomBar from './bottomBar';
import InputTag from './swap/inputTag';
import ActionButton from './swap/ActionButton';
import InputLoadingGif from './swap/inputLoadingGif';
import { TOKEN_LIST, PLS, WPLS } from '../abis/Tokens';
import { toast } from 'react-toastify';
import { useSwapExecution } from '@/hooks/useSwapExecution';

type HexAddress = `0x${string}`;
type TabType = 'market' | 'limit' | 'pro';
type SideType = 'buy' | 'sell';

const FEE_BPS = 30; // 0.3% = 30 basis points

export default function TradePanel() {
  const { address } = useAccount();
  const sp = useSearchParams();
  const router = useRouter();
  const { token0, token1 } = useSwapState();
  
  const [activeTab, setActiveTab] = useState<TabType>('market');
  const [side, setSide] = useState<SideType>('buy');

  const ROUTER = process.env.NEXT_PUBLIC_PULSEX_ROUTER as HexAddress | undefined;
  const WPLS   = process.env.NEXT_PUBLIC_WPLS as HexAddress | undefined;
  const WRAPPER= process.env.NEXT_PUBLIC_WRAPPER_ADDRESS as HexAddress | undefined;

  const [amountIn, setAmountIn] = useState<string>('');
  const [slippage, setSlippage] = useState<string>('0.5');
  const [isSwapSuccess, setIsSwapSuccess] = useState(false);
  const [isInsufficient, setIsInsufficient] = useState(false);
  const [isAmountCalcing, setIsAmountCalcing] = useState(false);

  // Load slippage from localStorage on component mount
  useEffect(() => {
    const savedSlippage = localStorage.getItem('slippage');
    if (savedSlippage) {
      setSlippage(savedSlippage);
    }
  }, []);

  // Save slippage to localStorage when it changes
  useEffect(() => {
    if (slippage) {
      localStorage.setItem('slippage', slippage);
    }
  }, [slippage]);
  
  // Token selection state - sync with ExtendedPairSelect
  const [selectedTokenIn, setSelectedTokenIn] = useState<any>(PLS);
  const [selectedTokenOut, setSelectedTokenOut] = useState<any>(WPLS);

  // Sync with tokens from ExtendedPairSelect
  useEffect(() => {
    if (token0 && token1) {
      // Find tokens from TOKEN_LIST that match the addresses
      const tokenInFromPair = TOKEN_LIST.find(token => 
        token.address.toLowerCase() === token0.toLowerCase()
      );
      const tokenOutFromPair = TOKEN_LIST.find(token => 
        token.address.toLowerCase() === token1.toLowerCase()
      );
      
      if (tokenInFromPair && tokenOutFromPair) {
        setSelectedTokenIn(tokenInFromPair);
        setSelectedTokenOut(tokenOutFromPair);
      }
    }
  }, [token0, token1]);

  // Determine which token to display based on buy/sell side
  const displayToken = useMemo(() => {
    if (side === 'buy') {
      // For buy: show the token being bought (output token)
      return selectedTokenOut;
    } else {
      // For sell: show the token being sold (input token)
      return selectedTokenIn;
    }
  }, [side, selectedTokenIn, selectedTokenOut]);

  // Determine swap direction based on buy/sell
  const swapDirection = useMemo(() => {
    if (side === 'buy') {
      // For buy: we're buying the output token with the input token
      // So we input amount of output token we want, and get input token needed
      return { from: selectedTokenOut, to: selectedTokenIn };
    } else {
      // For sell: we're selling the input token for the output token
      // So we input amount of input token we want to sell, and get output token
      return { from: selectedTokenIn, to: selectedTokenOut };
    }
  }, [side, selectedTokenIn, selectedTokenOut]);

  // Dynamic decimals from selected tokens
  const decimalsIn = selectedTokenIn?.decimal || 18;
  const decimalsOut = selectedTokenOut?.decimal || 18;
  const displayTokenDecimals = displayToken?.decimal || 18;

  // Use swap direction to determine actual token addresses for the swap
  const tokenIn = useMemo(() => {
    return swapDirection.from?.address as HexAddress;
  }, [swapDirection]);

  const tokenOut = useMemo(() => {
    return swapDirection.to?.address as HexAddress;
  }, [swapDirection]);

  // Update URL when side changes
  useEffect(() => {
    if (token0 && token1) {
      const q = new URLSearchParams(Array.from(sp.entries()));
      q.set('in', tokenIn);
      q.set('out', tokenOut);
      router.replace(`/?${q.toString()}`);
    }
  }, [tokenIn, tokenOut, token0, token1, sp, router]);

  const amountParsed = useMemo(() => {
    try { 
      // Use display token decimals for parsing the input amount
      return amountIn ? parseUnits(amountIn, displayTokenDecimals) : 0n; 
    }
    catch { return 0n; }
  }, [amountIn, displayTokenDecimals]);

  const fee = useMemo(() => (amountParsed * BigInt(FEE_BPS)) / 10_000n, [amountParsed]);
  const net = useMemo(() => (amountParsed > fee ? amountParsed - fee : 0n), [amountParsed, fee]);

  const path = useMemo<Address[]>(() => {
    if (!tokenIn || !tokenOut || !WPLS) return [];
    try {
      return buildPath(tokenIn as Address, tokenOut as Address, WPLS as Address);
    } catch (error) {
      console.error('Error building swap path:', error);
      return [];
    }
  }, [tokenIn, tokenOut, WPLS]);

  const [quoteOut, setQuoteOut] = useState<bigint>(0n);
  const [outMin, setOutMin] = useState<bigint>(0n);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!ROUTER || !WPLS || net === 0n || path.length < 2) {
        if (!cancelled) { setQuoteOut(0n); setOutMin(0n); setIsAmountCalcing(false); }
        return;
      }
      setIsAmountCalcing(true);
      try {
        const q = await getQuote(net, path, ROUTER as Address);
        if (cancelled) return;
        setQuoteOut(q);

        const slipPct = Number(slippage || '0');
        const outMinLocal = slipPct > 0
          ? q - (q * BigInt(Math.floor(slipPct * 100)) / 10_000n)
          : q;
        setOutMin(outMinLocal);
      } catch {
        if (!cancelled) { setQuoteOut(0n); setOutMin(0n); }
      } finally {
        if (!cancelled) { setIsAmountCalcing(false); }
      }
    })();
    return () => { cancelled = true; };
  }, [ROUTER, WPLS, net, path, slippage]);

  // ALLOWANCE (dla approval -> WRAPPER), włączone dopiero gdy mamy WRAPPER
  const allowance = useAllowance(
    (tokenIn as Address),
    (address as Address | undefined),
    (WRAPPER as Address | undefined)
  );

  const needApproval = useMemo(() => {
    if (!WRAPPER || !address) return false;
    if (!amountParsed) return false;
    return allowance < amountParsed;
  }, [allowance, amountParsed, WRAPPER, address]);

  const { approve, pending } = useApprove();
  const { executeSwap, isExecuting, isConfirming, isConfirmed, txHash } = useSwapExecution();

  const onApprove = async () => {
    if (!WRAPPER || !tokenIn || !amountParsed) return;
    await approve(tokenIn as Address, WRAPPER as Address, amountParsed);
  };

  const onSwap = async () => {
    if (!canSwap || !WRAPPER || !address) return;
    
    try {
      // Play swapping sound
      playSound('/sounds/dexswap-dex2.mp3');
      
      // Prepare swap parameters
      const amountInWei = parseUnits(amountIn, displayTokenDecimals);
      const amountOutMinWei = outMin;
      const deadlineBigInt = BigInt(deadline);
      
      // Determine if tokens are native
      const isNativeIn = swapDirection.from?.isNative || false;
      const isNativeOut = swapDirection.to?.isNative || false;
      
      // Execute real swap
      const hash = await executeSwap(
        WRAPPER as Address,
        tokenIn,
        tokenOut,
        amountInWei.toString(),
        amountOutMinWei.toString(),
        path,
        deadlineBigInt,
        isNativeIn,
        isNativeOut
      );
      
      // Show success message
      toast.success(`Swap transaction submitted: ${hash.slice(0, 10)}...`);
      
      // Play success sound
      setIsSwapSuccess(true);
      playSound('/sounds/dexswap-dex1.mp3');
      
      // Reset success state after sound
      setTimeout(() => setIsSwapSuccess(false), 1000);
      
      console.log('Swap transaction submitted:', hash);
    } catch (error: any) {
      console.error('Swap failed:', error);
      
      // Parse error message for better user experience
      let errorMessage = 'Swap failed';
      
      if (error?.message) {
        if (error.message.includes('User rejected')) {
          errorMessage = 'Transaction rejected by user';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds for transaction';
        } else if (error.message.includes('slippage')) {
          errorMessage = 'Price impact too high - try increasing slippage';
        } else if (error.message.includes('deadline')) {
          errorMessage = 'Transaction deadline exceeded';
        } else if (error.message.includes('path')) {
          errorMessage = 'Invalid swap path';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(`Swap failed: ${errorMessage}`);
      console.error('Swap execution failed:', error);
    }
  };


  // Avoid SSR/CSR hydration mismatch: compute time-based values after mount
  const [deadline, setDeadline] = useState<string>('');
  useEffect(() => {
    setDeadline(String(BigInt(Math.floor(Date.now()/1000) + 60*10)));
  }, []);
  const canSwap = Boolean(
    WRAPPER && 
    address && 
    !needApproval && 
    amountParsed > 0n && 
    path.length >= 2 && 
    !isExecuting && 
    !isConfirming &&
    swapDirection.from &&
    swapDirection.to &&
    swapDirection.from.address !== swapDirection.to.address
  );

  // USD prices for tokens
  const tokenInPrice = useUSDprice(selectedTokenIn, parseFloat(amountIn) || 0);
  const tokenOutPrice = useUSDprice(selectedTokenOut, parseFloat(formatUnits(quoteOut, decimalsOut)) || 0);

  // Token balances - use display token for the input field
  const displayTokenBalance = useTokenBalance(displayToken, false);
  const tokenInBalance = useTokenBalance(selectedTokenIn, false);
  const tokenOutBalance = useTokenBalance(selectedTokenOut, false);

  // Sound effects
  const { playSound } = usePlayDEX(isSwapSuccess, false, parseFloat(amountIn) || 0, parseFloat(formatUnits(quoteOut, decimalsOut)) || 0, tokenIn, tokenOut);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && txHash) {
      const explorerUrl = `https://scan.pulsechain.com/tx/${txHash}`;
      toast.success(
        <div>
          <div>Swap completed successfully!</div>
          <a 
            href={explorerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            View on PulseScan: {txHash.slice(0, 10)}...
          </a>
        </div>
      );
      setIsSwapSuccess(true);
      playSound('/sounds/dexswap-dex1.mp3');
      
      // Reset form after successful swap
      setTimeout(() => {
        setAmountIn('');
        setIsSwapSuccess(false);
      }, 2000);
    }
  }, [isConfirmed, txHash, playSound]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col h-full bg-black/40 backdrop-blur-md border border-white/5 rounded-lg px-4 sm:px-[22px] py-4 sm:py-[16px] shadow-lg">


      {/* Header with tabs */}
      <div className="flex items-center justify-center mt-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('market')}
            className={`px-3 py-1 text-xs rounded-md transition ${
              activeTab === 'market'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setActiveTab('limit')}
            className={`px-3 py-1 text-xs rounded-md transition cursor-not-allowed opacity-50 ${
              activeTab === 'limit'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
            disabled
          >
            Limit (soon)
          </button>
          <button
            onClick={() => setActiveTab('pro')}
            className={`px-3 py-1 text-xs rounded-md transition cursor-not-allowed opacity-50 ${
              activeTab === 'pro'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
            disabled
          >
            Pro (soon)
          </button>
        </div>
      </div>

      {/* Buy/Sell buttons */}
      {/* Buy: Shows token being bought (output token), user inputs amount to buy */}
      {/* Sell: Shows token being sold (input token), user inputs amount to sell */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
            side === 'buy'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-white/5 text-neutral-400 hover:bg-white/10'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
            side === 'sell'
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-white/5 text-neutral-400 hover:bg-white/10'
          }`}
        >
          Sell
        </button>
      </div>

      {/* Token inputs */}
      <div className="space-y-3">
        <div>
          <InputTag
            balance={displayTokenBalance}
            amount={parseFloat(amountIn) || 0}
            setAmount={(amount: number) => setAmountIn(amount.toString())}
            token={displayToken || PLS}
            opToken={side === 'buy' ? selectedTokenIn : selectedTokenOut}
            setToken={() => {}}
            no={0}
            isAmountCalcing={isAmountCalcing}
            isInvalid={isInsufficient}
            setIsInsufficient={setIsInsufficient}
            USDprice={side === 'buy' ? tokenOutPrice : tokenInPrice}
            showMAXbtn={true}
            showTokenSelect={false}
          />
          {/* USD value display for input token */}
          {parseFloat(amountIn) > 0 && (side === 'buy' ? tokenOutPrice : tokenInPrice) > 0 && (
            <div className="text-right mt-2">
              <span className="text-xs text-neutral-400 font-mono">
                ${((side === 'buy' ? tokenOutPrice : tokenInPrice) * parseFloat(amountIn)).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-5">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {[10, 25, 50, 75, 100].map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  let amountOfBase = (Number(displayTokenBalance) * item) / 100;
                  amountOfBase = Math.floor(Number(amountOfBase) * 1000) / 1000;
                  setAmountIn(amountOfBase.toString());
                }}
                className="rounded-lg h-[33px] text-neutral-400 transition-all duration-200 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 px-3 sm:px-4 text-xs sm:text-sm font-medium hover:border-emerald-500/30"
              >
                <span className="font-mono">
                  {item == 100 ? 'MAX' : `${item}%`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Show the resulting token amount */}
        <div>
          <InputTag
            balance={side === 'buy' ? tokenInBalance : tokenOutBalance}
            amount={parseFloat(formatUnits(quoteOut, decimalsOut)) || 0}
            setAmount={() => {}} // Read-only for output
            token={side === 'buy' ? selectedTokenIn : selectedTokenOut}
            opToken={displayToken}
            setToken={() => {}}
            no={1}
            isAmountCalcing={isAmountCalcing}
            isInvalid={false}
            setIsInsufficient={() => {}}
            USDprice={side === 'buy' ? tokenInPrice : tokenOutPrice}
            showMAXbtn={false}
            showTokenSelect={false}
          />
          {/* USD value display for output token */}
          {parseFloat(formatUnits(quoteOut, decimalsOut)) > 0 && (side === 'buy' ? tokenInPrice : tokenOutPrice) > 0 && (
            <div className="text-right mt-2">
              <span className="text-xs text-neutral-400 font-mono">
                ${((side === 'buy' ? tokenInPrice : tokenOutPrice) * parseFloat(formatUnits(quoteOut, decimalsOut))).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Slippage */}
      <div className="space-y-3 mt-6">
        <div className="flex items-center justify-between">
          <label className="text-sm text-neutral-400 font-medium">Slippage</label>
          <span className="text-xs text-neutral-500 font-mono">{slippage}%</span>
        </div>
        
        {/* Custom input */}
        <input
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 hover:border-white/20 font-mono"
          placeholder="0.5"
          value={slippage}
          onChange={e => setSlippage(e.target.value)}
        />
        
        {/* Preset buttons */}
        <div className="flex gap-2">
          {['0.5', '1', '3'].map((preset) => (
            <button
              key={preset}
              onClick={() => setSlippage(preset)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                slippage === preset
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/5 text-neutral-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              {preset}%
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs space-y-1 mt-6 shadow-sm">
        <div className="flex justify-between">
          <span className="group relative border-b border-dashed border-neutral-400 text-neutral-400 font-medium">
            Trading Fees (0.3%)
            <div className="absolute bottom-full left-0 mb-2 px-2 py-1 text-xs bg-black/80 border border-white/10 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 shadow-lg">
              PulseX V1/V2 (0.29%) + Taker fee (0.01%)
            </div>
          </span>
          <span className="text-white font-mono">{formatUnits(fee, displayTokenDecimals)}</span>
        </div>
        <div className="flex justify-between">
          <span className="group relative border-b border-dashed border-neutral-400 text-neutral-400 font-medium">
            Wrapper Fee (0.01%)
            <div className="absolute bottom-full left-0 mb-2 px-2 py-1 text-xs bg-black/80 border border-white/10 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 shadow-lg">
              PulseXFeeWrapper fee for enhanced functionality
            </div>
          </span>
          <span className="text-white font-mono">{formatUnits((amountParsed * BigInt(10)) / 10_000n, displayTokenDecimals)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400 font-medium">Net in</span>
          <span className="text-white font-mono">{formatUnits(net, displayTokenDecimals)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400 font-medium">Min out</span>
          <span className="text-white font-mono">{formatUnits(outMin, decimalsOut)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400 font-medium">Deadline</span>
          <span className="text-white font-mono" suppressHydrationWarning>{deadline || '—'}</span>
        </div>
      </div>

      {/* Swap Summary Panel */}
      {parseFloat(amountIn) > 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs space-y-1 mt-4 shadow-sm">
          <div className="flex justify-between">
            <span className="text-neutral-400 font-medium">
              Minimum output
            </span>
            <span className="text-white font-mono">
              {parseFloat(formatUnits(outMin, decimalsOut)).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400 font-medium">
              Expected output
            </span>
            <span className="text-white font-mono">
              {parseFloat(formatUnits(quoteOut, decimalsOut)).toFixed(2)}
            </span>
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Transaction Progress */}
      {(isExecuting || isConfirming || txHash) && (
        <div className="flex flex-col gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg py-4 px-4 mt-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${isExecuting ? 'bg-yellow-500 animate-pulse' : isConfirming ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            <h1 className="text-white font-mono text-sm font-medium">
              {isExecuting ? 'Executing Swap...' : isConfirming ? 'Confirming Transaction...' : 'Transaction Confirmed!'}
            </h1>
          </div>
          {txHash && (
            <div className="text-xs text-emerald-300">
              <a 
                href={`https://scan.pulsechain.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-200 underline transition-colors duration-200 font-mono"
              >
                View on PulseScan: {txHash.slice(0, 20)}...
              </a>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="sm:mt-6 mt-8 rounded-lg p-1 shadow-sm">
        {!address ? (
          <ActionButton callback={undefined} text="" />
        ) : parseFloat(amountIn) == 0 ? (
          <button className="w-[100%] sm:h-[50px] h-[42px] text-neutral-400 transition-all duration-200 bg-white/5 border border-white/10 rounded-lg cursor-not-allowed opacity-60">
            <h1 className="font-mono text-white sm:text-[18px] text-[16px] font-medium">
              Input amount
            </h1>
          </button>
        ) : pending ? (
          <button className="w-[100%] sm:h-[50px] h-[42px] text-neutral-400 transition-all duration-200 bg-white/5 border border-white/10 rounded-lg cursor-not-allowed opacity-60">
            <h1 className="font-mono text-white sm:text-[18px] text-[16px] font-medium">
              Approving ...
            </h1>
          </button>
        ) : isExecuting ? (
          <button className="w-[100%] sm:h-[50px] h-[42px] text-neutral-400 transition-all duration-200 bg-white/5 border border-white/10 rounded-lg cursor-not-allowed opacity-60">
            <h1 className="font-mono text-white sm:text-[18px] text-[16px] font-medium">
              Executing Swap ...
            </h1>
          </button>
        ) : isConfirming ? (
          <button className="w-[100%] sm:h-[50px] h-[42px] text-neutral-400 transition-all duration-200 bg-white/5 border border-white/10 rounded-lg cursor-not-allowed opacity-60">
            <h1 className="font-mono text-white sm:text-[18px] text-[16px] font-medium">
              Confirming ...
            </h1>
          </button>
        ) : isInsufficient ? (
          <button className="w-[100%] sm:h-[50px] h-[42px] text-neutral-400 transition-all duration-200 bg-white/5 border border-white/10 rounded-lg cursor-not-allowed opacity-60">
            <h1 className="font-mono text-white sm:text-[18px] text-[16px] font-medium">
              Insufficient balance
            </h1>
          </button>
        ) : needApproval ? (
          <button
            onClick={onApprove}
            disabled={pending}
            className={`w-full rounded-lg py-3 text-sm font-medium transition ${
              needApproval 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                : 'bg-white/5 cursor-not-allowed text-neutral-400'
            }`}
          >
            {pending ? 'Confirm in wallet…' : (needApproval ? 'Approve' : 'Approved')}
          </button>
        ) : (
          <button
            onClick={onSwap}
            disabled={!canSwap}
            className={`w-full rounded-lg py-3 text-sm font-medium transition ${
              canSwap 
                ? side === 'buy' 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-white/5 cursor-not-allowed text-neutral-400'
            }`}
          >
            {canSwap ? (side === 'buy' ? 'Buy' : 'Sell') : 'Connect wallet'}
          </button>
        )}
      </div>
      </div>
      <BottomBar />
    </div>
  );
}