import { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Pause } from 'lucide-react';

/**
 * @param paused réponse choisie ou verrouillée : le décompte est figé, on l'affiche clairement
 *   plutôt que de laisser un chiffre immobile qui ressemble à un bug.
 */
const TimerDisplayBase = ({ timeRemaining, paused = false }) => {
  if (paused) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-[#B0B0C0]"
        data-testid="timer-display"
        data-paused="true"
      >
        <Pause size={18} />
        <span className="font-semibold text-base">En pause</span>
      </div>
    );
  }

  const isWarning = timeRemaining <= 10;
  const isCritical = timeRemaining <= 5;

  return (
    <motion.div
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300 ${
        isCritical ? 'bg-red-500/30 text-red-400' :
        isWarning ? 'bg-yellow-500/30 text-yellow-400' :
        'bg-white/10 text-white'
      }`}
      animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
      transition={{ repeat: Infinity, duration: 0.5 }}
      data-testid="timer-display"
    >
      <Clock size={18} />
      <span className="font-bold font-mono text-lg">
        {timeRemaining}s
      </span>
    </motion.div>
  );
};

/**
 * Mémoisation : seul composant qui *doit* re-render à chaque seconde.
 * Props primitives (`timeRemaining`, `paused`), on isole donc le tick ici.
 */
export const TimerDisplay = memo(TimerDisplayBase);
