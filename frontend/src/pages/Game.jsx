import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Menu, Home, RotateCcw } from 'lucide-react';
import { AnswerButton } from '../components/AnswerButton';
import { MoneyTree } from '../components/MoneyTree';
import { Jokers, PhoneFriendDialog, AudienceResults } from '../components/Jokers';
import { 
  MONEY_LEVELS, 
  getGuaranteedAmount, 
  getPhoneResponse, 
  generateAudienceResults,
  ANSWER_LETTERS 
} from '../utils/gameData';
import { soundManager } from '../utils/sounds';

const GAME_STATES = {
  PLAYING: 'playing',
  SELECTED: 'selected', // Answer selected, waiting for confirmation
  REVEALING: 'revealing', // Showing if correct or wrong
  WON: 'won',
  LOST: 'lost',
  MILLION: 'million', // Won the million!
};

export const Game = () => {
  const navigate = useNavigate();
  
  // Game state
  const [questions, setQuestions] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState(GAME_STATES.PLAYING);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerStates, setAnswerStates] = useState(['default', 'default', 'default', 'default']);
  
  // Jokers
  const [usedJokers, setUsedJokers] = useState({ fifty: false, phone: false, audience: false });
  const [eliminatedAnswers, setEliminatedAnswers] = useState([]);
  const [phoneResponse, setPhoneResponse] = useState(null);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [audienceResults, setAudienceResults] = useState(null);
  const [showAudienceDialog, setShowAudienceDialog] = useState(false);
  
  // UI state
  const [isMuted, setIsMuted] = useState(false);
  const [showMoneyTree, setShowMoneyTree] = useState(false);
  
  // Multiplayer
  const [gameMode, setGameMode] = useState('solo');
  const [playerNames, setPlayerNames] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState([0, 0]);

  // Load game data
  useEffect(() => {
    const storedQuestions = sessionStorage.getItem('gameQuestions');
    const storedMode = sessionStorage.getItem('gameMode');
    const storedNames = sessionStorage.getItem('playerNames');
    
    if (!storedQuestions) {
      navigate('/setup');
      return;
    }
    
    setQuestions(JSON.parse(storedQuestions));
    setGameMode(storedMode || 'solo');
    if (storedNames) {
      setPlayerNames(JSON.parse(storedNames));
    }
    
    // Initialize sound
    soundManager.init();
    soundManager.playBackground(1);
    
    return () => {
      soundManager.stopBackground();
    };
  }, [navigate]);

  const currentQuestion = questions[currentLevel - 1];
  const currentMoney = MONEY_LEVELS[currentLevel - 1];
  const guaranteedMoney = getGuaranteedAmount(currentLevel);

  // Handle answer selection
  const handleSelectAnswer = useCallback((index) => {
    if (gameState !== GAME_STATES.PLAYING || eliminatedAnswers.includes(index)) return;
    
    soundManager.play('select');
    setSelectedAnswer(index);
    setGameState(GAME_STATES.SELECTED);
    
    // Update answer states
    setAnswerStates(prev => prev.map((s, i) => i === index ? 'selected' : s));
  }, [gameState, eliminatedAnswers]);

  // Confirm final answer
  const handleConfirmAnswer = useCallback(() => {
    if (gameState !== GAME_STATES.SELECTED || selectedAnswer === null) return;
    
    setGameState(GAME_STATES.REVEALING);
    soundManager.play('final_answer');
    
    // Tension delay before revealing
    setTimeout(() => {
      const isCorrect = selectedAnswer === currentQuestion.correctIndex;
      
      if (isCorrect) {
        soundManager.play('correct');
        setAnswerStates(prev => prev.map((s, i) => i === selectedAnswer ? 'correct' : s));
        
        // Check if won the million
        if (currentLevel === 15) {
          soundManager.play('million');
          setGameState(GAME_STATES.MILLION);
        } else {
          // Move to next level after delay
          setTimeout(() => {
            soundManager.play('level_up');
            setCurrentLevel(prev => prev + 1);
            setGameState(GAME_STATES.PLAYING);
            setSelectedAnswer(null);
            setAnswerStates(['default', 'default', 'default', 'default']);
            setEliminatedAnswers([]);
            soundManager.playBackground(currentLevel + 1);
            
            // Switch player in multiplayer
            if (gameMode === 'multi') {
              setCurrentPlayer(prev => (prev + 1) % 2);
            }
          }, 2500);
        }
      } else {
        soundManager.play('wrong');
        setAnswerStates(prev => prev.map((s, i) => {
          if (i === selectedAnswer) return 'wrong';
          if (i === currentQuestion.correctIndex) return 'correct';
          return s;
        }));
        
        // Update scores in multiplayer
        if (gameMode === 'multi') {
          setScores(prev => {
            const newScores = [...prev];
            newScores[currentPlayer] = guaranteedMoney.amount;
            return newScores;
          });
        }
        
        setTimeout(() => {
          setGameState(GAME_STATES.LOST);
        }, 2500);
      }
    }, 3000); // 3 second tension delay
  }, [gameState, selectedAnswer, currentQuestion, currentLevel, gameMode, currentPlayer, guaranteedMoney]);

  // Cancel selection
  const handleCancelSelection = useCallback(() => {
    if (gameState !== GAME_STATES.SELECTED) return;
    setSelectedAnswer(null);
    setGameState(GAME_STATES.PLAYING);
    setAnswerStates(prev => prev.map(() => 'default'));
  }, [gameState]);

  // Joker: 50:50
  const handleFiftyFifty = useCallback(() => {
    if (usedJokers.fifty || gameState !== GAME_STATES.PLAYING) return;
    
    soundManager.play('fifty_fifty');
    setUsedJokers(prev => ({ ...prev, fifty: true }));
    
    // Eliminate 2 wrong answers
    const wrongAnswers = [0, 1, 2, 3].filter(i => i !== currentQuestion.correctIndex);
    const toEliminate = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 2);
    
    setEliminatedAnswers(toEliminate);
    setAnswerStates(prev => prev.map((s, i) => toEliminate.includes(i) ? 'eliminated' : s));
  }, [usedJokers.fifty, gameState, currentQuestion]);

  // Joker: Phone a friend
  const handlePhoneFriend = useCallback(() => {
    if (usedJokers.phone || gameState !== GAME_STATES.PLAYING) return;
    
    soundManager.play('phone_friend');
    setUsedJokers(prev => ({ ...prev, phone: true }));
    
    const correctAnswer = currentQuestion.answers[currentQuestion.correctIndex];
    const response = getPhoneResponse(correctAnswer, currentQuestion.answers);
    setPhoneResponse(response);
    setShowPhoneDialog(true);
  }, [usedJokers.phone, gameState, currentQuestion]);

  // Joker: Ask the audience
  const handleAskAudience = useCallback(() => {
    if (usedJokers.audience || gameState !== GAME_STATES.PLAYING) return;
    
    soundManager.play('ask_audience');
    setUsedJokers(prev => ({ ...prev, audience: true }));
    
    const results = generateAudienceResults(currentQuestion.correctIndex, eliminatedAnswers);
    setAudienceResults(results);
    setShowAudienceDialog(true);
  }, [usedJokers.audience, gameState, currentQuestion, eliminatedAnswers]);

  // Toggle mute
  const toggleMute = () => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
  };

  // Walk away
  const handleWalkAway = () => {
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
    setGameState(GAME_STATES.PLAYING);
    setSelectedAnswer(null);
    setAnswerStates(['default', 'default', 'default', 'default']);
    setUsedJokers({ fifty: false, phone: false, audience: false });
    setEliminatedAnswers([]);
    setCurrentPlayer(0);
    setScores([0, 0]);
    soundManager.playBackground(1);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen studio-bg flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  // End game screens
  if (gameState === GAME_STATES.LOST || gameState === GAME_STATES.WON || gameState === GAME_STATES.MILLION) {
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
            initial={{ opacity: 0, y: 20 }}
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

          {/* Revealing state indicator */}
          {gameState === GAME_STATES.REVEALING && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-[#FFD700] text-xl font-bold animate-pulse">
                Vérification en cours...
              </p>
            </motion.div>
          )}
        </div>

        {/* Money Tree */}
        <MoneyTree
          currentLevel={currentLevel}
          isOpen={showMoneyTree}
          onClose={() => setShowMoneyTree(false)}
        />
      </div>

      {/* Dialogs */}
      <PhoneFriendDialog
        isOpen={showPhoneDialog}
        response={phoneResponse}
        onClose={() => setShowPhoneDialog(false)}
      />
      
      <AudienceResults
        isOpen={showAudienceDialog}
        results={audienceResults || [0, 0, 0, 0]}
        onClose={() => setShowAudienceDialog(false)}
      />
    </div>
  );
};

export default Game;
