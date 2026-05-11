import { AnimatePresence, motion } from 'framer-motion';
import { Palette, Save } from 'lucide-react';
import { Input } from '../ui/input';

export const SaveThemeModal = ({
  isOpen,
  onClose,
  themeName,
  setThemeName,
  themeDescription,
  setThemeDescription,
  themeColor,
  setThemeColor,
  saveThemeError,
  setSaveThemeError,
  onSave,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        data-testid="save-theme-modal"
      >
        <motion.div
          className="glass rounded-2xl w-full max-w-lg p-6"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-white text-2xl font-bold font-['Chivo'] flex items-center gap-2">
            <Palette size={22} className="text-[#8B5CF6]" />
            Créer un thème libre
          </h3>
          <p className="text-[#B0B0C0] text-sm mt-2 mb-5">
            Sauvegarde vos 15 questions actuelles comme thème réutilisable.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-[#B0B0C0] text-sm mb-2">Nom du thème</label>
              <Input
                value={themeName}
                onChange={(e) => {
                  setThemeName(e.target.value);
                  setSaveThemeError('');
                }}
                className="game-input"
                placeholder="Ex: Histoire de France"
                data-testid="custom-theme-name"
              />
            </div>
            <div>
              <label className="block text-[#B0B0C0] text-sm mb-2">Description (optionnel)</label>
              <Input
                value={themeDescription}
                onChange={(e) => setThemeDescription(e.target.value)}
                className="game-input"
                placeholder="Ex: Questions du collège au niveau expert"
                data-testid="custom-theme-description"
              />
            </div>
            <div>
              <label className="block text-[#B0B0C0] text-sm mb-2">Couleur du thème</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="h-10 w-16 rounded border border-white/20 bg-transparent cursor-pointer"
                  data-testid="custom-theme-color"
                />
                <span className="text-[#D8D8E8] text-sm font-mono uppercase">{themeColor}</span>
              </div>
            </div>
          </div>

          {saveThemeError && (
            <p className="text-red-400 text-sm mt-4" data-testid="save-theme-error">
              {saveThemeError}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              className="btn-secondary"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              className="btn-primary flex items-center gap-2"
              onClick={onSave}
              data-testid="confirm-save-theme-btn"
            >
              <Save size={16} />
              Sauvegarder
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
