import { memo } from 'react';
import { motion } from 'framer-motion';
import { Phone, Users, Divide } from 'lucide-react';

const JokersBase = ({
  usedJokers,
  onFiftyFifty,
  onPhoneFriend,
  onAskAudience,
  disabled,
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
        <div key={joker.id} className="flex flex-col items-center gap-1">
          <motion.button
            type="button"
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
            aria-label={`${joker.label}${joker.used ? ' (utilisé)' : ''}`}
          >
            <joker.icon 
              size={24} 
              className={joker.used ? 'text-gray-500' : 'text-[#00E5FF]'} 
            />
          </motion.button>
          <span className={`text-xs font-semibold tracking-wide ${joker.used ? 'text-gray-600' : 'text-[#B0B0C0]'}`}>
            {joker.label}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Mémoisation : `usedJokers` est une référence stable entre les ticks
 * (recréée uniquement lors du `setUsedJokers`), handlers en useCallback.
 */
export const Jokers = memo(JokersBase);

const PhoneFriendDialogBase = ({ isOpen, response, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="presentation"
    >
      <motion.div
        className="phone-dialog max-w-md mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        data-testid="phone-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Appel à un ami"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#00E5FF]/20 flex items-center justify-center">
            <Phone size={24} className="text-[#00E5FF]" />
          </div>
          <div>
            <h3 className="text-white font-bold font-['Chivo']">Appel à un ami</h3>
            <p className="text-[#B0B0C0] text-sm">{response?.isPending ? 'En cours...' : 'Conseil reçu'}</p>
          </div>
        </div>
        
        <p className="text-white text-lg italic mb-6" aria-live="polite">
          "{response?.message}"
        </p>
        
        <button
          type="button"
          className={`btn-secondary w-full ${response?.isPending ? 'opacity-40 cursor-not-allowed' : ''}`}
          disabled={response?.isPending}
          onClick={onClose}
          data-testid="close-phone-dialog"
        >
          Fermer
        </button>
      </motion.div>
    </motion.div>
  );
};

export const PhoneFriendDialog = memo(PhoneFriendDialogBase);

const AudienceResultsBase = ({ isOpen, results, message, onClose }) => {
  if (!isOpen) return null;

  const letters = ['A', 'B', 'C', 'D'];
  const hasResults = Array.isArray(results) && results.some((percent) => percent > 0);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="presentation"
    >
      <motion.div
        className="phone-dialog max-w-md mx-4 w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        data-testid="audience-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Avis du public"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#00E5FF]/20 flex items-center justify-center">
            <Users size={24} className="text-[#00E5FF]" />
          </div>
          <h3 className="text-white font-bold font-['Chivo']">Avis du public</h3>
        </div>
        
        {hasResults ? (
          <div className="flex items-end justify-around h-48 mb-4">
            {results.map((percent, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <motion.div
                  className="w-12 audience-bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${percent * 1.92}px` }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  data-testid={`audience-bar-${letters[idx].toLowerCase()}`}
                />
                <span className="text-white font-bold">{letters[idx]}</span>
                <span className="text-[#00E5FF] text-sm">{percent}%</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-48 mb-4 flex items-center justify-center">
            <p className="text-[#B0B0C0] text-center">{message || 'Le public réfléchit...'}</p>
          </div>
        )}
        
        <button
          type="button"
          className={`btn-secondary w-full ${hasResults ? '' : 'opacity-10 cursor-not-allowed'}`}
          disabled={!hasResults}
          onClick={onClose}
          data-testid="close-audience-dialog"
        >
          Fermer
        </button>
      </motion.div>
    </motion.div>
  );
};

export const AudienceResults = memo(AudienceResultsBase);
