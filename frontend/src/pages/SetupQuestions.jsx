import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Play,
  ArrowLeft,
  Check,
  AlertCircle,
  Upload,
  Download,
  Clock,
  Settings,
  Shuffle,
  Library,
  Eye,
  Save,
  Palette,
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { ThemeSelector } from '../components/ThemeSelector';
import { MONEY_LEVELS, ANSWER_LETTERS } from '../utils/gameData';
import { useSetupQuestions } from '../hooks/useSetupQuestions';
import { SETUP_QUESTION_COUNT } from '../setup/setupConstants';

/**
 * Écran de création des 15 questions avant la partie.
 * La logique (état, thèmes, import/export, session) vit dans useSetupQuestions.
 */
export const SetupQuestions = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMultiplayer = searchParams.get('mode') === 'multi';

  const {
    fileInputRef,
    questions,
    currentEditIndex,
    setCurrentEditIndex,
    errors,
    playerNames,
    setPlayerNames,
    timerEnabled,
    setTimerEnabled,
    timerDuration,
    onTimerDurationInputChange,
    shuffleEnabled,
    setShuffleEnabled,
    showThemeSelector,
    setShowThemeSelector,
    loadedTheme,
    showImportExport,
    setShowImportExport,
    importError,
    importSuccess,
    showSaveThemeModal,
    setShowSaveThemeModal,
    themeName,
    setThemeName,
    themeDescription,
    setThemeDescription,
    themeColor,
    setThemeColor,
    saveThemeError,
    setSaveThemeError,
    currentQuestion,
    updateQuestion,
    updateAnswer,
    setCorrectAnswer,
    getQuestionStatus,
    handleExport,
    handleImport,
    startGame,
    handleSelectTheme,
    handlePlayTheme,
    openSaveThemeModal,
    handleSaveCurrentTheme,
    handleRenameTheme,
    handleDeleteTheme,
    completedCount,
  } = useSetupQuestions(navigate, isMultiplayer);

  const currentLevel = MONEY_LEVELS[currentEditIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1A3A] via-[#0B0B1A] to-[#05050A] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête : navigation, progression, actions rapides */}
        <div className="flex items-start sm:items-center justify-between mb-6 flex-wrap gap-4">
          <button
            className="flex items-center gap-2 text-[#B0B0C0] hover:text-white transition-colors"
            onClick={() => navigate('/')}
            data-testid="back-btn"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>

          <div className="text-center w-full sm:w-auto order-3 sm:order-none">
            <h1 className="text-2xl sm:text-3xl font-bold font-['Chivo'] text-white">
              Créer vos questions
            </h1>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <p className="text-[#D8D8E8] text-sm font-medium">
                {completedCount}/{SETUP_QUESTION_COUNT} questions complètes
              </p>
              {loadedTheme && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    background: `${loadedTheme.color}20`,
                    color: loadedTheme.color,
                    border: `1px solid ${loadedTheme.color}40`,
                  }}
                  data-testid="loaded-theme-badge"
                >
                  {loadedTheme.name}
                </span>
              )}
              {shuffleEnabled && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#E91E63]/20 text-[#E91E63] border border-[#E91E63]/40"
                  data-testid="shuffle-badge"
                >
                  Mélangé
                </span>
              )}
            </div>
          </div>

          <div className="flex w-full lg:w-auto items-stretch lg:items-center gap-2 flex-wrap">
            <button
              className="btn-secondary flex items-center justify-center gap-2 text-sm flex-1 sm:flex-none"
              onClick={() => setShowThemeSelector(true)}
              data-testid="open-theme-selector"
            >
              <Library size={16} />
              Thèmes
            </button>
            <button
              className="btn-secondary flex items-center justify-center gap-2 text-sm flex-1 sm:flex-none"
              onClick={openSaveThemeModal}
              data-testid="save-theme-btn"
            >
              <Save size={16} />
              Sauvegarder thème
            </button>
            <button
              className="btn-secondary flex items-center justify-center gap-2 text-sm flex-1 sm:flex-none"
              onClick={() => setShowImportExport(!showImportExport)}
              data-testid="toggle-import-export"
            >
              <Settings size={16} />
              Options
            </button>
            <button
              className="btn-primary flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
              onClick={startGame}
              disabled={completedCount < SETUP_QUESTION_COUNT}
              data-testid="start-game-btn"
            >
              <Play size={18} />
              Commencer
            </button>
          </div>
        </div>

        {/* Panneau repliable : import/export JSON, timer, mélange, texte révélation manuelle */}
        <AnimatePresence>
          {showImportExport && (
            <motion.div
              className="glass-light rounded-lg p-4 mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Download size={18} className="text-[#00E5FF]" />
                    Import / Export
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="btn-secondary text-sm flex items-center gap-2"
                      onClick={handleExport}
                      data-testid="export-btn"
                    >
                      <Download size={16} />
                      Exporter JSON
                    </button>
                    <label className="btn-secondary text-sm flex items-center gap-2 cursor-pointer">
                      <Upload size={16} />
                      Importer JSON
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImport}
                        data-testid="import-input"
                      />
                    </label>
                  </div>
                  {importError && (
                    <p className="text-red-400 text-sm mt-2">{importError}</p>
                  )}
                  {importSuccess && (
                    <p className="text-green-400 text-sm mt-2">{importSuccess}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Clock size={18} className="text-[#FFD700]" />
                    Timer (optionnel)
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={timerEnabled}
                        onCheckedChange={setTimerEnabled}
                        data-testid="timer-toggle"
                      />
                      <span className="text-[#B0B0C0] text-sm">
                        {timerEnabled ? 'Activé' : 'Désactivé'}
                      </span>
                    </div>
                    {timerEnabled && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="10"
                          max="120"
                          value={timerDuration}
                          onChange={onTimerDurationInputChange}
                          className="game-input w-20 text-center"
                          data-testid="timer-duration"
                        />
                        <span className="text-[#B0B0C0] text-sm">secondes</span>
                      </div>
                    )}
                  </div>
                  {timerEnabled && (
                    <p className="text-[#B0B0C0] text-xs mt-2">
                      Le temps s'écoule pendant chaque question. Si le temps expire, la partie est perdue.
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Shuffle size={18} className="text-[#E91E63]" />
                    Mélanger l'ordre
                  </h3>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={shuffleEnabled}
                      onCheckedChange={setShuffleEnabled}
                      data-testid="shuffle-toggle"
                    />
                    <span className="text-[#B0B0C0] text-sm">
                      {shuffleEnabled ? 'Questions mélangées' : 'Ordre original'}
                    </span>
                  </div>
                  <p className="text-[#B0B0C0] text-xs mt-2">
                    {shuffleEnabled
                      ? 'Les 15 questions seront posées dans un ordre aléatoire. Chaque partie sera différente !'
                      : "Les questions seront posées dans l'ordre que vous avez défini."}
                  </p>
                </div>

                {/* Comportement aligné sur gameConstants (MANUAL_REVEAL_ENABLED) — rappel utilisateur */}
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Eye size={18} className="text-[#FFD700]" />
                    Révélation manuelle
                  </h3>
                  <p className="text-[#B0B0C0] text-xs mt-2">
                    À partir de la question 6, après "C'est mon dernier mot !", un bouton "L'animateur révèle la réponse" apparaît. Les 5 premières questions restent en validation immédiate.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multijoueur : noms persistés avec la session */}
        {isMultiplayer && (
          <motion.div
            className="glass-light rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-white font-semibold mb-3">Noms des joueurs</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                value={playerNames[0]}
                onChange={(e) => setPlayerNames([e.target.value, playerNames[1]])}
                className="game-input"
                placeholder="Joueur 1"
                data-testid="player1-name"
              />
              <Input
                value={playerNames[1]}
                onChange={(e) => setPlayerNames([playerNames[0], e.target.value])}
                className="game-input"
                placeholder="Joueur 2"
                data-testid="player2-name"
              />
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Liste des 15 paliers : navigation + indicateur de complétion */}
          <div className="lg:col-span-1">
            <div className="glass rounded-lg p-4 sticky top-4">
              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                Questions
              </h3>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                {questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  const isActive = currentEditIndex === index;
                  const level = MONEY_LEVELS[index];

                  return (
                    <button
                      key={index}
                      className={`w-full flex items-center justify-between p-2 rounded text-sm transition-all
                        ${isActive ? 'bg-[#FFD700]/20 border border-[#FFD700]' : 'hover:bg-white/5'}
                        ${level.checkpoint ? 'border-l-2 border-l-[#00E5FF]' : ''}
                      `}
                      onClick={() => setCurrentEditIndex(index)}
                      data-testid={`question-nav-${index + 1}`}
                    >
                      <span className={`${isActive ? 'text-[#FFD700]' : 'text-white'}`}>
                        Q{index + 1}
                      </span>
                      <span className={`text-xs ${level.checkpoint ? 'text-[#00E5FF]' : 'text-[#B0B0C0]'}`}>
                        {level.display}
                      </span>
                      <span>
                        {status === 'complete' && <Check size={14} className="text-green-500" />}
                        {status === 'partial' && <AlertCircle size={14} className="text-yellow-500" />}
                        {status === 'empty' && <span className="w-3 h-3 rounded-full bg-gray-600 block" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Formulaire : intitulé + 4 réponses + bonne réponse */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentEditIndex}
                className="question-card"
                initial={{ opacity: 1, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 1, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[#00E5FF] text-sm uppercase tracking-wider">
                      Question {currentEditIndex + 1}
                    </span>
                    <h2 className={`text-2xl font-bold font-['Chivo'] ${currentLevel.checkpoint ? 'text-[#00E5FF]' : 'text-[#FFD700]'}`}>
                      {currentLevel.display}
                    </h2>
                  </div>
                  {currentLevel.checkpoint && (
                    <span className="px-3 py-1 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-semibold">
                      PALIER
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-[#B0B0C0] text-sm mb-2">
                    Question
                  </label>
                  <textarea
                    value={currentQuestion.question}
                    onChange={(e) => updateQuestion('question', e.target.value)}
                    className={`game-input min-h-[100px] resize-none ${errors[`${currentEditIndex}-question`] ? 'border-red-500' : ''}`}
                    placeholder="Entrez votre question..."
                    data-testid="question-input"
                  />
                  {errors[`${currentEditIndex}-question`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`${currentEditIndex}-question`]}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-[#B0B0C0] text-sm">
                    Réponses (cliquez sur le bouton pour définir la bonne réponse)
                  </label>

                  {currentQuestion.answers.map((answer, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <button
                        className={`letter-badge flex-shrink-0 cursor-pointer transition-all ${
                          currentQuestion.correctIndex === idx
                            ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-[#1A1A3A]'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                        onClick={() => setCorrectAnswer(idx)}
                        title={currentQuestion.correctIndex === idx ? 'Bonne réponse' : 'Définir comme bonne réponse'}
                        data-testid={`correct-btn-${ANSWER_LETTERS[idx].toLowerCase()}`}
                      >
                        {ANSWER_LETTERS[idx]}
                      </button>
                      <Input
                        value={answer}
                        onChange={(e) => updateAnswer(idx, e.target.value)}
                        className={`game-input flex-1 ${errors[`${currentEditIndex}-answer-${idx}`] ? 'border-red-500' : ''}`}
                        placeholder={`Réponse ${ANSWER_LETTERS[idx]}...`}
                        data-testid={`answer-input-${ANSWER_LETTERS[idx].toLowerCase()}`}
                      />
                      {currentQuestion.correctIndex === idx && (
                        <Check size={20} className="text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
                  <button
                    className="btn-secondary"
                    onClick={() => setCurrentEditIndex(Math.max(0, currentEditIndex - 1))}
                    disabled={currentEditIndex === 0}
                    data-testid="prev-question-btn"
                  >
                    Précédent
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => setCurrentEditIndex(Math.min(SETUP_QUESTION_COUNT - 1, currentEditIndex + 1))}
                    disabled={currentEditIndex === SETUP_QUESTION_COUNT - 1}
                    data-testid="next-question-btn"
                  >
                    Suivant
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modale bibliothèque (thèmes intégrés + perso) */}
      <ThemeSelector
        isOpen={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
        onSelectTheme={handleSelectTheme}
        onPlayTheme={handlePlayTheme}
        onRenameTheme={handleRenameTheme}
        onDeleteTheme={handleDeleteTheme}
      />

      {/* Création d’un thème perso à partir du formulaire courant */}
      <AnimatePresence>
        {showSaveThemeModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSaveThemeModal(false)}
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
                  onClick={() => setShowSaveThemeModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="btn-primary flex items-center gap-2"
                  onClick={handleSaveCurrentTheme}
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
    </div>
  );
};

export default SetupQuestions;
