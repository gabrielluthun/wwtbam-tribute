import { SETUP_QUESTION_COUNT } from './setupConstants';

/**
 * État de complétion d’une question pour la liste latérale (pastilles / compteur).
 * - empty : pas de texte de question
 * - partial : question remplie mais au moins une réponse vide
 * - complete : question + 4 réponses non vides
 */
export function getQuestionCompletionStatus(question) {
  if (!question.question.trim()) return 'empty';
  const allAnswersFilled = question.answers.every((a) => a.trim());
  return allAnswersFilled ? 'complete' : 'partial';
}

/**
 * Valide les 15 questions (champs requis pour lancer la partie).
 * Retourne la carte d’erreurs par clé (même convention que l’UI : `${idx}-question`, etc.).
 */
export function buildValidationErrorsForAllQuestions(questions) {
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

  return { errors: newErrors, isValid };
}

/** Indique si les 15 questions sont entièrement remplies (hors validation explicite des erreurs). */
export function areAllQuestionsComplete(questions) {
  return questions.every((q) => getQuestionCompletionStatus(q) === 'complete');
}

/** Vérifie qu’un import JSON contient bien le bon nombre de questions. */
export function assertImportQuestionCount(length) {
  if (length !== SETUP_QUESTION_COUNT) {
    throw new Error(`Le fichier doit contenir exactement ${SETUP_QUESTION_COUNT} questions`);
  }
}
