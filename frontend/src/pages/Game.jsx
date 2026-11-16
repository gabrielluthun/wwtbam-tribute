import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Home, RotateCcw, Clock, Eye } from 'lucide-react';
import { AnswerButton } from '../components/AnswerButton';
import { MoneyTree } from '../components/MoneyTree';
import { ConfirmActionModal } from '../components/ConfirmActionModal';
import { Jokers, PhoneFriendDialog, AudienceResults } from '../components/Jokers';
import { TimerDisplay } from '../components/TimerDisplay';
import { StageLighting } from '../components/stage/StageLighting';
import { Confetti } from '../components/stage/Confetti';
import { AnimatedAmount, formatEuro } from '../components/stage/AnimatedAmount';
import { MONEY_LEVELS, ANSWER_LETTERS } from '../utils/gameData';
import { useGame } from '../hooks/useGame';
import { GAME_STATES } from '../game/gameConstants';

/** Boutons d’action sur l’overlay intro / transition (même style). */
const OVERLAY_CTA_CLASSES =
  'btn-primary mt-10 px-8 py-3 text-base sm:text-lg font-bold shadow-[0_0_24px_rgba(255,215,0,0.35)] border border-[#FFD700]/50 transition-none';

/** Touches qui font « avancer le show » (Espace + télécommandes de présentation). */
const ADVANCE_KEYS = new Set([' ', 'Spacebar', 'ArrowRight', 'PageDown']);

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

export const Game = () => {
  const navigate = useNavigate();
  const [confirmAction, setConfirmAction] = useState(null);
  const {
    currentLevel,
    gameState,
    answerStates,
    usedJokers,
    eliminatedAnswers,
    phoneResponse,
    showPhoneDialog,
    audienceResults,
    audienceMessage,
    showAudienceDialog,
    revealedCount,
    allAnswersRevealed,
    handleRevealNextAnswer,
    handleRevealAllAnswers,
    timerEnabled,
    timeRemaining,
    isAwaitingNextQuestionClick,
    showIntroStartButton,
    handleBeginIntroGame,
    masterVolume,
    setMasterVolume,
    isMuted,
    showMoneyTree,
    setShowMoneyTree,
    transitionLevel,
    gameMode,
    playerNames,
    currentPlayer,
    scores,
    currentQuestion,
    currentMoney,
    guaranteedMoney,
    overlayLevel,
    overlayMoney,
    handleSelectAnswer,
    handleConfirmAnswer,
    handleContinueToNextQuestion,
    handleRevealAnswer,
    handleCancelSelection,
    handleFiftyFifty,
    handlePhoneFriend,
    handleAskAudience,
    closePhoneDialog,
    closeAudienceDialog,
    handleSelectMoneyLevel,
    toggleMute,
    handleWalkAway,
    handleRestart,
  } = useGame(navigate);

  const openHomeConfirm = useCallback(() => setConfirmAction('home'), []);
  const openWalkAwayConfirm = useCallback(() => {
    if (gameState !== GAME_STATES.PLAYING) return;
    setConfirmAction('walkaway');
  }, [gameState]);

  const closeConfirmModal = useCallback(() => setConfirmAction(null), []);
  const confirmCurrentAction = useCallback(() => {
    if (confirmAction === 'home') {
      navigate('/');
    } else if (confirmAction === 'walkaway') {
      handleWalkAway();
    }
    setConfirmAction(null);
  }, [confirmAction, navigate, handleWalkAway]);

  const closeMoneyTree = useCallback(() => setShowMoneyTree(false), [setShowMoneyTree]);
  const openMoneyTree = useCallback(() => setShowMoneyTree(true), [setShowMoneyTree]);
  const onMasterVolumeChange = useCallback(
    (e) => setMasterVolume(Number(e.target.value) / 100),
    [setMasterVolume],
  );

  const confirmTitle = confirmAction === 'home' ? 'Retourner au menu ?' : 'Partir avec vos gains ?';
  const confirmDescription = confirmAction === 'home'
    ? 'Vous allez quitter la partie en cours.'
    : `Vous allez repartir avec ${currentLevel > 1 ? MONEY_LEVELS[currentLevel - 2].display : '0 €'}.`;
  const confirmButtonLabel = confirmAction === 'home' ? 'Oui, quitter' : 'Oui, partir';

  // --- Immersion : phase de lumière, pyramide au verdict, confettis de palier ---
  const hasWrongAnswer = answerStates.includes('wrong');
  const isVerdictCorrect =
    answerStates.includes('correct') &&
    !hasWrongAnswer &&
    (gameState === GAME_STATES.REVEALING || gameState === GAME_STATES.TRANSITION);
  const isAnswerLocked =
    gameState === GAME_STATES.AWAITING_REVEAL || gameState === GAME_STATES.REVEALING;

  // Chrono : « En pause » dès qu'une réponse est choisie, masqué une fois le verdict affiché.
  const showTimer = !hasWrongAnswer && !isVerdictCorrect && gameState !== GAME_STATES.TRANSITION;
  const isTimerOnHold = gameState === GAME_STATES.SELECTED || isAnswerLocked;

  let stagePhase = 'idle';
  if (hasWrongAnswer || gameState === GAME_STATES.TIMEOUT) stagePhase = 'wrong';
  else if (isVerdictCorrect) stagePhase = 'correct';
  else if (isAnswerLocked) stagePhase = 'tension';

  let moneyTreeHighlight = currentLevel;
  if (isVerdictCorrect) moneyTreeHighlight = Math.min(currentLevel + 1, MONEY_LEVELS.length);
  else if (hasWrongAnswer) moneyTreeHighlight = guaranteedMoney.level;

  const moneyTreeFlashKind = isVerdictCorrect ? 'won' : hasWrongAnswer ? 'lost' : null;
  const moneyTreeFlash = useMemo(
    () => (moneyTreeFlashKind ? { level: currentLevel, kind: moneyTreeFlashKind } : null),
    [moneyTreeFlashKind, currentLevel],
  );

  const showCheckpointConfetti =
    isVerdictCorrect && Boolean(currentMoney?.checkpoint) && currentLevel < MONEY_LEVELS.length;

  // --- Pilotage clavier : Espace / → / télécommande font avancer le show ---
  useEffect(() => {
    const onKeyDown = (event) => {
      if (!ADVANCE_KEYS.has(event.key) || event.repeat || isTypingTarget(event.target)) return;
      if (confirmAction || showPhoneDialog || showAudienceDialog || showMoneyTree) return;

      let handled = true;
      if (gameState === GAME_STATES.PLAYING && !allAnswersRevealed) handleRevealNextAnswer();
      else if (gameState === GAME_STATES.AWAITING_REVEAL) handleRevealAnswer();
      else if (gameState === GAME_STATES.TRANSITION && isAwaitingNextQuestionClick) handleContinueToNextQuestion();
      else if (gameState === GAME_STATES.INTRO && showIntroStartButton) handleBeginIntroGame();
      else handled = false;

      if (handled) event.preventDefault();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    confirmAction,
    showPhoneDialog,
    showAudienceDialog,
    showMoneyTree,
    gameState,
    allAnswersRevealed,
    isAwaitingNextQuestionClick,
    showIntroStartButton,
    handleRevealNextAnswer,
    handleRevealAnswer,
    handleContinueToNextQuestion,
    handleBeginIntroGame,
  ]);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen relative w-full max-w-full overflow-x-hidden flex items-center justify-center">
        <div className="game-fixed-bg" />
        <div className="absolute inset-0 max-w-full" style={{ background: 'var(--overlay-screen)' }} />
        <div className="relative z-10" style={{ color: 'var(--text-primary)' }}>Chargement...</div>
      </div>
    );
  }

  if (gameState === GAME_STATES.LOST || gameState === GAME_STATES.WON || gameState === GAME_STATES.MILLION || gameState === GAME_STATES.TIMEOUT) {
    const validatedAmount = currentLevel > 1 ? MONEY_LEVELS[currentLevel - 2].amount : 0;
    const isLoss = gameState === GAME_STATES.LOST || gameState === GAME_STATES.TIMEOUT;
    // Gain : le compteur monte depuis 0. Perte : il chute du montant acquis vers le palier garanti.
    let amountFrom = 0;
    let amountTo = guaranteedMoney.amount;
    if (gameState === GAME_STATES.MILLION) amountTo = MONEY_LEVELS[14].amount;
    else if (gameState === GAME_STATES.WON) amountTo = validatedAmount;
    else amountFrom = validatedAmount;
    const showsDrop = isLoss && amountFrom !== amountTo;

    return (
      <div className="min-h-screen relative w-full max-w-full overflow-x-hidden flex items-center justify-center p-6">
        <div className="game-fixed-bg" />
        <StageLighting level={currentLevel} phase={isLoss ? 'wrong' : 'correct'} />
        {gameState === GAME_STATES.MILLION && <Confetti mode="rain" count={220} />}
        {gameState === GAME_STATES.WON && amountTo > 0 && <Confetti mode="burst" burstKey={currentLevel} />}

        <motion.div
          className="relative z-10 w-full max-w-5xl min-w-0 flex flex-col items-center text-center"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          data-testid="game-over-screen"
        >
          {gameState === GAME_STATES.MILLION ? (
            <>
              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl font-black font-['Chivo'] text-[#FFD700] mb-3 text-glow-gold"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                MILLIONNAIRE{' '}!
              </motion.h1>
              <p className="text-[#00E5FF] text-xl lg:text-2xl mb-4">Félicitations{' '}!</p>
            </>
          ) : gameState === GAME_STATES.WON ? (
            <>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Chivo'] text-[#00E5FF] mb-3">
                Bien joué{' '}!
              </h1>
              <p className="text-[#D6D6E2] text-lg sm:text-2xl mb-4">Vous repartez avec</p>
            </>
          ) : gameState === GAME_STATES.TIMEOUT ? (
            <>
              <motion.div
                className="mb-3"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Clock className="mx-auto text-[#FF5A5A]" size={64} />
              </motion.div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Chivo'] text-[#FF5A5A] mb-3">
                Temps écoulé{' '}!
              </h1>
              <p className="text-[#D6D6E2] text-lg sm:text-2xl mb-4">Vous repartez avec</p>
            </>
          ) : (
            <>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Chivo'] text-[#FF5A5A] mb-3">
                Mauvaise réponse{' '}!
              </h1>
              <p className="text-[#D6D6E2] text-lg sm:text-2xl mb-4">Vous repartez avec</p>
            </>
          )}

          <AnimatedAmount
            from={amountFrom}
            to={amountTo}
            durationMs={gameState === GAME_STATES.MILLION ? 3000 : 1800}
            delayMs={isLoss ? 900 : 300}
            className={`block max-w-full text-6xl sm:text-8xl lg:text-[168px] leading-none font-black font-['Chivo'] text-[#FFD700] text-glow-gold tabular-nums break-words ${showsDrop ? 'mb-4' : 'mb-10'}`}
            data-testid="final-amount"
          />
          {showsDrop && (
            <p className="text-[#D6D6E2] text-base sm:text-xl lg:text-2xl mb-10" data-testid="lost-amount">
              au lieu de <span className="line-through decoration-[#FF5A5A] decoration-[3px]">{formatEuro(amountFrom)}</span>
            </p>
          )}

          {gameMode === 'multi' && (
            <div className="mb-8 p-4 bg-white/5 rounded-lg w-full max-w-md">
              <h3 className="text-white font-semibold mb-2">Scores</h3>
              {playerNames.map((name, idx) => (
                <div key={idx} className="flex justify-between text-[#B0B0C0]">
                  <span>{name}</span>
                  <span className="text-[#FFD700]">{scores[idx].toLocaleString()} €</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              className="btn-primary flex items-center justify-center gap-3 text-lg lg:text-xl px-10 py-4"
              onClick={handleRestart}
              data-testid="restart-btn"
            >
              <RotateCcw size={22} />
              Rejouer
            </button>
            <button
              className="btn-secondary flex items-center justify-center gap-3 text-lg lg:text-xl px-9 py-4"
              onClick={openHomeConfirm}
              data-testid="home-btn"
            >
              <Home size={22} />
              Accueil
            </button>
          </div>
        </motion.div>
        <ConfirmActionModal
          isOpen={Boolean(confirmAction)}
          title={confirmTitle}
          description={confirmDescription}
          confirmLabel={confirmButtonLabel}
          onCancel={closeConfirmModal}
          onConfirm={confirmCurrentAction}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative w-full max-w-full overflow-x-hidden">
      <div className="game-fixed-bg" />
      <StageLighting level={currentLevel} phase={stagePhase} />
      {showCheckpointConfetti && <Confetti mode="burst" burstKey={currentLevel} />}

      <div className="relative z-10 flex min-h-screen w-full max-w-full min-w-0 flex-col lg:flex-row">
        <div className="flex min-w-0 w-full max-w-full flex-1 flex-col p-4 pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6 sm:p-6 lg:px-10">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
          <div className="flex items-start sm:items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <button
                className="p-2 rounded-full transition-colors"
                style={{ background: 'var(--top-btn-bg)' }}
                onClick={openHomeConfirm}
                aria-label="Retour à l'accueil"
                data-testid="back-home-btn"
              >
                <Home size={20} style={{ color: 'var(--text-primary)' }} />
              </button>
              <div
                className="group flex items-center gap-0 min-w-0"
                aria-label="Volume"
              >
                <button
                  type="button"
                  className="p-2 rounded-full shrink-0 transition-colors"
                  style={{ background: 'var(--top-btn-bg)' }}
                  onClick={toggleMute}
                  data-testid="mute-btn"
                  aria-label={isMuted ? 'Réactiver le son' : 'Couper le son'}
                >
                  {isMuted
                    ? <VolumeX size={20} style={{ color: 'var(--text-primary)' }} />
                    : <Volume2 size={20} style={{ color: 'var(--text-primary)' }} />}
                </button>
                <div
                  className={[
                    'overflow-hidden transition-[max-width,opacity,margin] duration-200 ease-out',
                    'max-w-0 opacity-0 mr-0 pointer-events-none',
                    'group-hover:max-w-[7.5rem] group-hover:opacity-100 group-hover:mr-2 group-hover:pointer-events-auto',
                    'group-focus-within:max-w-[7.5rem] group-focus-within:opacity-100 group-focus-within:mr-2 group-focus-within:pointer-events-auto',
                    '[@media(pointer:coarse)]:max-w-[7.5rem] [@media(pointer:coarse)]:opacity-100 [@media(pointer:coarse)]:mr-2 [@media(pointer:coarse)]:pointer-events-auto',
                  ].join(' ')}
                >
                  <label className="flex items-center min-w-0">
                    <span className="sr-only">Volume</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={Math.round(masterVolume * 100)}
                      onChange={onMasterVolumeChange}
                      className="volume-slider shrink-0 min-w-0"
                      style={{ '--vol': masterVolume }}
                      data-testid="volume-slider"
                      aria-label="Volume du jeu"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(masterVolume * 100)}
                    />
                  </label>
                </div>
              </div>
              {timerEnabled && showTimer && <TimerDisplay timeRemaining={timeRemaining} paused={isTimerOnHold} />}
            </div>

            {gameMode === 'multi' && (
              <div className="text-center ml-auto sm:ml-0">
                <span className="text-[#B0B0C0] text-sm">Tour de</span>
                <p className="text-[#FFD700] font-bold">{playerNames[currentPlayer]}</p>
              </div>
            )}

            <button
              className="btn-secondary text-sm hidden lg:flex"
              onClick={openWalkAwayConfirm}
              disabled={gameState !== GAME_STATES.PLAYING}
              data-testid="walk-away-btn"
            >
              Partir avec {currentLevel > 1 ? MONEY_LEVELS[currentLevel - 2].display : '0 €'}
            </button>
          </div>

          <div className="mb-6">
            <Jokers
              usedJokers={usedJokers}
              onFiftyFifty={handleFiftyFifty}
              onPhoneFriend={handlePhoneFriend}
              onAskAudience={handleAskAudience}
              disabled={gameState !== GAME_STATES.PLAYING || !allAnswersRevealed}
            />
          </div>

          <div className="flex flex-1 flex-col lg:justify-center">
          <div className="text-center mb-6">
            <span className="text-[#00E5FF] text-sm lg:text-base uppercase tracking-wider">Question {currentLevel}</span>
            <h2 className={`text-2xl sm:text-4xl lg:text-6xl font-bold lg:font-black font-['Chivo'] ${currentMoney.checkpoint ? 'text-[#00E5FF]' : 'text-[#FFD700]'} text-glow-gold`}>
              {currentMoney.display}
            </h2>
          </div>

          <motion.div
            className="question-frame p-6 sm:p-8 lg:px-11 lg:py-9 mb-6 w-full"
            key={currentLevel}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-lg sm:text-2xl lg:text-[38px] lg:leading-tight text-center font-medium" style={{ color: 'var(--text-primary)' }} data-testid="question-text">
              {currentQuestion.question}
            </p>
          </motion.div>

          <div className="grid min-w-0 w-full max-w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-x-6 lg:gap-y-5 mb-6">
            {(() => {
              const hasWrong = answerStates.some((s) => s === 'wrong');
              const isInteractive =
                gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.SELECTED;
              return currentQuestion.answers.map((answer, index) => (
                <AnswerButton
                  key={index}
                  index={index}
                  answer={answer}
                  state={answerStates[index]}
                  onClick={handleSelectAnswer}
                  disabled={!isInteractive}
                  audiencePercent={audienceResults ? audienceResults[index] : undefined}
                  wrongOutcomeReveal={answerStates[index] === 'correct' && hasWrong}
                  concealed={index >= revealedCount}
                  dimmed={isAnswerLocked && answerStates[index] === 'default'}
                />
              ));
            })()}
          </div>

          {/* Emplacement de hauteur fixe sur grand écran : le bloc est centré verticalement, donc des
              boutons de hauteur variable (révélation, dernier mot, verdict) le feraient sauter à chaque étape. */}
          <div className="relative lg:h-28" data-testid="host-actions-slot">
          <AnimatePresence>
            {gameState === GAME_STATES.PLAYING && !allAnswersRevealed && (
              <motion.div
                className="host-reveal-bar flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto w-full min-w-0 px-1 lg:absolute lg:inset-x-0 lg:top-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <button
                  type="button"
                  className="btn-primary text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                  onClick={handleRevealNextAnswer}
                  data-testid="reveal-next-answer-btn"
                >
                  Afficher la réponse {ANSWER_LETTERS[revealedCount]}
                  <kbd className="hidden sm:inline-block">Espace</kbd>
                </button>
                <button
                  type="button"
                  className="btn-secondary text-sm w-full sm:w-auto"
                  onClick={handleRevealAllAnswers}
                  data-testid="reveal-all-answers-btn"
                >
                  Tout afficher
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {gameState === GAME_STATES.SELECTED && (
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto w-full min-w-0 px-1 lg:absolute lg:inset-x-0 lg:top-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <button
                  className="btn-secondary flex-1 w-full sm:w-auto"
                  onClick={handleCancelSelection}
                  data-testid="cancel-answer-btn"
                >
                  Annuler
                </button>
                <button
                  className="btn-primary flex-1 w-full sm:w-auto text-sm sm:text-base py-3 sm:py-4 leading-tight"
                  onClick={handleConfirmAnswer}
                  data-testid="confirm-answer-btn"
                >
                  C'est mon dernier mot !
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {gameState === GAME_STATES.AWAITING_REVEAL && (
              <motion.div
                className="flex flex-col items-center gap-3 max-w-md mx-auto w-full lg:absolute lg:inset-x-0 lg:top-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <motion.button
                  className="btn-primary flex items-center justify-center gap-2 px-8 py-3 text-base sm:text-lg font-bold shadow-[0_0_24px_rgba(255,215,0,0.35)] border border-[#FFD700]/50"
                  onClick={handleRevealAnswer}
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                  data-testid="reveal-answer-btn"
                >
                  <Eye size={20} />
                  Révéler la réponse
                </motion.button>
                <p className="host-reveal-bar text-[#FFD700] text-xs uppercase tracking-widest text-center">
                  Prêt pour le verdict ? <kbd className="hidden sm:inline-block normal-case text-[#FFD700]">Espace</kbd>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {gameState === GAME_STATES.REVEALING && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
            </motion.div>
          )}
          </div>
          </div>
          </div>
        </div>

        <MoneyTree
          currentLevel={currentLevel}
          highlightLevel={moneyTreeHighlight}
          flash={moneyTreeFlash}
          isOpen={showMoneyTree}
          onClose={closeMoneyTree}
          onSelectLevel={handleSelectMoneyLevel}
        />
      </div>

      <div className="mobile-action-bar lg:hidden">
        <button
          className="btn-secondary text-sm flex-1"
          onClick={openWalkAwayConfirm}
          disabled={gameState !== GAME_STATES.PLAYING}
          data-testid="walk-away-btn-mobile"
        >
          Partir avec {currentLevel > 1 ? MONEY_LEVELS[currentLevel - 2].display : '0 €'}
        </button>
        <button
          className="btn-secondary text-sm"
          onClick={openMoneyTree}
          data-testid="show-money-tree-btn-mobile"
        >
          Gains
        </button>
      </div>

      <PhoneFriendDialog
        isOpen={showPhoneDialog}
        response={phoneResponse}
        onClose={closePhoneDialog}
      />

      <AnimatePresence>
        {(gameState === GAME_STATES.INTRO || gameState === GAME_STATES.TRANSITION) && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-0 overflow-x-hidden overflow-y-auto bg-[#0B0B1A]/85 px-3 py-8 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            data-testid="transition-overlay"
          >
            <motion.div
              className="text-center px-6"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <p className="text-[#00E5FF] text-sm sm:text-base uppercase tracking-[0.3em] mb-4">
                {`Question ${overlayLevel}`}
              </p>
              <motion.h1
                className={`text-3xl sm:text-6xl lg:text-7xl font-black font-['Chivo'] break-words px-1 ${
                  overlayMoney.checkpoint ? 'text-[#00E5FF] text-glow-cyan' : 'text-[#FFD700] text-glow-gold'
                }`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              >
                Pour{' '}
                {gameState === GAME_STATES.TRANSITION ? (
                  <AnimatedAmount
                    key={overlayLevel}
                    from={MONEY_LEVELS[overlayLevel - 2]?.amount ?? 0}
                    to={overlayMoney.amount}
                    durationMs={1400}
                    delayMs={350}
                    className="tabular-nums"
                  />
                ) : (
                  overlayMoney.display
                )}
              </motion.h1>
              {overlayMoney.checkpoint && gameState === GAME_STATES.TRANSITION && (
                <p className="text-[#00E5FF] text-sm sm:text-base mt-6 uppercase tracking-widest">
                  Palier garanti
                </p>
              )}
            </motion.div>
            {gameState === GAME_STATES.INTRO && showIntroStartButton && (
              <button
                type="button"
                className={OVERLAY_CTA_CLASSES}
                onClick={handleBeginIntroGame}
                data-testid="begin-game-btn"
              >
                Débuter la partie
              </button>
            )}
            {gameState === GAME_STATES.TRANSITION &&
              isAwaitingNextQuestionClick &&
              overlayLevel >= 6 && (
                <button
                  type="button"
                  className={OVERLAY_CTA_CLASSES}
                  onClick={handleContinueToNextQuestion}
                  data-testid="next-question-after-amount-btn"
                >
                  Question suivante
                </button>
              )}
          </motion.div>
        )}
      </AnimatePresence>

      <AudienceResults
        isOpen={showAudienceDialog}
        results={audienceResults}
        message={audienceMessage}
        onClose={closeAudienceDialog}
      />
      <ConfirmActionModal
        isOpen={Boolean(confirmAction)}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={confirmButtonLabel}
        onCancel={closeConfirmModal}
        onConfirm={confirmCurrentAction}
      />
    </div>
  );
};
