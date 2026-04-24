import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Home, RotateCcw, Clock, Eye } from 'lucide-react';
import { AnswerButton } from '../components/AnswerButton';
import { MoneyTree } from '../components/MoneyTree';
import { ConfirmActionModal } from '../components/ConfirmActionModal';
import { Jokers, PhoneFriendDialog, AudienceResults } from '../components/Jokers';
import { TimerDisplay } from '../components/TimerDisplay';
import { MONEY_LEVELS } from '../utils/gameData';
import { useGame } from '../hooks/useGame';
import { GAME_STATES } from '../game/gameConstants';

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
    timerEnabled,
    timeRemaining,
    isAwaitingNextQuestionClick,
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

  const openHomeConfirm = () => setConfirmAction('home');
  const openWalkAwayConfirm = () => {
    if (gameState !== GAME_STATES.PLAYING) return;
    setConfirmAction('walkaway');
  };

  const closeConfirmModal = () => setConfirmAction(null);
  const confirmCurrentAction = () => {
    if (confirmAction === 'home') {
      navigate('/');
    } else if (confirmAction === 'walkaway') {
      handleWalkAway();
    }
    setConfirmAction(null);
  };

  const confirmTitle = confirmAction === 'home' ? 'Retourner au menu ?' : 'Partir avec vos gains ?';
  const confirmDescription = confirmAction === 'home'
    ? 'Vous allez quitter la partie en cours.'
    : `Vous allez repartir avec ${currentLevel > 1 ? MONEY_LEVELS[currentLevel - 2].display : '0 €'}.`;
  const confirmButtonLabel = confirmAction === 'home' ? 'Oui, quitter' : 'Oui, partir';

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
    const winAmount = gameState === GAME_STATES.MILLION
      ? MONEY_LEVELS[14].display
      : gameState === GAME_STATES.WON
        ? (currentLevel > 1 ? MONEY_LEVELS[currentLevel - 2].display : '0 €')
        : guaranteedMoney.display;

    return (
      <div className="min-h-screen relative w-full max-w-full overflow-x-hidden flex items-center justify-center p-6">
        <div className="game-fixed-bg" />
        <div className="absolute inset-0 max-w-full" style={{ background: 'var(--overlay-screen)' }} />

        <motion.div
          className="relative z-10 glass rounded-2xl p-5 sm:p-8 max-w-lg w-full min-w-0 max-h-[min(90dvh,90vh)] overflow-y-auto text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          data-testid="game-over-screen"
        >
          {gameState === GAME_STATES.MILLION ? (
            <>
              <motion.h1
                className="text-4xl sm:text-5xl font-black font-['Chivo'] text-[#FFD700] mb-4 text-glow-gold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                MILLIONNAIRE !
              </motion.h1>
              <p className="text-[#00E5FF] text-xl mb-2">Félicitations !</p>
            </>
          ) : gameState === GAME_STATES.WON ? (
            <>
              <h1 className="text-3xl font-bold font-['Chivo'] text-[#00E5FF] mb-4">
                Bien joué !
              </h1>
              <p className="text-[#B0B0C0] mb-2">Vous repartez avec</p>
            </>
          ) : gameState === GAME_STATES.TIMEOUT ? (
            <>
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Clock className="mx-auto text-[#D32F2F]" size={64} />
              </motion.div>
              <h1 className="text-3xl font-bold font-['Chivo'] text-[#D32F2F] mb-4">
                Temps écoulé !
              </h1>
              <p className="text-[#B0B0C0] mb-2">Vous repartez avec</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold font-['Chivo'] text-[#D32F2F] mb-4">
                Mauvaise réponse !
              </h1>
              <p className="text-[#B0B0C0] mb-2">Vous repartez avec</p>
            </>
          )}

          <p className="text-4xl font-black font-['Chivo'] text-[#FFD700] mb-8 text-glow-gold">
            {winAmount}
          </p>

          {gameMode === 'multi' && (
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Scores</h3>
              {playerNames.map((name, idx) => (
                <div key={idx} className="flex justify-between text-[#B0B0C0]">
                  <span>{name}</span>
                  <span className="text-[#FFD700]">{scores[idx].toLocaleString()} €</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              onClick={handleRestart}
              data-testid="restart-btn"
            >
              <RotateCcw size={20} />
              Rejouer
            </button>
            <button
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
              onClick={openHomeConfirm}
              data-testid="home-btn"
            >
              <Home size={20} />
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
      <div className="absolute inset-0 max-w-full" style={{ background: 'var(--overlay-screen)' }} />

      <div className="relative z-10 flex min-h-screen w-full max-w-full min-w-0 flex-col lg:flex-row">
        <div className="flex min-w-0 w-full max-w-full flex-1 flex-col p-4 pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6 sm:p-6 lg:pr-72">
          <div className="flex items-start sm:items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <button
                className="p-2 rounded-full transition-colors"
                style={{ background: 'var(--top-btn-bg)' }}
                onClick={openHomeConfirm}
                data-testid="back-home-btn"
              >
                <Home size={20} style={{ color: 'var(--text-primary)' }} />
              </button>
              <button
                className="p-2 rounded-full transition-colors"
                style={{ background: 'var(--top-btn-bg)' }}
                onClick={toggleMute}
                data-testid="mute-btn"
              >
                {isMuted
                  ? <VolumeX size={20} style={{ color: 'var(--text-primary)' }} />
                  : <Volume2 size={20} style={{ color: 'var(--text-primary)' }} />}
              </button>
              {timerEnabled && <TimerDisplay timeRemaining={timeRemaining} />}
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
              disabled={gameState !== GAME_STATES.PLAYING}
            />
          </div>

          <div className="text-center mb-6">
            <span className="text-[#00E5FF] text-sm uppercase tracking-wider">Question {currentLevel}</span>
            <h2 className={`text-2xl sm:text-3xl font-bold font-['Chivo'] ${currentMoney.checkpoint ? 'text-[#00E5FF]' : 'text-[#FFD700]'} text-glow-gold`}>
              {currentMoney.display}
            </h2>
          </div>

          <motion.div
            className="question-frame p-6 sm:p-8 mb-6 max-w-4xl mx-auto w-full"
            key={currentLevel}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-lg sm:text-xl lg:text-2xl text-center font-medium" style={{ color: 'var(--text-primary)' }} data-testid="question-text">
              {currentQuestion.question}
            </p>
          </motion.div>

          <div className="grid min-w-0 w-full max-w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-4xl sm:mx-auto mb-6">
            {currentQuestion.answers.map((answer, index) => (
              <AnswerButton
                key={index}
                index={index}
                answer={answer}
                state={answerStates[index]}
                onClick={handleSelectAnswer}
                disabled={gameState !== GAME_STATES.PLAYING && gameState !== GAME_STATES.SELECTED}
                audiencePercent={audienceResults ? audienceResults[index] : undefined}
              />
            ))}
          </div>

          <AnimatePresence>
            {gameState === GAME_STATES.SELECTED && (
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto w-full min-w-0 px-1"
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
                className="flex flex-col items-center gap-3 max-w-md mx-auto w-full"
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
                <p className="text-[#FFD700] text-xs uppercase tracking-widest text-center">
                  Prêt pour le verdict ?
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

        <MoneyTree
          currentLevel={currentLevel}
          isOpen={showMoneyTree}
          onClose={() => setShowMoneyTree(false)}
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
          Partir ({currentLevel > 1 ? MONEY_LEVELS[currentLevel - 2].display : '0 €'})
        </button>
        <button
          className="btn-secondary text-sm"
          onClick={() => setShowMoneyTree(true)}
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
                {gameState === GAME_STATES.INTRO ? 'Prêt ?' : `Question ${overlayLevel}`}
              </p>
              <motion.h1
                className={`text-3xl sm:text-6xl lg:text-7xl font-black font-['Chivo'] break-words px-1 ${
                  overlayMoney.checkpoint ? 'text-[#00E5FF] text-glow-cyan' : 'text-[#FFD700] text-glow-gold'
                }`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              >
                {gameState === GAME_STATES.INTRO
                  ? `${MONEY_LEVELS[0].display}`
                  : `Pour ${overlayMoney.display}`}
              </motion.h1>
              {overlayMoney.checkpoint && gameState === GAME_STATES.TRANSITION && (
                <p className="text-[#00E5FF] text-sm sm:text-base mt-6 uppercase tracking-widest">
                  Palier garanti
                </p>
              )}
            </motion.div>
            {gameState === GAME_STATES.TRANSITION &&
              isAwaitingNextQuestionClick &&
              overlayLevel >= 6 && (
                <button
                  type="button"
                  className="btn-primary mt-10 px-8 py-3 text-base sm:text-lg font-bold shadow-[0_0_24px_rgba(255,215,0,0.35)] border border-[#FFD700]/50 transition-none"
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
