'use client';
import { useEffect, useRef } from 'react';

export default function TVChart({ symbol, interval }: { symbol: string; interval: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    const build = (h: number) => {
      if (!ref.current) return;
      ref.current.innerHTML = '';
      ref.current.style.height = `${h}px`;
      ref.current.style.border = 'none';
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    
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
      
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        width: '100%',
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        height: h,
        // autosize powoduje powrót do domyślnej wysokości w niektórych osadzeniach – wyłączamy
        // autosize: true,
=======
        height: containerHeight,
>>>>>>> Stashed changes
=======
        height: containerHeight,
>>>>>>> Stashed changes
=======
        height: containerHeight,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        backgroundColor: '#131a1f',
        overrides: {
          'paneProperties.background': '#131a1f',
          'paneProperties.backgroundType': 'solid',
          'scalesProperties.lineColor': 'rgba(0,0,0,0)',
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        backgroundColor: '#06070b',
        overrides: {
          'paneProperties.background': '#06070b',
          'paneProperties.backgroundType': 'solid',
          'scalesProperties.borderColor': 'rgba(0,0,0,0)',
          'scalesProperties.lineColor': 'rgba(0,0,0,0)',
          'paneProperties.vertGridProperties.color': 'rgba(0,0,0,0)',
          'paneProperties.horzGridProperties.color': 'rgba(0,0,0,0)',
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
          'paneProperties.legendProperties.showLegend': true,
        },
        support_host: 'https://www.tradingview.com',
      });
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
      
>>>>>>> Stashed changes
=======
      
>>>>>>> Stashed changes
=======
      
>>>>>>> Stashed changes
      const w = document.createElement('div');
      w.className = 'tradingview-widget-container__widget';
      w.style.height = '100%';
      w.style.border = 'none';
      ref.current.appendChild(w);
      ref.current.appendChild(script);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      // Remove borders from injected iframe when it appears
=======
      
      // Remove borders from injected iframe when it appears and add rounded corners
>>>>>>> Stashed changes
=======
      
      // Remove borders from injected iframe when it appears and add rounded corners
>>>>>>> Stashed changes
=======
      
      // Remove borders from injected iframe when it appears and add rounded corners
>>>>>>> Stashed changes
      const mo = new MutationObserver(() => {
        const iframe = ref.current?.querySelector('iframe') as HTMLIFrameElement | null;
        if (iframe) {
          (iframe.style as any).border = '0';
          (iframe.style as any).outline = 'none';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
          (iframe.style as any).borderRadius = '8px'; // rounded-lg
          (iframe.style as any).overflow = 'hidden';
>>>>>>> Stashed changes
=======
          (iframe.style as any).borderRadius = '8px'; // rounded-lg
          (iframe.style as any).overflow = 'hidden';
>>>>>>> Stashed changes
=======
          (iframe.style as any).borderRadius = '8px'; // rounded-lg
          (iframe.style as any).overflow = 'hidden';
>>>>>>> Stashed changes
        }
      });
      mo.observe(ref.current!, { childList: true, subtree: true });
    };

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    const getHeight = () => Math.max(360, Math.floor(window.innerHeight * 0.66));
    build(getHeight());
=======
    build();
>>>>>>> Stashed changes
=======
    build();
>>>>>>> Stashed changes
=======
    build();
>>>>>>> Stashed changes

    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      raf = requestAnimationFrame(() => build(getHeight()));
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); if (ref.current) ref.current.innerHTML = ''; };
  }, [symbol, interval]);

  return <div className="tradingview-widget-container w-full" ref={ref} />;
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      raf = requestAnimationFrame(() => build());
    };
    window.addEventListener('resize', onResize);
    return () => { 
      window.removeEventListener('resize', onResize); 
      if (ref.current) ref.current.innerHTML = ''; 
    };
  }, [symbol, interval]);

  return <div className="tradingview-widget-container w-full h-full" ref={ref} />;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
}


