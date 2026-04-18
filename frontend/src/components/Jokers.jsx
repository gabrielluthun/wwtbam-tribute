import { motion } from 'framer-motion';
import { Phone, Users, Divide } from 'lucide-react';

export const Jokers = ({ 
  usedJokers, 
  onFiftyFifty, 
  onPhoneFriend, 
  onAskAudience,
  disabled 
}) => {
  const jokers = [
    {
      id: 'fifty',
      icon: Divide,
      label: '50:50',
      onClick: onFiftyFifty,
      used: usedJokers.fifty,
    },
    {
      id: 'phone',
      icon: Phone,
      label: 'Appel',
      onClick: onPhoneFriend,
      used: usedJokers.phone,
    },
    {
      id: 'audience',
      icon: Users,
      label: 'Public',
      onClick: onAskAudience,
      used: usedJokers.audience,
    },
  ];

  return (
    <div className="flex gap-4 justify-center" data-testid="jokers-container">
      {jokers.map((joker, idx) => (
        <motion.button
          key={joker.id}
          data-testid={`joker-${joker.id}`}
          className={`joker-btn ${joker.used ? 'used' : ''}`}
          onClick={() => !joker.used && !disabled && joker.onClick()}
          disabled={joker.used || disabled}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={!joker.used && !disabled ? { scale: 1.1 } : {}}
          whileTap={!joker.used && !disabled ? { scale: 0.95 } : {}}
          title={joker.label}
        >
          <joker.icon 
            size={24} 
            className={joker.used ? 'text-gray-500' : 'text-[#00E5FF]'} 
          />
        </motion.button>
      ))}
    </div>
  );
};

// Phone Friend Dialog Component
export const PhoneFriendDialog = ({ isOpen, response, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="phone-dialog max-w-md mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        data-testid="phone-dialog"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#00E5FF]/20 flex items-center justify-center">
            <Phone size={24} className="text-[#00E5FF]" />
          </div>
          <div>
            <h3 className="text-white font-bold font-['Chivo']">Appel à un ami</h3>
            <p className="text-[#B0B0C0] text-sm">Confiance: {response?.confidence}%</p>
          </div>
        </div>
        
        <p className="text-white text-lg italic mb-6">
          "{response?.message}"
        </p>
        
        <button
          className="btn-secondary w-full"
          onClick={onClose}
          data-testid="close-phone-dialog"
        >
          Fermer
        </button>
      </motion.div>
    </motion.div>
  );
};

// Audience Results Component
export const AudienceResults = ({ isOpen, results, onClose }) => {
  if (!isOpen) return null;

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="phone-dialog max-w-md mx-4 w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        data-testid="audience-dialog"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#00E5FF]/20 flex items-center justify-center">
            <Users size={24} className="text-[#00E5FF]" />
          </div>
          <h3 className="text-white font-bold font-['Chivo']">Avis du public</h3>
        </div>
        
        <div className="flex items-end justify-around h-48 mb-4">
          {results.map((percent, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <motion.div
                className="w-12 audience-bar"
                initial={{ height: 0 }}
                animate={{ height: `${percent * 1.5}px` }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                data-testid={`audience-bar-${letters[idx].toLowerCase()}`}
              />
              <span className="text-white font-bold">{letters[idx]}</span>
              <span className="text-[#00E5FF] text-sm">{percent}%</span>
            </div>
          ))}
        </div>
        
        <button
          className="btn-secondary w-full"
          onClick={onClose}
          data-testid="close-audience-dialog"
        >
          Fermer
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Jokers;
