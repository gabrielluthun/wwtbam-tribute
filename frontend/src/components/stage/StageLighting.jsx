import { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * Lumière de plateau posée entre le fond studio et l'interface.
 * - Q1–Q5 : salle à peine voilée. À partir de Q6, l'obscurité croît de façon exponentielle
 *   jusqu'au quasi-noir en Q15 ; les faisceaux virent du cyan au violet.
 * - `phase` : 'idle' | 'tension' (réponse verrouillée) | 'correct' | 'wrong' (verdict).
 */
const lerp = (a, b, t) => Math.round(a + (b - a) * t);

/** Niveau à partir duquel la salle commence vraiment à s'assombrir. */
const DARKENING_START_LEVEL = 6;
/** Marche franche dès l'entrée en Q6 (part de la courbe déjà acquise). */
const DARKENING_START_AMOUNT = 0.18;
/** Courbure de l'exponentielle (plus grand = plus lent au début, plus brutal à la fin). */
const DARKENING_CURVE = 1.2;

/**
 * 0 sur Q1–Q5, marche en Q6 puis croissance exponentielle jusqu'à 1 en Q15.
 * Obscurité du fond qui en résulte :
 * Q5 8 % · Q6 23 % · Q8 32 % · Q10 44 % · Q11 51 % · Q12 60 % · Q13 69 % · Q14 80 % · Q15 92 %
 */
function darkeningCurve(level) {
  if (level < DARKENING_START_LEVEL) return 0;
  const span = 15 - DARKENING_START_LEVEL;
  const x = Math.min(1, (level - DARKENING_START_LEVEL) / span);
  const curve = (Math.exp(DARKENING_CURVE * x) - 1) / (Math.exp(DARKENING_CURVE) - 1);
  return DARKENING_START_AMOUNT + (1 - DARKENING_START_AMOUNT) * curve;
}

const StageLightingBase = ({ level = 1, phase = 'idle' }) => {
  const stake = Math.min(1, Math.max(0, (level - 1) / 14));
  // Mauvaise réponse : la tension retombe, la salle se rallume à son niveau de base (celui des Q1–Q5).
  const lightsUp = phase === 'wrong';
  const dark = lightsUp ? 0 : darkeningCurve(level);
  const tension = phase === 'tension';

  // Très léger (8 %) sur Q1–Q5, bien voilé dès Q11, quasi noir (92 %) en Q15 ; la tension ajoute une marche.
  const darkness = Math.min(0.96, 0.08 + 0.84 * dark + (tension ? 0.15 : 0));
  const vignette = Math.min(1, 0.3 + 0.7 * dark + (tension ? 0.3 : 0));
  // Les faisceaux restent visibles dans le noir : ils deviennent les seules sources de lumière.
  const beamsOpacity = tension ? 0.15 : 0.85;
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
        animate={{ opacity: tension ? 1 : 0.55 + 0.45 * dark }}
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
