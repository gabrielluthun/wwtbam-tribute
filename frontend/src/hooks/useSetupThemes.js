import { useState, useCallback } from 'react';
import { shuffleQuestions, getThemeQuestions, getThemeById, renameCustomTheme, deleteCustomTheme, saveCustomTheme } from '../utils/themes';
import { areAllQuestionsComplete } from '../setup/setupValidation';

/**
 * Bibliothèque de thèmes (chargement en édition, lancement direct, CRUD thèmes perso).
 * Les toasts utilisent le même canal que l’import (setImportSuccess).
 */
export function useSetupThemes({
  questions,
  setQuestions,
  setErrors,
  setCurrentEditIndex,
  shuffleEnabled,
  pushSessionAndGoToGame,
  setImportSuccess,
}) {
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [loadedTheme, setLoadedTheme] = useState(null);

  const [showSaveThemeModal, setShowSaveThemeModal] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [themeDescription, setThemeDescription] = useState('');
  const [themeColor, setThemeColor] = useState('#8B5CF6');
  const [saveThemeError, setSaveThemeError] = useState('');

  const handleSelectTheme = useCallback(
    (themeId) => {
      const themeQuestions = getThemeQuestions(themeId);
      const selectedTheme = getThemeById(themeId);
      if (themeQuestions) {
        setQuestions(themeQuestions);
        setLoadedTheme(selectedTheme);
        setErrors({});
        setCurrentEditIndex(0);
        setShowThemeSelector(false);
        setImportSuccess(`Thème "${selectedTheme?.name || 'inconnu'}" chargé avec succès !`);
        setTimeout(() => setImportSuccess(''), 3000);
      }
    },
    [setQuestions, setErrors, setCurrentEditIndex, setImportSuccess],
  );

  const handlePlayTheme = useCallback(
    (themeId) => {
      const themeQuestions = getThemeQuestions(themeId);
      const selectedTheme = getThemeById(themeId);
      if (!themeQuestions) return;

      const finalQuestions = shuffleEnabled ? shuffleQuestions(themeQuestions) : themeQuestions;
      setLoadedTheme(selectedTheme);
      setShowThemeSelector(false);
      pushSessionAndGoToGame(finalQuestions);
    },
    [shuffleEnabled, pushSessionAndGoToGame],
  );

  const openSaveThemeModal = useCallback(() => {
    setThemeName(loadedTheme?.isCustom ? loadedTheme.name : '');
    setThemeDescription(loadedTheme?.isCustom ? loadedTheme.description : '');
    setThemeColor(loadedTheme?.isCustom ? loadedTheme.color : '#8B5CF6');
    setSaveThemeError('');
    setShowSaveThemeModal(true);
  }, [loadedTheme]);

  const handleSaveCurrentTheme = useCallback(() => {
    if (!areAllQuestionsComplete(questions)) {
      setSaveThemeError('Complétez les 15 questions avant de sauvegarder un thème.');
      return;
    }

    try {
      const savedTheme = saveCustomTheme({
        name: themeName,
        description: themeDescription,
        color: themeColor,
        questions,
      });

      setLoadedTheme(savedTheme);
      setShowSaveThemeModal(false);
      setSaveThemeError('');
      setImportSuccess(`Thème "${savedTheme.name}" sauvegardé ! Il est maintenant disponible dans la liste.`);
      setTimeout(() => setImportSuccess(''), 3500);
    } catch (error) {
      setSaveThemeError(error.message || 'Impossible de sauvegarder ce thème.');
    }
  }, [questions, themeName, themeDescription, themeColor, setImportSuccess]);

  const handleRenameTheme = useCallback(
    ({ themeId, name, description, color }) => {
      const updatedTheme = renameCustomTheme({ themeId, name, description, color });
      if (loadedTheme?.id === themeId) {
        setLoadedTheme(updatedTheme);
      }
      setImportSuccess(`Thème "${updatedTheme.name}" modifié avec succès.`);
      setTimeout(() => setImportSuccess(''), 3000);
    },
    [loadedTheme?.id, setImportSuccess],
  );

  const handleDeleteTheme = useCallback(
    (themeId) => {
      const deletedTheme = getThemeById(themeId);
      deleteCustomTheme(themeId);

      if (loadedTheme?.id === themeId) {
        setLoadedTheme(null);
      }

      setImportSuccess(`Thème "${deletedTheme?.name || 'personnalisé'}" supprimé.`);
      setTimeout(() => setImportSuccess(''), 3000);
    },
    [loadedTheme?.id, setImportSuccess],
  );

  return {
    showThemeSelector,
    setShowThemeSelector,
    loadedTheme,
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
    handleSelectTheme,
    handlePlayTheme,
    openSaveThemeModal,
    handleSaveCurrentTheme,
    handleRenameTheme,
    handleDeleteTheme,
  };
}
