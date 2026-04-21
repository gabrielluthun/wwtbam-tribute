import { useState, useRef, useCallback } from 'react';
import { buildExportPayload, downloadJsonFile, parseImportedQuestionsPayload } from '../setup/setupImportExport';

/**
 * Import / export JSON des 15 questions + optionnellement les réglages timer du fichier.
 * Les messages de succès sont réutilisés par les thèmes via setImportSuccess.
 */
export function useSetupImportExport({
  questions,
  timerEnabled,
  timerDuration,
  setQuestions,
  setTimerEnabled,
  setTimerDuration,
}) {
  const fileInputRef = useRef(null);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  const handleExport = useCallback(() => {
    const exportData = buildExportPayload(questions, timerEnabled, timerDuration);
    downloadJsonFile(exportData, `qvgdm-questions-${Date.now()}.json`);
    setImportSuccess('Questions exportées avec succès !');
    setTimeout(() => setImportSuccess(''), 3000);
  }, [questions, timerEnabled, timerDuration]);

  const handleImport = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result);
          const { importedQuestions, timerSettings } = parseImportedQuestionsPayload(data);
          setQuestions(importedQuestions);

          if (timerSettings) {
            setTimerEnabled(timerSettings.enabled || false);
            setTimerDuration(timerSettings.duration || 30);
          }

          setImportError('');
          setImportSuccess('Questions importées avec succès !');
          setTimeout(() => setImportSuccess(''), 3000);
        } catch (err) {
          setImportError(err.message || "Erreur lors de l'import du fichier");
          setImportSuccess('');
        }
      };
      reader.readAsText(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [setQuestions, setTimerEnabled, setTimerDuration],
  );

  return {
    fileInputRef,
    importError,
    importSuccess,
    setImportSuccess,
    handleExport,
    handleImport,
  };
}
