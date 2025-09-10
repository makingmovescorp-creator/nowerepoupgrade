export type TF = '1m'|'5m'|'15m'|'1h'|'4h'|'1d';

export function getTfFromSearch(sp: URLSearchParams): TF {
  const v = sp.get('tf') ?? '1h';
  const allowed: TF[] = ['1m','5m','15m','1h','4h','1d'];
  return (allowed as string[]).includes(v) ? (v as TF) : '1h';
}

export function setQuery(routerReplace: (url:string)=>void, sp: URLSearchParams, kv: Record<string,string>) {
  const q = new URLSearchParams(Array.from(sp.entries()));
  Object.entries(kv).forEach(([k,v]) => q.set(k, v));
  routerReplace(`/?${q.toString()}`);
}


