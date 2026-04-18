import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Play, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Input } from '../components/ui/input';
import { MONEY_LEVELS, createEmptyQuestion, ANSWER_LETTERS } from '../utils/gameData';

export const SetupQuestions = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMultiplayer = searchParams.get('mode') === 'multi';
  
  const [questions, setQuestions] = useState(() => 
    Array.from({ length: 15 }, (_, i) => createEmptyQuestion(i + 1))
  );
  const [currentEditIndex, setCurrentEditIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [playerNames, setPlayerNames] = useState(['Joueur 1', 'Joueur 2']);

  const currentQuestion = questions[currentEditIndex];
  const currentLevel = MONEY_LEVELS[currentEditIndex];

  const updateQuestion = (field, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[currentEditIndex] = { ...updated[currentEditIndex], [field]: value };
      return updated;
    });
    // Clear error for this field
    setErrors(prev => ({ ...prev, [`${currentEditIndex}-${field}`]: null }));
  };

  const updateAnswer = (answerIndex, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      const answers = [...updated[currentEditIndex].answers];
      answers[answerIndex] = value;
      updated[currentEditIndex] = { ...updated[currentEditIndex], answers };
      return updated;
    });
    setErrors(prev => ({ ...prev, [`${currentEditIndex}-answer-${answerIndex}`]: null }));
  };

  const setCorrectAnswer = (index) => {
    updateQuestion('correctIndex', index);
  };

  const validateAllQuestions = () => {
    const newErrors = {};
    let isValid = true;

    questions.forEach((q, qIdx) => {
      if (!q.question.trim()) {
        newErrors[`${qIdx}-question`] = 'Question requise';
        isValid = false;
      }
      q.answers.forEach((a, aIdx) => {
        if (!a.trim()) {
          newErrors[`${qIdx}-answer-${aIdx}`] = 'Réponse requise';
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const getQuestionStatus = (index) => {
    const q = questions[index];
    if (!q.question.trim()) return 'empty';
    const allAnswersFilled = q.answers.every(a => a.trim());
    return allAnswersFilled ? 'complete' : 'partial';
  };

  const startGame = () => {
    if (validateAllQuestions()) {
      // Store questions in sessionStorage for the game
      sessionStorage.setItem('gameQuestions', JSON.stringify(questions));
      sessionStorage.setItem('gameMode', isMultiplayer ? 'multi' : 'solo');
      if (isMultiplayer) {
        sessionStorage.setItem('playerNames', JSON.stringify(playerNames));
      }
      navigate('/game');
    }
  };

  const completedCount = questions.filter((_, i) => getQuestionStatus(i) === 'complete').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1A3A] via-[#0B0B1A] to-[#05050A] p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            className="flex items-center gap-2 text-[#B0B0C0] hover:text-white transition-colors"
            onClick={() => navigate('/')}
            data-testid="back-btn"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold font-['Chivo'] text-white">
              Créer vos questions
            </h1>
            <p className="text-[#B0B0C0] text-sm">
              {completedCount}/15 questions complètes
            </p>
          </div>
          
          <button
            className="btn-primary flex items-center gap-2 text-sm"
            onClick={startGame}
            disabled={completedCount < 15}
            data-testid="start-game-btn"
          >
            <Play size={18} />
            Commencer
          </button>
        </div>

        {/* Multiplayer names */}
        {isMultiplayer && (
          <motion.div
            className="glass-light rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-white font-semibold mb-3">Noms des joueurs</h3>
            <div className="flex gap-4">
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
          {/* Questions list sidebar */}
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

          {/* Question editor */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentEditIndex}
                className="question-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Level indicator */}
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

                {/* Question input */}
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

                {/* Answers */}
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

                {/* Navigation */}
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
                    onClick={() => setCurrentEditIndex(Math.min(14, currentEditIndex + 1))}
                    disabled={currentEditIndex === 14}
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
    </div>
  );
};

export default SetupQuestions;
