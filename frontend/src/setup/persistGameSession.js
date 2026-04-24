/**
 * Écrit dans sessionStorage tout ce que la page Game lit au chargement.
 * Centralisé pour éviter la duplication entre « Commencer » et « Jouer un thème ».
 */
export function persistGameSession({
  questions,
  isMultiplayer,
  timerEnabled,
  timerDuration,
  playerNames,
}) {
  sessionStorage.setItem('gameQuestions', JSON.stringify(questions));
  sessionStorage.setItem('gameMode', isMultiplayer ? 'multi' : 'solo');
  sessionStorage.setItem('timerEnabled', JSON.stringify(timerEnabled));
  sessionStorage.setItem('timerDuration', JSON.stringify(timerDuration));
  if (isMultiplayer) {
    sessionStorage.setItem('playerNames', JSON.stringify(playerNames));
  }
}
