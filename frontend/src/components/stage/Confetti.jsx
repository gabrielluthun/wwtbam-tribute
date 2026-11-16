import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const COLORS = ['#FFD700', '#FFC107', '#FFF3B0', '#00E5FF', '#FFFFFF'];

function makeParticle(width, height, mode) {
  const fromTop = mode === 'rain';
  return {
    x: fromTop ? Math.random() * width : width / 2 + (Math.random() - 0.5) * width * 0.3,
    y: fromTop ? -20 - Math.random() * height * 0.5 : height * 0.45,
    vx: fromTop ? (Math.random() - 0.5) * 1.5 : (Math.random() - 0.5) * 16,
    vy: fromTop ? 1.5 + Math.random() * 2.5 : -8 - Math.random() * 10,
    size: 6 + Math.random() * 7,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.3,
    tilt: Math.random() * Math.PI,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

/**
 * Confettis dorés plein écran.
 * - mode 'burst' : explosion depuis le centre (passage de palier), relancée à chaque `burstKey`.
 * - mode 'rain' : pluie continue tant que le composant est monté (million).
 * Désactivé si l'utilisateur a demandé à réduire les animations.
 */
export function Confetti({ mode = 'burst', burstKey = 0, count = 160 }) {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return undefined;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const width = () => window.innerWidth;
    const height = () => window.innerHeight;
    let particles = Array.from({ length: count }, () => makeParticle(width(), height(), mode));
    const gravity = mode === 'rain' ? 0.02 : 0.28;
    const startedAt = performance.now();
    const burstDurationMs = 4500;
    let frame = null;

    const draw = (now) => {
      const elapsed = now - startedAt;
      context.clearRect(0, 0, width(), height());
      const fade = mode === 'burst' ? Math.max(0, 1 - Math.max(0, elapsed - burstDurationMs * 0.6) / (burstDurationMs * 0.4)) : 1;

      particles.forEach((p) => {
        p.vy += gravity;
        p.vx *= 0.99;
        if (mode === 'burst') p.vy = Math.min(p.vy, 5);
        p.x += p.vx + Math.sin(p.tilt) * 0.6;
        p.y += p.vy;
        p.rotation += p.spin;
        p.tilt += 0.05;

        if (mode === 'rain' && p.y > height() + 20) {
          Object.assign(p, makeParticle(width(), height(), 'rain'), { y: -20 });
        }

        context.save();
        context.globalAlpha = fade;
        context.translate(p.x, p.y);
        context.rotate(p.rotation);
        context.scale(1, Math.cos(p.tilt));
        context.fillStyle = p.color;
        context.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        context.restore();
      });

      if (mode === 'burst' && elapsed > burstDurationMs) {
        context.clearRect(0, 0, width(), height());
        particles = [];
        return;
      }
      frame = window.requestAnimationFrame(draw);
    };
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (frame != null) window.cancelAnimationFrame(frame);
    };
  }, [mode, burstKey, count, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[45] pointer-events-none w-full h-full"
      aria-hidden="true"
      data-testid={`confetti-${mode}`}
    />
  );
}
