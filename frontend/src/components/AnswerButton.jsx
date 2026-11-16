import { memo } from 'react';
import { motion } from 'framer-motion';
import { ANSWER_LETTERS } from '../utils/gameData';

const AnswerButtonBase = ({
  index,
  answer,
  state, // 'default' | 'selected' | 'correct' | 'wrong' | 'eliminated'
  onClick,
  disabled,
  audiencePercent,
  /** Révélation après erreur joueur : clignotement vert dédié (sans flash « bonne réponse » classique). */
  wrongOutcomeReveal = false,
  /** Révélation progressive : réponse pas encore annoncée (case vide, non cliquable). */
  concealed = false,
  /** Réponse verrouillée ailleurs : les autres s'estompent pour concentrer le regard. */
  dimmed = false,
}) => {
  const letter = ANSWER_LETTERS[index];
  const wrongRevealBlink = wrongOutcomeReveal && state === 'correct';
  const getTargetOpacity = () => {
    if (state === 'eliminated') return 0.3;
    if (concealed) return 0.4;
    if (dimmed) return 0.35;
    return 1;
  };

  const getStateClasses = () => {
    switch (state) {
      case 'selected':
        return 'answer-btn selected animate-pulse-gold';
      case 'correct':
        if (wrongOutcomeReveal) {
          return 'answer-btn animate-blink-correct-wrong-outcome';
        }
        return 'answer-btn correct glow-green animate-flash-correct';
      case 'wrong':
        return 'answer-btn wrong glow-red animate-shake';
      case 'eliminated':
        return 'answer-btn eliminated';
      default:
        return 'answer-btn';
    }
  };

  return (
    <motion.button
      data-testid={`answer-btn-${letter.toLowerCase()}`}
      className={`${getStateClasses()} hexagon-btn w-full min-w-0 max-w-full py-4 lg:py-6 px-4 sm:px-6 lg:px-10 flex items-center gap-3 sm:gap-4 text-left ${disabled || concealed ? 'disabled' : ''} ${dimmed ? 'answer-btn--dimmed' : ''}`}
      onClick={() => !disabled && !concealed && state !== 'eliminated' && onClick(index)}
      disabled={disabled || concealed || state === 'eliminated'}
      initial={false}
      animate={{ opacity: getTargetOpacity(), x: 0 }}
      transition={{ duration: dimmed ? 0.6 : 0.25 }}
      whileHover={!disabled && !concealed && state === 'default' ? { scale: 1.02 } : {}}
      whileTap={!disabled && !concealed && state === 'default' ? { scale: 0.98 } : {}}
      aria-label={concealed ? `Réponse ${letter} (pas encore affichée)` : undefined}
    >
      <div className="letter-badge flex-shrink-0">
        {letter}
      </div>
      {concealed ? (
        <span className="flex-1 min-w-0" aria-hidden="true">&nbsp;</span>
      ) : (
        <motion.span
          key="answer-text"
          className={`font-medium text-base sm:text-lg lg:text-[28px] lg:leading-tight flex-1 min-w-0 break-words ${wrongRevealBlink ? 'text-inherit' : 'text-white'}`}
          initial={{ opacity: 0, x: -16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {answer || '...'}
        </motion.span>
      )}
      {audiencePercent !== undefined && (
        <span className={`font-bold text-base lg:text-2xl ${wrongRevealBlink ? 'text-inherit' : 'text-cyan-400'}`}>
          {audiencePercent}%
        </span>
      )}
    </motion.button>
  );
};

/**
 * Mémoisation : props 100 % primitives/fonctions stables (handlers en useCallback
 * côté useGame), donc le comparateur shallow par défaut suffit. Évite le re-render
 * des 4 boutons à chaque tick du timer.
 */
export const AnswerButton = memo(AnswerButtonBase);
