'use client';
import { useEffect, useRef } from 'react';

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      time += 0.01;
      
      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create gradient (flipped horizontally)
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.7 - Math.sin(time * 0.5) * 100,
        canvas.height * 0.5 + Math.cos(time * 0.3) * 50,
        0,
        canvas.width * 0.3 - Math.cos(time * 0.4) * 80,
        canvas.height * 0.3 + Math.sin(time * 0.6) * 60,
        canvas.width * 0.8
      );

      // Animated colors based on shadergradient.co parameters
      const color1 = `hsl(${120 + Math.sin(time * 0.2) * 20}, 70%, ${60 + Math.sin(time * 0.3) * 10}%)`; // #99fc8a variant
      const color2 = `hsl(${220 + Math.sin(time * 0.1) * 10}, 40%, ${15 + Math.sin(time * 0.4) * 5}%)`; // #141726 variant
      const color3 = `hsl(${120 + Math.sin(time * 0.2 + 2) * 20}, 70%, ${60 + Math.sin(time * 0.3 + 1) * 10}%)`; // #99fc8a variant

      gradient.addColorStop(0, color1);
      gradient.addColorStop(0.5, color2);
      gradient.addColorStop(1, color3);

      // Apply gradient with opacity
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: '#000000' }}
    />
  );
}
