import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';
import { Input } from '../ui/input';
import { MONEY_LEVELS, ANSWER_LETTERS } from '../../utils/gameData';
import { SETUP_QUESTION_COUNT } from '../../setup/setupConstants';

export const SetupQuestionEditor = ({
  questions,
  currentEditIndex,
  setCurrentEditIndex,
  getQuestionStatus,
  currentQuestion,
  currentLevel,
  errors,
  updateQuestion,
  updateAnswer,
  setCorrectAnswer,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                  {status === 'partial' && <AlertCircle size={14} className="text-yellow-400" />}
                  {status === 'empty' && <span className="w-3 h-3 rounded-full bg-white/20 block" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>

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
);
