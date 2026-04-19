import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Trophy, Film, Music, Atom, Gamepad2, Sparkles, X, Check } from 'lucide-react';
import { getThemesList } from '../utils/themes';

// Map icon names to Lucide components
const ICON_MAP = {
  Brain,
  Trophy,
  Film,
  Music,
  Atom,
  Gamepad2,
  Sparkles,
};

export const ThemeSelector = ({ isOpen, onClose, onSelectTheme }) => {
  if (!isOpen) return null;

  const themes = getThemesList();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        data-testid="theme-selector"
      >
        <motion.div
          className="glass rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Chivo'] text-white">
                Choisir un thème
              </h2>
              <p className="text-[#D8D8E8] text-sm mt-1">
                Charge 15 questions pré-conçues sur un thème. Vous pouvez les modifier ensuite.
              </p>
            </div>
            <button
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={onClose}
              data-testid="close-theme-selector"
            >
              <X size={24} className="text-white" />
            </button>
          </div>

          {/* Themes grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme, idx) => {
              const Icon = ICON_MAP[theme.icon] || Brain;
              
              return (
                <motion.button
                  key={theme.id}
                  className="theme-card relative overflow-hidden rounded-xl p-5 text-left transition-all border-2"
                  style={{
                    borderColor: `${theme.color}40`,
                    background: `linear-gradient(135deg, ${theme.color}15 0%, rgba(11, 11, 26, 0.8) 100%)`,
                  }}
                  onClick={() => onSelectTheme(theme.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ 
                    scale: 1.03, 
                    borderColor: theme.color,
                    boxShadow: `0 0 30px ${theme.color}40`,
                  }}
                  whileTap={{ scale: 0.98 }}
                  data-testid={`theme-${theme.id}`}
                >
                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{ 
                      background: `${theme.color}20`,
                      border: `2px solid ${theme.color}`,
                    }}
                  >
                    <Icon size={28} style={{ color: theme.color }} />
                  </div>

                  {/* Content */}
                  <h3 
                    className="font-bold font-['Chivo'] text-xl mb-1"
                    style={{ color: theme.color }}
                  >
                    {theme.name}
                  </h3>
                  <p className="text-[#D8D8E8] text-sm mb-3">
                    {theme.description}
                  </p>
                  
                  {/* Question count */}
                  <div className="flex items-center gap-2 text-xs text-[#B0B0C0]">
                    <Check size={14} style={{ color: theme.color }} />
                    <span>15 questions prêtes</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-6 p-4 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30">
            <p className="text-[#D8D8E8] text-sm">
              <span className="text-[#00E5FF] font-semibold">💡 Astuce :</span> Après avoir chargé un thème, 
              vous pouvez modifier toutes les questions et leurs réponses. Utilisez l'option "Mélanger l'ordre" 
              pour jouer les questions dans un ordre aléatoire !
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeSelector;
