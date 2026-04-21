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

/** Pauses et durées du flux audio / transitions TV */
export const OUTCOME_MIN_MS = 2500;
export const OUTCOME_MAX_MS = 10000;
export const LETSPLAY_MIN_MS = 1500;
export const LETSPLAY_MAX_MS = 4500;
export const INTRO_MAX_MS = 3500;
export const SILENCE_BETWEEN_MS = 0;
export const TRANSITION_OVERLAY_LEAD_MS = 300;

/** Révélation manuelle à partir de la question 6 */
export const MANUAL_REVEAL_ENABLED = true;
