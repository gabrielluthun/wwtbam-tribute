import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Trophy, Film, Music, Atom, Gamepad2, Sparkles, Flame, Heart, X, Check, Palette, Pencil, Trash2 } from 'lucide-react';
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
  Palette,
  Flame,
  Heart,
};

export const ThemeSelector = ({ isOpen, onClose, onSelectTheme, onRenameTheme, onDeleteTheme }) => {
  const [editingThemeId, setEditingThemeId] = useState(null);
  const [themeToDelete, setThemeToDelete] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editColor, setEditColor] = useState('#8B5CF6');
  const [editError, setEditError] = useState('');

  if (!isOpen) return null;

  const themes = getThemesList();
  const editingTheme = themes.find((theme) => theme.id === editingThemeId) || null;

  const openEditTheme = (theme) => {
    setEditingThemeId(theme.id);
    setEditName(theme.name || '');
    setEditDescription(theme.description || '');
    setEditColor(theme.color || '#8B5CF6');
    setEditError('');
  };

  const closeEditTheme = () => {
    setEditingThemeId(null);
    setEditError('');
  };

  const closeDeleteModal = () => {
    setThemeToDelete(null);
  };

  const handleRenameTheme = () => {
    if (!editingTheme || !onRenameTheme) return;
    try {
      onRenameTheme({
        themeId: editingTheme.id,
        name: editName,
        description: editDescription,
        color: editColor,
      });
      closeEditTheme();
    } catch (error) {
      setEditError(error.message || 'Impossible de modifier ce thème.');
    }
  };

  const handleEditQuestions = () => {
    if (!editingTheme || !onSelectTheme) return;
    onSelectTheme(editingTheme.id);
    closeEditTheme();
  };

  const handleDeleteTheme = (theme) => {
    if (!onDeleteTheme) return;
    setThemeToDelete(theme);
  };

  const confirmDeleteTheme = () => {
    if (!themeToDelete || !onDeleteTheme) return;
    onDeleteTheme(themeToDelete.id);
    if (editingThemeId === themeToDelete.id) {
      closeEditTheme();
    }
    closeDeleteModal();
  };

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
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    <button
                      className="p-1.5 rounded-md bg-black/30 hover:bg-black/50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditTheme(theme);
                      }}
                      title="Modifier le thème"
                      data-testid={`edit-theme-${theme.id}`}
                    >
                      <Pencil size={14} className="text-white" />
                    </button>
                    {theme.isCustom && (
                      <button
                        className="p-1.5 rounded-md bg-black/30 hover:bg-red-500/40 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTheme(theme);
                        }}
                        title="Supprimer le thème"
                        data-testid={`delete-theme-${theme.id}`}
                      >
                        <Trash2 size={14} className="text-white" />
                      </button>
                    )}
                  </div>

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
                    <span>{theme.isCustom ? 'Thème personnalisé' : '15 questions prêtes'}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {editingTheme && (
            <div className="mt-6 p-4 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/30">
              <h3 className="text-white font-semibold mb-3">
                {editingTheme.isCustom ? 'Modifier un thème personnalisé' : 'Détails du thème'}
              </h3>
              <div className="space-y-3">
                <input
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    setEditError('');
                  }}
                  className="game-input w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Nom du thème"
                  disabled={!editingTheme.isCustom}
                  data-testid="rename-theme-name"
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="game-input w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Description (optionnel)"
                  disabled={!editingTheme.isCustom}
                  data-testid="rename-theme-description"
                />
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="h-10 w-16 rounded border border-white/20 bg-transparent cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={!editingTheme.isCustom}
                    data-testid="rename-theme-color"
                  />
                  <span className="text-[#D8D8E8] text-sm font-mono uppercase">{editColor}</span>
                </div>
                {!editingTheme.isCustom && (
                  <p className="text-[#B0B0C0] text-xs">
                    Ce thème prédéfini ne peut pas être renommé, mais vous pouvez modifier ses questions.
                  </p>
                )}
              </div>
              {editError && (
                <p className="text-red-400 text-sm mt-3" data-testid="rename-theme-error">
                  {editError}
                </p>
              )}
              <div className="mt-4 flex items-center justify-end gap-3 flex-wrap">
                <button className="btn-primary text-sm" onClick={handleEditQuestions} data-testid="edit-theme-questions">
                  Modifier les questions
                </button>
                <button className="btn-secondary text-sm" onClick={closeEditTheme}>
                  Annuler
                </button>
                {editingTheme.isCustom && (
                  <button className="btn-primary text-sm" onClick={handleRenameTheme} data-testid="rename-theme-confirm">
                    Enregistrer
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {themeToDelete && (
            <motion.div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDeleteModal}
              data-testid="delete-theme-modal"
            >
              <motion.div
                className="relative w-full max-w-md rounded-2xl border border-red-400/40 bg-gradient-to-br from-[#1C1025] via-[#120B1E] to-[#0B0B1A] p-6 shadow-[0_0_45px_rgba(255,80,120,0.2)]"
                initial={{ scale: 0.92, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 12 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-red-400/30 via-pink-400/20 to-purple-400/30 blur-md -z-10" />

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-red-400/50 bg-red-500/15">
                    <Trash2 size={18} className="text-red-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-['Chivo'] text-white">Confirmer la suppression</h3>
                    <p className="mt-2 text-sm text-[#D8D8E8]">
                      Supprimer le thème <span className="font-semibold text-white">"{themeToDelete.name}"</span> ?
                      Cette action est irréversible.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    className="btn-secondary text-sm"
                    onClick={closeDeleteModal}
                    data-testid="delete-theme-cancel"
                  >
                    Annuler
                  </button>
                  <button
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 hover:shadow-[0_0_24px_rgba(255,80,120,0.45)]"
                    onClick={confirmDeleteTheme}
                    data-testid="delete-theme-confirm"
                  >
                    Supprimer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeSelector;
