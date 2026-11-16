import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Même format que `MONEY_LEVELS[].display` : « 1 500 € ». */
export function formatEuro(amount) {
  return `${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €`;
}

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

/**
 * Montant qui défile de `from` à `to` (compteur façon plateau TV).
 * Respecte « réduire les animations » : affiche directement la valeur finale.
 */
export function AnimatedAmount({ from = 0, to, durationMs = 1600, delayMs = 0, className, ...rest }) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? to : from);

  useEffect(() => {
    if (reduceMotion || from === to) {
      setValue(to);
      return undefined;
    }
    setValue(from);
    let frame = null;
    let startAt = null;
    const delayTimer = window.setTimeout(() => {
      const step = (now) => {
        if (startAt == null) startAt = now;
        const progress = Math.min(1, (now - startAt) / durationMs);
        setValue(from + (to - from) * easeOutCubic(progress));
        if (progress < 1) frame = window.requestAnimationFrame(step);
      };
      frame = window.requestAnimationFrame(step);
    }, delayMs);

    return () => {
      window.clearTimeout(delayTimer);
      if (frame != null) window.cancelAnimationFrame(frame);
    };
  }, [from, to, durationMs, delayMs, reduceMotion]);

  return (
    <span className={className} {...rest}>
      {formatEuro(value)}
    </span>
  );
}
