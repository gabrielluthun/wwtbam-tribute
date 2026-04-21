import { useState, useCallback } from 'react';
import { createEmptyQuestion } from '../utils/gameData';
import { shuffleQuestions } from '../utils/themes';
import { persistGameSession } from '../setup/persistGameSession';
import {
  getQuestionCompletionStatus,
  buildValidationErrorsForAllQuestions,
} from '../setup/setupValidation';
import { SETUP_QUESTION_COUNT, clampTimerDuration } from '../setup/setupConstants';
import { useSetupImportExport } from './useSetupImportExport';
import { useSetupThemes } from './useSetupThemes';

/**
 * Orchestration de l’écran « Créer vos questions » : édition, options, import/export, thèmes.
 * Les blocs spécialisés sont dans useSetupImportExport et useSetupThemes.
 */
export function useSetupQuestions(navigate, isMultiplayer) {
  const [questions, setQuestions] = useState(() =>
    Array.from({ length: SETUP_QUESTION_COUNT }, (_, i) => createEmptyQuestion(i + 1)),
  );
  const [currentEditIndex, setCurrentEditIndex] = useState(0);
  const [errors, setErrors] = useState({});

  const [playerNames, setPlayerNames] = useState(['Joueur 1', 'Joueur 2']);

  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);

  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);

  const pushSessionAndGoToGame = useCallback(
    (finalQuestions) => {
      persistGameSession({
        questions: finalQuestions,
        isMultiplayer,
        timerEnabled,
        timerDuration,
        playerNames,
      });
      navigate('/game');
    },
    [isMultiplayer, timerEnabled, timerDuration, playerNames, navigate],
  );

  const {
    fileInputRef,
    importError,
    importSuccess,
    setImportSuccess,
    handleExport,
    handleImport,
  } = useSetupImportExport({
    questions,
    timerEnabled,
    timerDuration,
    setQuestions,
    setTimerEnabled,
    setTimerDuration,
  });

  const themeApi = useSetupThemes({
    questions,
    setQuestions,
    setErrors,
    setCurrentEditIndex,
    shuffleEnabled,
    pushSessionAndGoToGame,
    setImportSuccess,
  });

  const updateQuestion = useCallback(
    (field, value) => {
      setQuestions((prev) => {
        const updated = [...prev];
        updated[currentEditIndex] = { ...updated[currentEditIndex], [field]: value };
        return updated;
      });
      setErrors((prev) => ({ ...prev, [`${currentEditIndex}-${field}`]: null }));
    },
    [currentEditIndex],
  );

  const updateAnswer = useCallback(
    (answerIndex, value) => {
      setQuestions((prev) => {
        const updated = [...prev];
        const answers = [...updated[currentEditIndex].answers];
        answers[answerIndex] = value;
        updated[currentEditIndex] = { ...updated[currentEditIndex], answers };
        return updated;
      });
      setErrors((prev) => ({ ...prev, [`${currentEditIndex}-answer-${answerIndex}`]: null }));
    },
    [currentEditIndex],
  );

  const setCorrectAnswer = useCallback(
    (index) => {
      updateQuestion('correctIndex', index);
    },
    [updateQuestion],
  );

  const validateAllQuestions = useCallback(() => {
    const { errors: nextErrors, isValid } = buildValidationErrorsForAllQuestions(questions);
    setErrors(nextErrors);
    return isValid;
  }, [questions]);

  const getQuestionStatus = useCallback(
    (index) => getQuestionCompletionStatus(questions[index]),
    [questions],
  );

  const onTimerDurationInputChange = useCallback((e) => {
    setTimerDuration(clampTimerDuration(e.target.value));
  }, []);

  const startGame = useCallback(() => {
    if (!validateAllQuestions()) return;
    const finalQuestions = shuffleEnabled ? shuffleQuestions(questions) : questions;
    pushSessionAndGoToGame(finalQuestions);
  }, [validateAllQuestions, shuffleEnabled, questions, pushSessionAndGoToGame]);

  const completedCount = questions.filter((q) => getQuestionCompletionStatus(q) === 'complete').length;
  const currentQuestion = questions[currentEditIndex];

  return {
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
    showImportExport,
    setShowImportExport,
    importError,
    importSuccess,
    updateQuestion,
    updateAnswer,
    setCorrectAnswer,
    getQuestionStatus,
    handleExport,
    handleImport,
    startGame,
    completedCount,
    currentQuestion,
    ...themeApi,
  };
}
