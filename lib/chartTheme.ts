// lib/chartTheme.ts
import type { ChartOptions, DeepPartial, CandlestickSeriesOptions, IChartApi } from 'lightweight-charts';

export const HL_CHART_OPTIONS: DeepPartial<ChartOptions> = {
  layout: {
    background: { type: 'solid', color: '#131a1f' } as any,
    textColor: '#d4d4d4',
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI',
  },
  grid: {
    vertLines: { color: 'rgba(255,255,255,0.04)' },
    horzLines: { color: 'rgba(255,255,255,0.04)' },
  },
  rightPriceScale: { borderVisible: false },
  timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true, rightOffset: 6, barSpacing: 8 } as any,
  crosshair: {
    vertLine: { width: 1, color: '#9ca3af', style: 0, labelBackgroundColor: '#1f2937' } as any,
    horzLine: { width: 1, color: '#9ca3af', style: 0, labelBackgroundColor: '#1f2937' } as any,
    mode: 1 as any,
  },
};

export const HL_CANDLE_OPTIONS: Partial<CandlestickSeriesOptions> = {
  upColor: '#10b981',
  downColor: '#ef4444',
  borderUpColor: '#10b981',
  borderDownColor: '#ef4444',
  wickUpColor: '#10b981',
  wickDownColor: '#ef4444',
};

export function applyHLTheme(chart: IChartApi) {
  chart.applyOptions(HL_CHART_OPTIONS);
}


