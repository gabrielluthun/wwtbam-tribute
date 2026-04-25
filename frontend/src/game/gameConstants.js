/** États de la machine de jeu (écran + flux async). */
export const GAME_STATES = {
  INTRO: 'intro',
  PLAYING: 'playing',
  SELECTED: 'selected',
  REVEALING: 'revealing',
  AWAITING_REVEAL: 'awaiting_reveal',
  TRANSITION: 'transition',
  WON: 'won',
  LOST: 'lost',
  MILLION: 'million',
  TIMEOUT: 'timeout',
};

export const DEFAULT_ANSWER_STATES = ['default', 'default', 'default', 'default'];

/**
 * Pauses et durées du flux audio / transitions.
 * Calage indicatif (fichiers du dossier sounds) : win paliers ~9–10s ; win q11–q15 ~16–23s ;
 * Let’s Play ~11s ; lose ~4–8s ; win q6–q9 très longs (plafonnés par OUTCOME_MAX_MS).
 */
export const OUTCOME_MIN_MS = 6000;
export const OUTCOME_MAX_MS = 7000;
/** Délai avant d’afficher « Débuter la partie » sur l’overlay « Pour 200 € » (VO d’accroche). */
export const INTRO_START_BUTTON_MS = 4200;
export const LETSPLAY_MIN_MS = 2500;
export const LETSPLAY_MAX_MS = 3500;
export const SILENCE_BETWEEN_MS = 50;
export const TRANSITION_OVERLAY_LEAD_MS = 700;

/** Révélation manuelle à partir de la question 6 */
export const MANUAL_REVEAL_ENABLED = true;
