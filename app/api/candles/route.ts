import { NextResponse } from 'next/server';

// map timeframe -> seconds per candle
const TF_SEC: Record<string, number> = { '1m':60, '5m':300, '15m':900, '1h':3600, '4h':14400, '1d':86400 };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pool = (searchParams.get('pool') || '').toLowerCase();
  const tf   = (searchParams.get('tf') || '1h').toLowerCase();
  const limit = Math.min(parseInt(searchParams.get('limit') || '400', 10), 2000);

  if (!pool || !(tf in TF_SEC)) {
    return NextResponse.json({ error: 'bad params' }, { status: 400 });
  }

  // mock generator: stable but slightly random walk seeded by pool
  const now = Math.floor(Date.now()/1000);
  const step = TF_SEC[tf];
  const out: { time:number; open:number; high:number; low:number; close:number; }[] = [];
  // Seed from pool string to keep curve stable across reloads
  let seed = Array.from(pool).reduce((s,c)=> s + c.charCodeAt(0), 0) % 1000 + 50;
  let price = 1 + (seed/1000);
  for (let i = limit; i > 0; i--) {
    const t = now - i*step;
    const drift = (Math.sin((i+seed)/17) + Math.cos((i+seed)/29)) * 0.002; // gentle drift
    const vol   = 0.004 + ((seed % 7) * 0.0005);
    const o = price;
    const h = o * (1 + Math.abs(drift) + vol*Math.random());
    const l = o * (1 - Math.abs(drift) - vol*Math.random());
    const c = (h + l) / 2;
    out.push({ time: t, open: o, high: h, low: l, close: c });
    price = c;
  }
  return NextResponse.json({ candles: out });
}


