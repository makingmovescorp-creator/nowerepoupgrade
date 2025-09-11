'use client';
import { useEffect, useRef } from 'react';

export default function TVChart({ symbol, interval }: { symbol: string; interval: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    
    const build = () => {
      if (!ref.current) return;
      ref.current.innerHTML = '';
      
      // Użyj większej wysokości - minimum 70vh lub wysokość kontenera
      const containerHeight = Math.max(
        ref.current.parentElement?.clientHeight || 0,
        Math.floor(window.innerHeight * 0.7)
      );
      ref.current.style.height = '100%';
      ref.current.style.border = 'none';
      
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        width: '100%',
        height: containerHeight,
        symbol,
        interval,
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        withdateranges: true,
        hide_top_toolbar: false,
        save_image: false,
        calendar: false,
        hide_volume: false,
        backgroundColor: '#06070b',
        overrides: {
          'paneProperties.background': '#06070b',
          'paneProperties.backgroundType': 'solid',
          'scalesProperties.borderColor': 'rgba(0,0,0,0)',
          'scalesProperties.lineColor': 'rgba(0,0,0,0)',
          'paneProperties.vertGridProperties.color': 'rgba(0,0,0,0)',
          'paneProperties.horzGridProperties.color': 'rgba(0,0,0,0)',
          'paneProperties.legendProperties.showLegend': true,
        },
        support_host: 'https://www.tradingview.com',
      });
      
      const w = document.createElement('div');
      w.className = 'tradingview-widget-container__widget';
      w.style.height = '100%';
      w.style.border = 'none';
      ref.current.appendChild(w);
      ref.current.appendChild(script);
      
      // Remove borders from injected iframe when it appears and add rounded corners
      const mo = new MutationObserver(() => {
        const iframe = ref.current?.querySelector('iframe') as HTMLIFrameElement | null;
        if (iframe) {
          (iframe.style as any).border = '0';
          (iframe.style as any).outline = 'none';
          (iframe.style as any).borderRadius = '8px'; // rounded-lg
          (iframe.style as any).overflow = 'hidden';
        }
      });
      mo.observe(ref.current!, { childList: true, subtree: true });
    };

    build();

    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => build());
    };
    window.addEventListener('resize', onResize);
    return () => { 
      window.removeEventListener('resize', onResize); 
      if (ref.current) ref.current.innerHTML = ''; 
    };
  }, [symbol, interval]);

  return <div className="tradingview-widget-container w-full h-full" ref={ref} />;
}