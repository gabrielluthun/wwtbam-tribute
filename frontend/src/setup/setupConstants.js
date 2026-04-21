/**
 * Paramètres globaux de l’écran de préparation de partie.
 * Le jeu utilise exactement 15 paliers (alignés sur MONEY_LEVELS).
 */
export const SETUP_QUESTION_COUNT = 15;

/** Bornes du timer (secondes), cohérentes avec l’input number de l’UI */
export const TIMER_DURATION_MIN = 10;
export const TIMER_DURATION_MAX = 120;

/** Valeur stockée dans le state à partir de la chaîne de l’input (défaut 30 si invalide). */
export function clampTimerDuration(raw) {
  const n = parseInt(raw, 10);
  const v = Number.isNaN(n) ? 30 : n;
  return Math.max(TIMER_DURATION_MIN, Math.min(TIMER_DURATION_MAX, v));
}
