'use client';
import { useMemo, useState } from 'react';
import type { Address } from 'viem';
import { formatUnits, parseUnits } from 'viem';
import { useBalanceOf, useTokenInfo } from '@/hooks/useTokenInfo';

// Icon mapping for tokens
const TOKEN_ICONS: Record<string, string> = {
  'PLSX': '/icons/plsx.avif',
  'WPLS': '/icons/WPLS.avif',
  'WETH': '/icons/eth.avif',
  'HEX': '/icons/hex.avif',
  'DAI': '/icons/dai.avif',
  'PDAI': '/icons/dai.avif',
  'USDC': '/icons/usdc.avif',
  'PWBTC': '/icons/pwbtc.avif',
  'WBTC': '/icons/pwbtc.avif' // Map WBTC symbol to pWBTC icon
};

type Props = {
  label: string;
  token: Address | undefined;
  token0?: Address | undefined;
  token1?: Address | undefined;
  amount: string;
  setAmount: (v: string) => void;
  owner?: Address;
  spender?: Address;
  showAllowance?: boolean;
  allowance?: bigint;
  isReadOnly?: boolean;
  side?: 'buy' | 'sell';
};


export default function TokenSlider({
  label, token, token0, token1, amount, setAmount, owner, showAllowance, allowance, isReadOnly = false, side
}: Props) {
  const { decimals, symbol } = useTokenInfo(token as Address);
  const balance = useBalanceOf(token as Address, owner as Address);
  const [sliderValue, setSliderValue] = useState(0);
  
  // Get balances for both tokens in the pair
  const { decimals: decimals0, symbol: symbol0 } = useTokenInfo(token0 as Address);
  const { decimals: decimals1, symbol: symbol1 } = useTokenInfo(token1 as Address);
  const balance0 = useBalanceOf(token0 as Address, owner as Address);
  const balance1 = useBalanceOf(token1 as Address, owner as Address);
  
  const formattedBal = useMemo(() => 
    token && owner ? formatUnits(balance ?? 0n, decimals) : '0', 
    [balance, decimals, token, owner]
  );

  const formattedBal0 = useMemo(() => 
    token0 && owner ? formatUnits(balance0 ?? 0n, decimals0) : '0', 
    [balance0, decimals0, token0, owner]
  );

  const formattedBal1 = useMemo(() => 
    token1 && owner ? formatUnits(balance1 ?? 0n, decimals1) : '0', 
    [balance1, decimals1, token1, owner]
  );

  // Calculate total available amount from both tokens in the pair
  const availableAmount = useMemo(() => {
    if (!token0 || !token1 || !owner) return 0;
    
    const bal0 = parseFloat(formattedBal0);
    const bal1 = parseFloat(formattedBal1);
    
    // Return the minimum of both balances (the limiting factor)
    return Math.min(bal0, bal1);
  }, [formattedBal0, formattedBal1, token0, token1, owner]);

  const currentAmount = useMemo(() => 
    parseFloat(amount) || 0, 
    [amount]
  );

  const currentPercentage = useMemo(() => 
    availableAmount > 0 ? Math.round((currentAmount / availableAmount) * 100) : 0, 
    [currentAmount, availableAmount]
  );

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    if (availableAmount > 0) {
      const newAmount = (availableAmount * value) / 100;
      setAmount(newAmount.toString());
    }
  };


  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (availableAmount > 0) {
      const numValue = parseFloat(value) || 0;
      const percentage = Math.round((numValue / availableAmount) * 100);
      setSliderValue(Math.min(percentage, 100));
    }
  };

  const getTokenIcon = (symbol: string) => {
    const iconPath = TOKEN_ICONS[symbol.toUpperCase()];
    if (iconPath) {
      return (
        <img 
          src={iconPath} 
          alt={symbol} 
          className="w-5 h-5 object-contain"
          style={{ aspectRatio: '1/1' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      );
    }
    return <span className="text-xs">{symbol}</span>;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm text-neutral-400">{label}</label>
        <div className="text-xs text-neutral-500">
          {currentPercentage}% of available
        </div>
      </div>

      {/* Amount input */}
      <div className="flex items-center gap-2">
        <input
          className="w-full bg-white/5 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-emerald-500/50"
          placeholder="0.0"
          value={amount}
          onChange={e => handleAmountChange(e.target.value)}
          readOnly={isReadOnly}
        />
        <div className="px-3 py-2 text-xs bg-white/5 rounded-lg text-neutral-300 flex items-center justify-center">
          {getTokenIcon(symbol)}
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={e => handleSliderChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-white/5 rounded-lg appearance-none cursor-pointer slider"
            disabled={isReadOnly}
          />
          
          {/* Current percentage display - moved to right side */}
          <div className="px-3 py-1 text-xs bg-emerald-500/20 text-emerald-300 rounded-md">
            {sliderValue}%
          </div>
        </div>
      </div>

      {/* Balance info */}
      <div className="text-xs text-neutral-400 space-y-1">
        <div className="flex justify-between">
          <span>Balance: {formattedBal}</span>
          {showAllowance && typeof allowance === 'bigint' && (
            <span>Allowance: {formatUnits(allowance, decimals)}</span>
          )}
        </div>
        {token0 && token1 && side && (
          <div className="text-xs text-neutral-500">
            {side === 'buy' 
              ? `Available to buy: ${formattedBal1} ${symbol1}`
              : `Available to sell: ${formattedBal0} ${symbol0}`
            }
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #0f1923;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #0f1923;
        }
      `}</style>
    </div>
  );
}
