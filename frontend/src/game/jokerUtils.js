/**
 * Choisit 2 mauvaises réponses à éliminer (50:50), avec mélange Fisher–Yates
 * pour ne pas toujours retirer les mêmes lettres.
 */
export function pickTwoWrongAnswersToEliminate(correctIndex) {
  const wrongAnswers = [0, 1, 2, 3].filter((i) => i !== correctIndex);
  for (let i = wrongAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrongAnswers[i], wrongAnswers[j]] = [wrongAnswers[j], wrongAnswers[i]];
  }
  return wrongAnswers.slice(0, 2);
}
