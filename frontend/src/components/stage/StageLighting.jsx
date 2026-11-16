import { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * Lumière de plateau posée entre le fond studio et l'interface.
 * - Plus l'enjeu monte (niveau 1 → 15), plus la salle s'assombrit et se resserre sur la question,
 *   et les faisceaux virent du cyan au violet.
 * - `phase` : 'idle' | 'tension' (réponse verrouillée) | 'correct' | 'wrong' (verdict).
 */
const lerp = (a, b, t) => Math.round(a + (b - a) * t);

const StageLightingBase = ({ level = 1, phase = 'idle' }) => {
  const stake = Math.min(1, Math.max(0, (level - 1) / 14));
  const tension = phase === 'tension';

  const darkness = Math.min(0.75, 0.1 + 0.4 * stake + (tension ? 0.2 : 0));
  const vignette = Math.min(1, 0.35 + 0.45 * stake + (tension ? 0.3 : 0));
  const beamsOpacity = tension ? 0.15 : 0.9 - 0.4 * stake;
  const beamColor = `${lerp(0, 170, stake)}, ${lerp(229, 90, stake)}, 255`;
  const spotColor = tension ? '255, 215, 0' : '120, 200, 255';

  return (
    <div className="stage-lighting" aria-hidden="true" data-testid="stage-lighting">
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgb(3, 3, 12)' }}
        animate={{ opacity: darkness }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute inset-0"
        style={{ '--beam-color': beamColor }}
        animate={{ opacity: beamsOpacity }}
        transition={{ duration: 1.5 }}
      >
        <div className="stage-beam stage-beam--left"><div className="stage-beam__cone" /></div>
        <div className="stage-beam stage-beam--right"><div className="stage-beam__cone" /></div>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 55% 38% at 50% 40%, rgba(${spotColor}, 0.16) 0%, rgba(${spotColor}, 0.05) 45%, transparent 75%)`,
        }}
        animate={{ opacity: tension ? 1 : 0.55 + 0.45 * stake }}
        transition={{ duration: 1 }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 75% 65% at 50% 42%, transparent 35%, rgba(0, 0, 0, 0.85) 100%)',
        }}
        animate={{ opacity: vignette }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background:
            phase === 'wrong'
              ? 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(211, 47, 47, 0.35) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0, 210, 83, 0.3) 0%, transparent 70%)',
        }}
        initial={false}
        animate={{
          opacity: phase === 'correct' || phase === 'wrong' ? [0, 1, 0.45] : 0,
        }}
        transition={{ duration: phase === 'correct' || phase === 'wrong' ? 1.4 : 0.6 }}
      />
    </div>
  );
};

export const StageLighting = memo(StageLightingBase);
