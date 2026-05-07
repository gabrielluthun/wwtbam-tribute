import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export const TimerDisplay = ({ timeRemaining }) => {
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
