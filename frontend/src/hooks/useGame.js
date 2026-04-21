import { useState, useEffect, useCallback, useRef } from 'react';
import {
  MONEY_LEVELS,
  getGuaranteedAmount,
  getPhoneResponse,
  generateAudienceResults,
} from '../utils/gameData';
import { soundManager } from '../utils/sounds';
import {
  GAME_STATES,
  DEFAULT_ANSWER_STATES,
  OUTCOME_MIN_MS,
  OUTCOME_MAX_MS,
  LETSPLAY_MIN_MS,
  LETSPLAY_MAX_MS,
  INTRO_MAX_MS,
  SILENCE_BETWEEN_MS,
  TRANSITION_OVERLAY_LEAD_MS,
  MANUAL_REVEAL_ENABLED,
} from '../game/gameConstants';
import { sleep, waitForSound } from '../game/gameAudio';
import { pickTwoWrongAnswersToEliminate } from '../game/jokerUtils';
import { useGameTimer } from './useGameTimer';

export function useGame(navigate) {
  const [questions, setQuestions] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState(GAME_STATES.PLAYING);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerStates, setAnswerStates] = useState(DEFAULT_ANSWER_STATES);

  const [usedJokers, setUsedJokers] = useState({ fifty: false, phone: false, audience: false });
  const [eliminatedAnswers, setEliminatedAnswers] = useState([]);
  const [phoneResponse, setPhoneResponse] = useState(null);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [audienceResults, setAudienceResults] = useState(null);
  const [audienceMessage, setAudienceMessage] = useState('');
  const [showAudienceDialog, setShowAudienceDialog] = useState(false);

  const {
    timerEnabled,
    setTimerEnabled,
    timerDuration,
    setTimerDuration,
    timeRemaining,
    setTimeRemaining,
    timerPaused,
    setTimerPaused,
  } = useGameTimer({ gameState, setGameState, currentLevel });

  const isManualRevealActive = MANUAL_REVEAL_ENABLED && currentLevel >= 6;
  const revealResolverRef = useRef(null);
  const nextQuestionResolverRef = useRef(null);
  const phoneResponseTimeoutRef = useRef(null);
  const audienceResponseTimeoutRef = useRef(null);
  const audienceMessageTimeoutsRef = useRef([]);
  const [isAwaitingNextQuestionClick, setIsAwaitingNextQuestionClick] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [showMoneyTree, setShowMoneyTree] = useState(false);
  const [transitionLevel, setTransitionLevel] = useState(null);

  const [gameMode, setGameMode] = useState('solo');
  const [playerNames, setPlayerNames] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState([0, 0]);

  const runIntroToPlaying = useCallback(async (isCancelled = () => false) => {
    const introPromise = soundManager.playGameStart();
    await waitForSound(introPromise, 0, INTRO_MAX_MS);
    await sleep(SILENCE_BETWEEN_MS);
    if (isCancelled()) return;
    setGameState(GAME_STATES.PLAYING);
    soundManager.playBed(1);
  }, []);

  const resetRoundState = useCallback(() => {
    setSelectedAnswer(null);
    setAnswerStates(DEFAULT_ANSWER_STATES);
    setEliminatedAnswers([]);
    setAudienceResults(null);
    setAudienceMessage('');
  }, []);

  useEffect(() => {
    const storedQuestions = sessionStorage.getItem('gameQuestions');
    const storedMode = sessionStorage.getItem('gameMode');
    const storedNames = sessionStorage.getItem('playerNames');
    const storedTimerEnabled = sessionStorage.getItem('timerEnabled');
    const storedTimerDuration = sessionStorage.getItem('timerDuration');

    if (!storedQuestions) {
      navigate('/setup');
      return;
    }

    setQuestions(JSON.parse(storedQuestions));
    setGameMode(storedMode || 'solo');
    if (storedNames) {
      setPlayerNames(JSON.parse(storedNames));
    }

    if (storedTimerEnabled) {
      const enabled = JSON.parse(storedTimerEnabled);
      setTimerEnabled(enabled);
      if (storedTimerDuration) {
        const duration = JSON.parse(storedTimerDuration);
        setTimerDuration(duration);
        setTimeRemaining(duration);
      }
    }

    soundManager.init();
    setGameState(GAME_STATES.INTRO);
    let cancelled = false;
    void runIntroToPlaying(() => cancelled);

    return () => {
      cancelled = true;
      if (phoneResponseTimeoutRef.current) {
        clearTimeout(phoneResponseTimeoutRef.current);
        phoneResponseTimeoutRef.current = null;
      }
      if (audienceResponseTimeoutRef.current) {
        clearTimeout(audienceResponseTimeoutRef.current);
        audienceResponseTimeoutRef.current = null;
      }
      audienceMessageTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      audienceMessageTimeoutsRef.current = [];
      soundManager.stopPhoneFriend();
      soundManager.stopAskAudience();
      soundManager.stopBackground();
      soundManager.stopTimerTick();
    };
  }, [navigate, runIntroToPlaying, setTimerEnabled, setTimerDuration, setTimeRemaining]);

  const currentQuestion = questions[currentLevel - 1];
  const currentMoney = MONEY_LEVELS[currentLevel - 1];
  const guaranteedMoney = getGuaranteedAmount(currentLevel);
  const overlayLevel = transitionLevel ?? currentLevel;
  const overlayMoney = MONEY_LEVELS[overlayLevel - 1] ?? MONEY_LEVELS[0];

  const handleSelectAnswer = useCallback(
    (index) => {
      if (gameState !== GAME_STATES.PLAYING || eliminatedAnswers.includes(index)) return;

      setSelectedAnswer(index);
      setGameState(GAME_STATES.SELECTED);
      setTimerPaused(true);

      setAnswerStates((prev) => prev.map((s, i) => (i === index ? 'selected' : s)));
    },
    [gameState, eliminatedAnswers, setTimerPaused],
  );

  const handleConfirmAnswer = useCallback(async () => {
    if (gameState !== GAME_STATES.SELECTED || selectedAnswer === null) return;

    setGameState(GAME_STATES.REVEALING);
    soundManager.playFinalAnswer(currentLevel);
    soundManager.stopTimerTick();

    if (isManualRevealActive) {
      setGameState(GAME_STATES.AWAITING_REVEAL);
      await new Promise((resolve) => {
        revealResolverRef.current = resolve;
      });
      revealResolverRef.current = null;
      setGameState(GAME_STATES.REVEALING);
      await sleep(SILENCE_BETWEEN_MS);
    }

    const isCorrect = selectedAnswer === currentQuestion.correctIndex;

    if (isCorrect) {
      setAnswerStates((prev) => prev.map((s, i) => (i === selectedAnswer ? 'correct' : s)));
      const winPromise = soundManager.playCorrect(currentLevel);

      if (currentLevel === 15) {
        setGameState(GAME_STATES.MILLION);
        return;
      }

      await waitForSound(winPromise, OUTCOME_MIN_MS, OUTCOME_MAX_MS);
      await sleep(SILENCE_BETWEEN_MS);

      const nextLevel = currentLevel + 1;
      setTransitionLevel(nextLevel);
      setGameState(GAME_STATES.TRANSITION);
      await sleep(TRANSITION_OVERLAY_LEAD_MS);
      setCurrentLevel(nextLevel);
      resetRoundState();
      if (gameMode === 'multi') {
        setCurrentPlayer((prev) => (prev + 1) % 2);
      }

      const letsPlayPromise = soundManager.playLetsPlay(nextLevel);
      await waitForSound(letsPlayPromise, LETSPLAY_MIN_MS, LETSPLAY_MAX_MS);
      await sleep(SILENCE_BETWEEN_MS);

      if (nextLevel >= 6) {
        setIsAwaitingNextQuestionClick(true);
        await new Promise((resolve) => {
          nextQuestionResolverRef.current = resolve;
        });
        nextQuestionResolverRef.current = null;
        setIsAwaitingNextQuestionClick(false);
      }

      setGameState(GAME_STATES.PLAYING);
      setTransitionLevel(null);
      setTimerPaused(false);
      soundManager.playBed(nextLevel);
    } else {
      setAnswerStates((prev) =>
        prev.map((s, i) => {
          if (i === selectedAnswer) return 'wrong';
          if (i === currentQuestion.correctIndex) return 'correct';
          return s;
        }),
      );
      const losePromise = soundManager.playWrong(currentLevel);

      if (gameMode === 'multi') {
        setScores((prev) => {
          const newScores = [...prev];
          newScores[currentPlayer] = guaranteedMoney.amount;
          return newScores;
        });
      }

      await Promise.all([Promise.resolve(losePromise), sleep(OUTCOME_MIN_MS)]);
      setGameState(GAME_STATES.LOST);
      soundManager.playGoodbye();
    }
  }, [
    gameState,
    selectedAnswer,
    currentQuestion,
    currentLevel,
    gameMode,
    currentPlayer,
    guaranteedMoney,
    isManualRevealActive,
    resetRoundState,
    setTimerPaused,
  ]);

  const handleContinueToNextQuestion = useCallback(() => {
    if (gameState !== GAME_STATES.TRANSITION) return;
    const resolver = nextQuestionResolverRef.current;
    if (resolver) resolver();
  }, [gameState]);

  const handleRevealAnswer = useCallback(() => {
    if (gameState !== GAME_STATES.AWAITING_REVEAL) return;
    const resolver = revealResolverRef.current;
    if (resolver) resolver();
  }, [gameState]);

  const handleCancelSelection = useCallback(() => {
    if (gameState !== GAME_STATES.SELECTED) return;
    setSelectedAnswer(null);
    setGameState(GAME_STATES.PLAYING);
    setTimerPaused(false);
    setAnswerStates(DEFAULT_ANSWER_STATES);
  }, [gameState, setTimerPaused]);

  const handleFiftyFifty = useCallback(() => {
    if (usedJokers.fifty || gameState !== GAME_STATES.PLAYING) return;

    soundManager.playFiftyFifty();
    setUsedJokers((prev) => ({ ...prev, fifty: true }));

    const toEliminate = pickTwoWrongAnswersToEliminate(currentQuestion.correctIndex);

    setEliminatedAnswers(toEliminate);
    setAnswerStates((prev) => prev.map((s, i) => (toEliminate.includes(i) ? 'eliminated' : s)));
  }, [usedJokers.fifty, gameState, currentQuestion]);

  const handlePhoneFriend = useCallback(() => {
    if (usedJokers.phone || gameState !== GAME_STATES.PLAYING) return;

    soundManager.stopBed();
    setUsedJokers((prev) => ({ ...prev, phone: true }));
    setTimerPaused(true);
    setShowPhoneDialog(true);
    void soundManager.playPhoneFriend();
    setPhoneResponse({
      message: "L'ami réfléchit...",
      confidence: null,
      isPending: true,
    });


    const thinkingDurationMs = Math.floor(Math.random() * 8000) + 13000;
    phoneResponseTimeoutRef.current = setTimeout(() => {
      const correctAnswer = currentQuestion.answers[currentQuestion.correctIndex];
      const response = getPhoneResponse(correctAnswer, currentQuestion.answers);
      setPhoneResponse({ ...response, isPending: false });
      phoneResponseTimeoutRef.current = null;
    }, thinkingDurationMs);
  }, [usedJokers.phone, gameState, currentQuestion, setTimerPaused]);

  // Audience Dialog
  const handleAskAudience = useCallback(() => {
    if (usedJokers.audience || gameState !== GAME_STATES.PLAYING) return;

    soundManager.stopBed();
    soundManager.playAskAudience();
    setUsedJokers((prev) => ({ ...prev, audience: true }));
    setTimerPaused(true);
    setAudienceResults(null);
    setAudienceMessage('Le public prend connaissance de la question...');
    setShowAudienceDialog(true);
    audienceMessageTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    audienceMessageTimeoutsRef.current = [
      setTimeout(() => {
        setAudienceMessage('Le public vote...');
      }, 16000),
      setTimeout(() => {
        setAudienceMessage('Vote terminé, envoi des résultats...');
      },29000),
    ];

    audienceResponseTimeoutRef.current = setTimeout(() => {
      const results = generateAudienceResults(currentQuestion.correctIndex, eliminatedAnswers);
      setAudienceResults(results);
      setAudienceMessage('Résultats du public');
      audienceMessageTimeoutsRef.current = [];
      audienceResponseTimeoutRef.current = null;
    }, 32000);
  }, [usedJokers.audience, gameState, currentQuestion, eliminatedAnswers, setTimerPaused]);

  const closePhoneDialog = useCallback(() => {
    if (phoneResponseTimeoutRef.current) {
      clearTimeout(phoneResponseTimeoutRef.current);
      phoneResponseTimeoutRef.current = null;
    }
    setShowPhoneDialog(false);
    setTimerPaused(false);
    soundManager.stopPhoneFriend();
    soundManager.playBed(currentLevel);
  }, [currentLevel, setTimerPaused]);

  const closeAudienceDialog = useCallback(() => {
    if (audienceResponseTimeoutRef.current) {
      clearTimeout(audienceResponseTimeoutRef.current);
      audienceResponseTimeoutRef.current = null;
    }
    audienceMessageTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    audienceMessageTimeoutsRef.current = [];
    setShowAudienceDialog(false);
    setAudienceMessage('');
    setTimerPaused(false);
    soundManager.stopAskAudience();
    soundManager.playBed(currentLevel);
  }, [currentLevel, setTimerPaused]);

  const handleSelectMoneyLevel = useCallback(
    (level) => {
      if (gameState !== GAME_STATES.PLAYING) return;
      if (!Number.isInteger(level) || level < 1 || level > questions.length) return;
      if (level === currentLevel) return;

      setCurrentLevel(level);
      setGameState(GAME_STATES.PLAYING);
      setTimerPaused(false);
      resetRoundState();
      soundManager.playBed(level);
      setShowMoneyTree(false);
    },
    [gameState, questions.length, currentLevel, resetRoundState, setTimerPaused],
  );

  const toggleMute = useCallback(() => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
  }, []);

  const handleWalkAway = useCallback(() => {
    soundManager.stopTimerTick();
    soundManager.stopBed();
    soundManager.playGoodbye();
    if (gameMode === 'multi') {
      setScores((prev) => {
        const newScores = [...prev];
        newScores[currentPlayer] = currentLevel > 1 ? MONEY_LEVELS[currentLevel - 2].amount : 0;
        return newScores;
      });
    }
    setGameState(GAME_STATES.WON);
  }, [gameMode, currentPlayer, currentLevel]);

  const handleRestart = useCallback(() => {
    setCurrentLevel(1);
    setTransitionLevel(null);
    resetRoundState();
    setUsedJokers({ fifty: false, phone: false, audience: false });
    setCurrentPlayer(0);
    setScores([0, 0]);
    setTimeRemaining(timerDuration);
    setTimerPaused(false);
    nextQuestionResolverRef.current = null;
    setIsAwaitingNextQuestionClick(false);
    setGameState(GAME_STATES.INTRO);
    void runIntroToPlaying(() => false);
  }, [resetRoundState, timerDuration, runIntroToPlaying, setTimeRemaining, setTimerPaused]);

  return {
    currentLevel,
    gameState,
    selectedAnswer,
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
  };
}
