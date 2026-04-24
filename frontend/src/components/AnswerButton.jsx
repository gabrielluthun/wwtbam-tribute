import { motion } from 'framer-motion';
import { ANSWER_LETTERS } from '../utils/gameData';

export const AnswerButton = ({ 
  index, 
  answer, 
  state, // 'default' | 'selected' | 'correct' | 'wrong' | 'eliminated'
  onClick, 
  disabled,
  audiencePercent 
}) => {
  const letter = ANSWER_LETTERS[index];
  
  const getStateClasses = () => {
    switch (state) {
      case 'selected':
        return 'answer-btn selected animate-pulse-gold';
      case 'correct':
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
      className={`${getStateClasses()} hexagon-btn w-full min-w-0 max-w-full py-4 px-4 sm:px-6 flex items-center gap-3 sm:gap-4 text-left ${disabled ? 'disabled' : ''}`}
      onClick={() => !disabled && state !== 'eliminated' && onClick(index)}
      disabled={disabled || state === 'eliminated'}
      initial={false}
      animate={{ opacity: state === 'eliminated' ? 0.3 : 1, x: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={!disabled && state === 'default' ? { scale: 1.02 } : {}}
      whileTap={!disabled && state === 'default' ? { scale: 0.98 } : {}}
    >
      <div className="letter-badge flex-shrink-0">
        {letter}
      </div>
      <span className="text-white font-medium text-base sm:text-lg flex-1 min-w-0 break-words">
        {answer || '...'}
      </span>
      {audiencePercent !== undefined && (
        <span className="text-cyan-400 font-bold text-sm">
          {audiencePercent}%
        </span>
      )}
    </motion.button>
  );
};

export default AnswerButton;
