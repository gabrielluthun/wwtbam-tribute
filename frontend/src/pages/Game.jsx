import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Menu, Home, RotateCcw, Clock, Eye } from 'lucide-react';
import { AnswerButton } from '../components/AnswerButton';
import { MoneyTree } from '../components/MoneyTree';
import { Jokers, PhoneFriendDialog, AudienceResults } from '../components/Jokers';
import { 
  MONEY_LEVELS, 
  getGuaranteedAmount, 
  getPhoneResponse, 
  generateAudienceResults,
} from '../utils/gameData';
import { soundManager } from '../utils/sounds';

const GAME_STATES = {
  INTRO: 'intro',
  PLAYING: 'playing',
  SELECTED: 'selected',
  REVEALING: 'revealing',
  AWAITING_REVEAL: 'awaiting_reveal', // Mode manuel : on attend que l'animateur revele
  TRANSITION: 'transition',
  WON: 'won',
  LOST: 'lost',
  MILLION: 'million',
  TIMEOUT: 'timeout',
};

// Pauses "respiration" entre les sons pour fluidifier les transitions TV
const DRAMATIC_PAUSE_MS = 0;  // Pause dramatique apres "Final Answer"
const OUTCOME_MIN_MS = 2500;     // Duree minimale de l'ecran resultat
const OUTCOME_MAX_MS = 10000;     // Duree maximale (coupe les stingers longs)
const LETSPLAY_MIN_MS = 1500;    // Duree minimale d'affichage de "Pour x€"
const LETSPLAY_MAX_MS = 4500;    // Duree max d'attente du "Let's Play"
const INTRO_MAX_MS = 3500;       // Duree max d'attente du jingle d'ouverture
const SILENCE_BETWEEN_MS = 0;  // Petit silence entre deux sons
const TRANSITION_OVERLAY_LEAD_MS = 300 ; // Laisse l'overlay apparaitre avant la nouvelle question

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Attend la fin du son (ou minMs si plus long), cappe a maxMs
const waitForSound = (soundPromise, minMs = 0, maxMs = 8000) =>
  Promise.race([
    Promise.all([Promise.resolve(soundPromise), sleep(minMs)]),
    sleep(maxMs),
  ]);

const DEFAULT_ANSWER_STATES = ['default', 'default', 'default', 'default'];

export const Game = () => {
  const navigate = useNavigate();
  
  // Game state
  const [questions, setQuestions] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState(GAME_STATES.PLAYING);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerStates, setAnswerStates] = useState(DEFAULT_ANSWER_STATES);
  
  // Jokers
  const [usedJokers, setUsedJokers] = useState({ fifty: false, phone: false, audience: false });
  const [eliminatedAnswers, setEliminatedAnswers] = useState([]);
  const [phoneResponse, setPhoneResponse] = useState(null);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [audienceResults, setAudienceResults] = useState(null);
  const [showAudienceDialog, setShowAudienceDialog] = useState(false);
  
  // Timer state
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerPaused, setTimerPaused] = useState(false);
  const timerRef = useRef(null);
  
  // Reveal mode active from question 6 included.
  const manualReveal = true;
  const isManualRevealActive = manualReveal && currentLevel >= 6;
  // Promise resolver utilise pour reprendre le flux async quand le bouton est clique
  const revealResolverRef = useRef(null);
  
  // UI state
  const [isMuted, setIsMuted] = useState(false);
  const [showMoneyTree, setShowMoneyTree] = useState(false);
  const [transitionLevel, setTransitionLevel] = useState(null);
  
  // Multiplayer
  const [gameMode, setGameMode] = useState('solo');
  const [playerNames, setPlayerNames] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState([0, 0]);

  const playIntroSequence = useCallback(async () => {
    const introPromise = soundManager.playGameStart();
    await waitForSound(introPromise, 0, INTRO_MAX_MS);
    await sleep(SILENCE_BETWEEN_MS);
    setGameState(GAME_STATES.PLAYING);
    soundManager.playBed(1);
  }, []);

  const resetRoundState = useCallback(() => {
    setSelectedAnswer(null);
    setAnswerStates(DEFAULT_ANSWER_STATES);
    setEliminatedAnswers([]);
  }, []);

  // Load game data
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
    
    // Load timer settings
    if (storedTimerEnabled) {
      const enabled = JSON.parse(storedTimerEnabled);
      setTimerEnabled(enabled);
      if (storedTimerDuration) {
        const duration = JSON.parse(storedTimerDuration);
        setTimerDuration(duration);
        setTimeRemaining(duration);
      }
    }
    
    // Initialisation : passage en INTRO avec jingle d'ouverture puis gameplay
    soundManager.init();
    setGameState(GAME_STATES.INTRO);
    let cancelled = false;
    (async () => {
      const introPromise = soundManager.playGameStart();
      await waitForSound(introPromise, 0, INTRO_MAX_MS);
      if (cancelled) return;
      await sleep(SILENCE_BETWEEN_MS);
      if (cancelled) return;
      setGameState(GAME_STATES.PLAYING);
      soundManager.playBed(1);
    })();
    
    return () => {
      cancelled = true;
      soundManager.stopBackground();
      soundManager.stopTimerTick();
    };
  }, [navigate]);

  // Timer effect
  useEffect(() => {
    if (!timerEnabled || gameState !== GAME_STATES.PLAYING || timerPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        soundManager.stopTimerTick();
      }
      return;
    }

    // Start timer tick sound
    soundManager.startTimerTick();

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          soundManager.playTimerExpired();
          setGameState(GAME_STATES.TIMEOUT);
          return 0;
        }
        
        // Warning sound at 10 seconds
        if (prev === 11) {
          soundManager.playTimerWarning();
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      soundManager.stopTimerTick();
    };
  }, [timerEnabled, gameState, timerPaused, currentLevel]);

  // Reset timer on level change
  useEffect(() => {
    if (timerEnabled) {
      setTimeRemaining(timerDuration);
    }
  }, [currentLevel, timerEnabled, timerDuration]);

  const currentQuestion = questions[currentLevel - 1];
  const currentMoney = MONEY_LEVELS[currentLevel - 1];
  const guaranteedMoney = getGuaranteedAmount(currentLevel);
  const overlayLevel = transitionLevel ?? currentLevel;
  const overlayMoney = MONEY_LEVELS[overlayLevel - 1] ?? MONEY_LEVELS[0];

  // Handle answer selection
  const handleSelectAnswer = useCallback((index) => {
    if (gameState !== GAME_STATES.PLAYING || eliminatedAnswers.includes(index)) return;
    
    setSelectedAnswer(index);
    setGameState(GAME_STATES.SELECTED);
    setTimerPaused(true); // Pause timer when answer selected
    
    setAnswerStates(prev => prev.map((s, i) => i === index ? 'selected' : s));
  }, [gameState, eliminatedAnswers]);

  // Confirm final answer - sequence async pour transitions audio/visuel fluides
  const handleConfirmAnswer = useCallback(async () => {
    if (gameState !== GAME_STATES.SELECTED || selectedAnswer === null) return;
    
    setGameState(GAME_STATES.REVEALING);
    // Jingle "Final Answer" du niveau (coupe le bed musical)
    soundManager.playFinalAnswer(currentLevel);
    soundManager.stopTimerTick();
    
    // Mode "animateur" : on attend que le joueur/presentateur clique sur "Reveler"
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
      setAnswerStates(prev => prev.map((s, i) => i === selectedAnswer ? 'correct' : s));
      const winPromise = soundManager.playCorrect(currentLevel);
      
      if (currentLevel === 15) {
        // Pour le million, on laisse le stinger complet se jouer sur l'ecran MILLION
        setGameState(GAME_STATES.MILLION);
        return;
      }
      
      // On laisse le stinger de victoire se jouer (cap a OUTCOME_MAX_MS)
      await waitForSound(winPromise, OUTCOME_MIN_MS, OUTCOME_MAX_MS);
      await sleep(SILENCE_BETWEEN_MS);
      
      // Passage en TRANSITION : on annonce le nouveau palier avant d'afficher la question
      const nextLevel = currentLevel + 1;
      setTransitionLevel(nextLevel);
      setGameState(GAME_STATES.TRANSITION);
      await sleep(TRANSITION_OVERLAY_LEAD_MS);
      setCurrentLevel(nextLevel);
      resetRoundState();
      if (gameMode === 'multi') {
        setCurrentPlayer(prev => (prev + 1) % 2);
      }
      
      // "Let's Play <montant>" : on attend sa fin avant de reveler la question
      const letsPlayPromise = soundManager.playLetsPlay(nextLevel);
      await waitForSound(letsPlayPromise, LETSPLAY_MIN_MS, LETSPLAY_MAX_MS);
      await sleep(SILENCE_BETWEEN_MS);
      
      setGameState(GAME_STATES.PLAYING);
      setTransitionLevel(null);
      setTimerPaused(false);
      soundManager.playBed(nextLevel);
    } else {
      setAnswerStates(prev => prev.map((s, i) => {
        if (i === selectedAnswer) return 'wrong';
        if (i === currentQuestion.correctIndex) return 'correct';
        return s;
      }));
      const losePromise = soundManager.playWrong(currentLevel);
      
      if (gameMode === 'multi') {
        setScores(prev => {
          const newScores = [...prev];
          newScores[currentPlayer] = guaranteedMoney.amount;
          return newScores;
        });
      }
      
      // En cas de defaite, on attend la fin complete du son "lose"
      // (avec un minimum visuel pour laisser le verdict s'installer).
      await Promise.all([Promise.resolve(losePromise), sleep(OUTCOME_MIN_MS)]);
      setGameState(GAME_STATES.LOST);
      soundManager.playGoodbye();
    }
  }, [gameState, selectedAnswer, currentQuestion, currentLevel, gameMode, currentPlayer, guaranteedMoney, isManualRevealActive, resetRoundState]);

  // Declenche la revelation en mode manuel (resout la promise attendue par le flux)
  const handleRevealAnswer = useCallback(() => {
    if (gameState !== GAME_STATES.AWAITING_REVEAL) return;
    const resolver = revealResolverRef.current;
    if (resolver) resolver();
  }, [gameState]);

  // Cancel selection
  const handleCancelSelection = useCallback(() => {
    if (gameState !== GAME_STATES.SELECTED) return;
    setSelectedAnswer(null);
    setGameState(GAME_STATES.PLAYING);
    setTimerPaused(false); // Resume timer
    setAnswerStates(DEFAULT_ANSWER_STATES);
  }, [gameState]);

  // Joker: 50:50
  const handleFiftyFifty = useCallback(() => {
    if (usedJokers.fifty || gameState !== GAME_STATES.PLAYING) return;
    
    soundManager.playFiftyFifty();
    setUsedJokers(prev => ({ ...prev, fifty: true }));
    
    const wrongAnswers = [0, 1, 2, 3].filter(i => i !== currentQuestion.correctIndex);
    // Fisher-Yates shuffle for fairness
    for (let i = wrongAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wrongAnswers[i], wrongAnswers[j]] = [wrongAnswers[j], wrongAnswers[i]];
    }
    const toEliminate = wrongAnswers.slice(0, 2);
    
    setEliminatedAnswers(toEliminate);
    setAnswerStates(prev => prev.map((s, i) => toEliminate.includes(i) ? 'eliminated' : s));
  }, [usedJokers.fifty, gameState, currentQuestion]);

  // Joker: Phone a friend
  const handlePhoneFriend = useCallback(() => {
    if (usedJokers.phone || gameState !== GAME_STATES.PLAYING) return;
    
    soundManager.playPhoneFriend();
    setUsedJokers(prev => ({ ...prev, phone: true }));
    setTimerPaused(true); // Pause timer during joker
    
    const correctAnswer = currentQuestion.answers[currentQuestion.correctIndex];
    const response = getPhoneResponse(correctAnswer, currentQuestion.answers);
    setPhoneResponse(response);
    setShowPhoneDialog(true);
  }, [usedJokers.phone, gameState, currentQuestion]);

  // Joker: Ask the audience
  const handleAskAudience = useCallback(() => {
    if (usedJokers.audience || gameState !== GAME_STATES.PLAYING) return;
    
    soundManager.playAskAudience();
    setUsedJokers(prev => ({ ...prev, audience: true }));
    setTimerPaused(true); // Pause timer during joker
    
    const results = generateAudienceResults(currentQuestion.correctIndex, eliminatedAnswers);
    setAudienceResults(results);
    setShowAudienceDialog(true);
  }, [usedJokers.audience, gameState, currentQuestion, eliminatedAnswers]);

  // Close joker dialogs and resume timer
  const closePhoneDialog = () => {
    setShowPhoneDialog(false);
    setTimerPaused(false);
  };

  const closeAudienceDialog = () => {
    setShowAudienceDialog(false);
    setTimerPaused(false);
  };

  // Easter egg: cliquer un gain dans la pyramide affiche la question associee.
  const handleSelectMoneyLevel = useCallback((level) => {
    if (gameState !== GAME_STATES.PLAYING) return;
    if (!Number.isInteger(level) || level < 1 || level > questions.length) return;
    if (level === currentLevel) return;

    setCurrentLevel(level);
    setGameState(GAME_STATES.PLAYING);
    setTimerPaused(false);
    resetRoundState();
    soundManager.playBed(level);
    setShowMoneyTree(false);
  }, [gameState, questions.length, currentLevel, resetRoundState]);

  // Toggle mute
  const toggleMute = () => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
  };

  // Walk away
  const handleWalkAway = () => {
    soundManager.stopTimerTick();
    soundManager.stopBed();
    soundManager.playGoodbye();
    if (gameMode === 'multi') {
      setScores(prev => {
        const newScores = [...prev];
        newScores[currentPlayer] = currentLevel > 1 ? MONEY_LEVELS[currentLevel - 2].amount : 0;
        return newScores;
      });
    }
    setGameState(GAME_STATES.WON);
  };

  // Restart game
  const handleRestart = () => {
    setCurrentLevel(1);
    setTransitionLevel(null);
    setGameState(GAME_STATES.PLAYING);
    resetRoundState();
    setUsedJokers({ fifty: false, phone: false, audience: false });
    setCurrentPlayer(0);
    setScores([0, 0]);
    setTimeRemaining(timerDuration);
    setTimerPaused(false);
    // Re-declenche la sequence d'intro au redemarrage
    setGameState(GAME_STATES.INTRO);
    playIntroSequence();
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen studio-bg flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  // Timer display component
  const TimerDisplay = () => {
    if (!timerEnabled) return null;
    
    const isWarning = timeRemaining <= 10;
    const isCritical = timeRemaining <= 5;
    
    return (
      <motion.div
        className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          isCritical ? 'bg-red-500/30 text-red-400' :
          isWarning ? 'bg-yellow-500/30 text-yellow-400' :
          'bg-white/10 text-white'
        }`}
        animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
        data-testid="timer-display"
      >
        <Clock size={18} />
        <span className="font-bold font-mono text-lg">
          {timeRemaining}s
        </span>
      </motion.div>
    );
  };

  // End game screens (including timeout)
  if (gameState === GAME_STATES.LOST || gameState === GAME_STATES.WON || gameState === GAME_STATES.MILLION || gameState === GAME_STATES.TIMEOUT) {
    const winAmount = gameState === GAME_STATES.MILLION 
      ? MONEY_LEVELS[14].display 
      : gameState === GAME_STATES.WON 
        ? (currentLevel > 1 ? MONEY_LEVELS[currentLevel - 2].display : '0 €')
        : guaranteedMoney.display;

    return (
      <div className="min-h-screen studio-bg flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[#0B0B1A]/80" />
        
        <motion.div
          className="relative z-10 glass rounded-2xl p-8 max-w-lg w-full text-center"
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
              onClick={() => navigate('/')}
              data-testid="home-btn"
            >
              <Home size={20} />
              Accueil
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen studio-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B1A]/70 via-[#0B0B1A]/50 to-[#0B0B1A]/80" />
      
      <div className="relative z-10 min-h-screen flex">
        {/* Main game area */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:pr-72">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={() => navigate('/')}
                data-testid="back-home-btn"
              >
                <Home size={20} className="text-white" />
              </button>
              <button
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={toggleMute}
                data-testid="mute-btn"
              >
                {isMuted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
              </button>
              <TimerDisplay />
            </div>
            
            {/* Current player indicator (multiplayer) */}
            {gameMode === 'multi' && (
              <div className="text-center">
                <span className="text-[#B0B0C0] text-sm">Tour de</span>
                <p className="text-[#FFD700] font-bold">{playerNames[currentPlayer]}</p>
              </div>
            )}
            
            {/* Money tree toggle (mobile) */}
            <button
              className="lg:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setShowMoneyTree(true)}
              data-testid="show-money-tree-btn"
            >
              <Menu size={20} className="text-white" />
            </button>
            
            {/* Walk away button */}
            <button
              className="btn-secondary text-sm hidden sm:flex"
              onClick={handleWalkAway}
              disabled={gameState !== GAME_STATES.PLAYING}
              data-testid="walk-away-btn"
            >
              Partir avec {currentLevel > 1 ? MONEY_LEVELS[currentLevel - 2].display : '0 €'}
            </button>
          </div>

          {/* Jokers */}
          <div className="mb-6">
            <Jokers
              usedJokers={usedJokers}
              onFiftyFifty={handleFiftyFifty}
              onPhoneFriend={handlePhoneFriend}
              onAskAudience={handleAskAudience}
              disabled={gameState !== GAME_STATES.PLAYING}
            />
          </div>

          {/* Current level indicator */}
          <div className="text-center mb-6">
            <span className="text-[#00E5FF] text-sm uppercase tracking-wider">Question {currentLevel}</span>
            <h2 className={`text-2xl sm:text-3xl font-bold font-['Chivo'] ${currentMoney.checkpoint ? 'text-[#00E5FF]' : 'text-[#FFD700]'} text-glow-gold`}>
              {currentMoney.display}
            </h2>
          </div>

          {/* Question */}
          <motion.div
            className="question-frame p-6 sm:p-8 mb-6 max-w-4xl mx-auto w-full"
            key={currentLevel}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-white text-lg sm:text-xl lg:text-2xl text-center font-medium" data-testid="question-text">
              {currentQuestion.question}
            </p>
          </motion.div>

          {/* Answers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto w-full mb-6">
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

          {/* Confirm/Cancel buttons */}
          <AnimatePresence>
            {gameState === GAME_STATES.SELECTED && (
              <motion.div
                className="flex justify-center gap-4 max-w-md mx-auto w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <button
                  className="btn-secondary flex-1"
                  onClick={handleCancelSelection}
                  data-testid="cancel-answer-btn"
                >
                  Annuler
                </button>
                <button
                  className="btn-primary flex-1"
                  onClick={handleConfirmAnswer}
                  data-testid="confirm-answer-btn"
                >
                  C'est mon dernier mot !
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bouton de revelation manuelle (mode animateur) */}
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

          {/* Revealing state indicator */}
          {gameState === GAME_STATES.REVEALING && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
            </motion.div>
          )}
        </div>

        {/* Money Tree */}
        <MoneyTree
          currentLevel={currentLevel}
          isOpen={showMoneyTree}
          onClose={() => setShowMoneyTree(false)}
          onSelectLevel={handleSelectMoneyLevel}
        />
      </div>

      {/* Dialogs */}
      <PhoneFriendDialog
        isOpen={showPhoneDialog}
        response={phoneResponse}
        onClose={closePhoneDialog}
      />
      
      {/* Overlay de transition entre les niveaux / intro */}
      <AnimatePresence>
        {(gameState === GAME_STATES.INTRO || gameState === GAME_STATES.TRANSITION) && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-[#0B0B1A]/85 backdrop-blur-sm"
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
                className={`text-5xl sm:text-6xl lg:text-7xl font-black font-['Chivo'] ${
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
          </motion.div>
        )}
      </AnimatePresence>

      <AudienceResults
        isOpen={showAudienceDialog}
        results={audienceResults || [0, 0, 0, 0]}
        onClose={closeAudienceDialog}
      />
    </div>
  );
};

export default Game;
