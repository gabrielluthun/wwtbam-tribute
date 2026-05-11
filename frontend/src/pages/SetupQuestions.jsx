import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { ThemeSelector } from '../components/ThemeSelector';
import { SetupHeader } from '../components/setup/SetupHeader';
import { SetupOptionsPanel } from '../components/setup/SetupOptionsPanel';
import { SetupQuestionEditor } from '../components/setup/SetupQuestionEditor';
import { SaveThemeModal } from '../components/setup/SaveThemeModal';
import { MONEY_LEVELS } from '../utils/gameData';
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
  const hasSelectedTheme = Boolean(loadedTheme);
  const hasStartedManualCreation = completedCount > 0;
  const themeStepCompleted = hasSelectedTheme || hasStartedManualCreation;
  const questionsStepCompleted = completedCount === SETUP_QUESTION_COUNT;
  const canLaunchGame = themeStepCompleted && questionsStepCompleted;
  const remainingQuestions = SETUP_QUESTION_COUNT - completedCount;
  const launchHint = !themeStepCompleted
    ? 'Choisissez un thème ou complétez une première question.'
    : !questionsStepCompleted
      ? `Complétez encore ${remainingQuestions} question(s).`
      : 'Tout est prêt.';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1A3A] via-[#0B0B1A] to-[#05050A] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <SetupHeader
          completedCount={completedCount}
          themeStepCompleted={themeStepCompleted}
          questionsStepCompleted={questionsStepCompleted}
          canLaunchGame={canLaunchGame}
          loadedTheme={loadedTheme}
          shuffleEnabled={shuffleEnabled}
          launchHint={launchHint}
          onBack={() => navigate('/')}
          onOpenThemeSelector={() => setShowThemeSelector(true)}
          onOpenSaveThemeModal={openSaveThemeModal}
          onToggleOptions={() => setShowImportExport(!showImportExport)}
          onStartGame={startGame}
        />

        <AnimatePresence>
          {showImportExport && (
            <SetupOptionsPanel
              fileInputRef={fileInputRef}
              handleExport={handleExport}
              handleImport={handleImport}
              importError={importError}
              importSuccess={importSuccess}
              timerEnabled={timerEnabled}
              setTimerEnabled={setTimerEnabled}
              timerDuration={timerDuration}
              onTimerDurationInputChange={onTimerDurationInputChange}
              shuffleEnabled={shuffleEnabled}
              setShuffleEnabled={setShuffleEnabled}
            />
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

        <SetupQuestionEditor
          questions={questions}
          currentEditIndex={currentEditIndex}
          setCurrentEditIndex={setCurrentEditIndex}
          getQuestionStatus={getQuestionStatus}
          currentQuestion={currentQuestion}
          currentLevel={currentLevel}
          errors={errors}
          updateQuestion={updateQuestion}
          updateAnswer={updateAnswer}
          setCorrectAnswer={setCorrectAnswer}
        />
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

      <SaveThemeModal
        isOpen={showSaveThemeModal}
        onClose={() => setShowSaveThemeModal(false)}
        themeName={themeName}
        setThemeName={setThemeName}
        themeDescription={themeDescription}
        setThemeDescription={setThemeDescription}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        saveThemeError={saveThemeError}
        setSaveThemeError={setSaveThemeError}
        onSave={handleSaveCurrentTheme}
      />
    </div>
  );
};
