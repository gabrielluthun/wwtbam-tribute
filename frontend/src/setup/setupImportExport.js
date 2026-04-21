import { MONEY_LEVELS, ANSWER_LETTERS } from '../utils/gameData';
import { assertImportQuestionCount } from './setupValidation';

/**
 * Construit le document JSON exporté (versionné, avec métadonnées et timer).
 */
export function buildExportPayload(questions, timerEnabled, timerDuration) {
  return {
    version: '1.0',
    name: 'Mes Questions QVGDM',
    createdAt: new Date().toISOString(),
    timerSettings: {
      enabled: timerEnabled,
      duration: timerDuration,
    },
    questions: questions.map((q, idx) => ({
      level: idx + 1,
      amount: MONEY_LEVELS[idx].display,
      question: q.question,
      answers: {
        A: q.answers[0],
        B: q.answers[1],
        C: q.answers[2],
        D: q.answers[3],
      },
      correctAnswer: ANSWER_LETTERS[q.correctIndex],
    })),
  };
}

/**
 * Déclenche le téléchargement d’un fichier JSON côté navigateur.
 */
export function downloadJsonFile(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parse un fichier importé : vérifie la structure et renvoie le format interne des questions.
 * Lève une Error avec message utilisateur si le JSON est invalide.
 */
export function parseImportedQuestionsPayload(data) {
  if (!data.questions || !Array.isArray(data.questions)) {
    throw new Error('Le fichier doit contenir exactement 15 questions');
  }
  assertImportQuestionCount(data.questions.length);

  const importedQuestions = data.questions.map((q, idx) => ({
    id: `q-${idx + 1}`,
    question: q.question || '',
    answers: [q.answers?.A || '', q.answers?.B || '', q.answers?.C || '', q.answers?.D || ''],
    correctIndex:
      ANSWER_LETTERS.indexOf(q.correctAnswer) >= 0 ? ANSWER_LETTERS.indexOf(q.correctAnswer) : 0,
  }));

  const timerSettings = data.timerSettings
    ? {
        enabled: data.timerSettings.enabled || false,
        duration: data.timerSettings.duration || 30,
      }
    : null;

  return { importedQuestions, timerSettings };
}
