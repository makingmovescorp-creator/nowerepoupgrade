import type { TF } from './url';

export type Candle = { time:number; open:number; high:number; low:number; close:number; };

export async function fetchCandles(pool: `0x${string}`, tf: TF, limit = 400): Promise<Candle[]> {
  const u = new URL('/api/candles', typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  u.searchParams.set('pool', pool);
  u.searchParams.set('tf', tf);
  u.searchParams.set('limit', String(limit));
  const res = await fetch(u.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('candles fetch failed');
  const json = await res.json();
  if (!Array.isArray(json.candles)) return [];
  return json.candles.map((c:any) => ({
    time: Number(c.time),
    open: Number(c.open),
    high: Number(c.high),
    low:  Number(c.low),
    close:Number(c.close),
  }));
}


