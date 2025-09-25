export const fmtUsd = (n?: number | string) => {
  const x = typeof n === 'string' ? Number(n) : n;
  if (x == null || Number.isNaN(x)) return '—';
  // short style: $1.2K / $3.4M
  if (Math.abs(x) >= 1_000_000) return `$${(x/1_000_000).toFixed(2)}M`;
  if (Math.abs(x) >= 1_000)     return `$${(x/1_000).toFixed(2)}K`;
  return `$${x.toFixed(x < 1 ? 6 : 2)}`;
};

export const fmtPct = (p?: number) => (p == null || Number.isNaN(p) ? '—' : `${p.toFixed(2)}%`);
