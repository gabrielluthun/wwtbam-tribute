import { motion } from 'framer-motion';
import { MONEY_LEVELS } from '../utils/gameData';

export const MoneyTree = ({ currentLevel, isOpen, onClose, onSelectLevel }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <motion.div 
        data-testid="money-tree"
        className={`money-tree-panel fixed lg:relative right-0 top-0 h-full w-64 p-4 z-50 lg:z-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} 
          transition-transform duration-300 lg:transition-none`}
      >
        {/* Close button for mobile */}
        <button 
          className="lg:hidden absolute top-4 left-4 text-white"
          onClick={onClose}
          data-testid="close-money-tree"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h3 className="text-gold font-bold text-lg mb-4 text-center font-['Chivo'] tracking-wider text-[#FFD700]">
          GAINS
        </h3>
        
        <div className="space-y-1">
          {[...MONEY_LEVELS].reverse().map((level, idx) => {
            const reversedIndex = MONEY_LEVELS.length - 1 - idx;
            const isCurrent = reversedIndex === currentLevel - 1;
            const isPassed = reversedIndex < currentLevel - 1;
            const isCheckpoint = level.checkpoint;
            
            return (
              <motion.button
                key={level.level}
                type="button"
                data-testid={`money-level-${level.level}`}
                className={`relative flex items-center justify-between py-2 px-3 rounded 
                  ${isCurrent ? 'bg-[#FFD700]/20' : ''}
                  ${isCheckpoint ? 'border-l-2 border-[#00E5FF]' : ''}
                  ${onSelectLevel ? 'w-full text-left cursor-pointer hover:bg-white/10' : 'w-full'}
                `}
                onClick={() => onSelectLevel?.(level.level)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                {isCurrent && (
                  <div className="progress-indicator" />
                )}
                
                <span className={`text-sm font-medium
                  ${isCurrent ? 'text-[#FFD700] text-glow-gold font-bold' : ''}
                  ${isPassed ? 'text-[#B0B0C0] opacity-50' : ''}
                  ${!isCurrent && !isPassed ? 'text-white' : ''}
                  ${isCheckpoint && !isCurrent && !isPassed ? 'text-[#00E5FF]' : ''}
                `}>
                  {level.level}
                </span>
                
                <span className={`text-sm font-semibold
                  ${isCurrent ? 'text-[#FFD700] text-glow-gold' : ''}
                  ${isPassed ? 'text-[#B0B0C0] opacity-50' : ''}
                  ${!isCurrent && !isPassed ? 'text-white' : ''}
                  ${isCheckpoint && !isCurrent && !isPassed ? 'text-[#00E5FF]' : ''}
                `}>
                  {level.display}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default MoneyTree;
