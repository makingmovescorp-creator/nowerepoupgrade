'use client';
import { useEffect, useRef } from 'react';

export function usePlayDEX(
  isSwapSuccess: boolean,
  isSwapping: boolean,
  baseAmount: number,
  quoteAmount: number,
  baseToken: any,
  quoteToken: any
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isSwapSuccess && !isSwapping) {
      // Play success sound
      playSound('/sounds/dexswap-dex1.mp3');
    }
  }, [isSwapSuccess, isSwapping]);

  useEffect(() => {
    if (isSwapping) {
      // Play swapping sound
      playSound('/sounds/dexswap-dex2.mp3');
    }
  }, [isSwapping]);

  const playSound = (soundPath: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      audioRef.current = new Audio(soundPath);
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(error => {
        console.warn('Could not play sound:', error);
      });
    } catch (error) {
      console.warn('Sound not available:', error);
    }
  };

  return {
    playSound
  };
}
