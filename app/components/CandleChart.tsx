'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { IChartApi } from 'lightweight-charts';
import { applyHLTheme, HL_CANDLE_OPTIONS } from '@/lib/chartTheme';
import type { Candle } from '@/lib/candles';
import type { TF } from '@/lib/url';

type Props = { candles: Candle[]; tf: TF; onReady?: () => void; };

export default function CandleChart({ candles, tf, onReady }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi|null>(null);
  const [mounted, setMounted] = useState(false);

  const seriesOptions = useMemo(() => ({
    upColor: '#16a34a', downColor: '#ef4444',
    borderUpColor: '#16a34a', borderDownColor: '#ef4444',
    wickUpColor: '#16a34a', wickDownColor: '#ef4444'
  }), []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !wrapRef.current) return;
    let cleanup: (() => void) | undefined;
    (async () => {
      const lib = await import('lightweight-charts');
      const getHeight = () => Math.max(360, Math.floor(window.innerHeight * 0.66));
      const chart = lib.createChart(wrapRef.current!, {
        width: wrapRef.current!.clientWidth,
        height: getHeight(),
        layout: { textColor: '#e5e7eb', background: { type: 'solid', color: '#0a0a0a' } as any },
        rightPriceScale: { borderVisible: false },
        timeScale: { borderVisible: false },
        grid: { horzLines: { color: 'rgba(255,255,255,0.04)' }, vertLines: { color: 'rgba(255,255,255,0.04)' } },
        crosshair: { mode: 0, vertLine: { color: 'rgba(255,255,255,0.25)', width: 1, style: 0 }, horzLine: { color: 'rgba(255,255,255,0.25)', width: 1, style: 0 } } as any,
      });
      applyHLTheme(chart as any);
      const add = (chart as any).addCandlestickSeries ?? ((opts: any) => (chart as any).addSeries({ type: 'Candlestick', ...opts }));
      const series = add(HL_CANDLE_OPTIONS as any);
      if (candles.length) series.setData(candles);
      chartRef.current = chart;
      onReady?.();

      const onResize = () => chart.applyOptions({ width: wrapRef.current!.clientWidth, height: getHeight() });
      window.addEventListener('resize', onResize);
      cleanup = () => { window.removeEventListener('resize', onResize); chart.remove(); };
    })();
    return () => { cleanup?.(); };
  }, [mounted]);

  useEffect(() => {
    (async () => {
      if (!wrapRef.current) return;
      const lib = await import('lightweight-charts');
      if (chartRef.current) chartRef.current.remove();
      const el = wrapRef.current;
      const getHeight = () => Math.max(360, Math.floor(window.innerHeight * 0.66));
      const chart = lib.createChart(el, {
        width: el.clientWidth, height: getHeight(),
        layout: { textColor: '#e5e7eb', background: { type: 'solid', color: '#0a0a0a' } as any },
        rightPriceScale: { borderVisible: false },
        timeScale: { borderVisible: false },
        grid: { horzLines: { color: 'rgba(255,255,255,0.04)' }, vertLines: { color: 'rgba(255,255,255,0.04)' } },
        crosshair: { mode: 0, vertLine: { color: 'rgba(255,255,255,0.25)', width: 1, style: 0 }, horzLine: { color: 'rgba(255,255,255,0.25)', width: 1, style: 0 } } as any,
      });
      applyHLTheme(chart as any);
      const add = (chart as any).addCandlestickSeries ?? ((opts: any) => (chart as any).addSeries({ type: 'Candlestick', ...opts }));
      const s = add(HL_CANDLE_OPTIONS as any);
      if (candles.length) s.setData(candles);
      chartRef.current = chart;
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(candles), tf]);

  return <div ref={wrapRef} className="w-full" style={{ height: '66vh' }} />;
}


