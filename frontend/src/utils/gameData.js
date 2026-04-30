// Money tree levels (15 levels like the real show)
export const MONEY_LEVELS = [
  { level: 1, amount: 200, display: '200 €', checkpoint: false },
  { level: 2, amount: 300, display: '300 €', checkpoint: false },
  { level: 3, amount: 500, display: '500 €', checkpoint: false },
  { level: 4, amount: 800, display: '800 €', checkpoint: false },
  { level: 5, amount: 1500, display: '1 500 €', checkpoint: true }, // First checkpoint
  { level: 6, amount: 3000, display: '3 000 €', checkpoint: false },
  { level: 7, amount: 6000, display: '6 000 €', checkpoint: false },
  { level: 8, amount: 12000, display: '12 000 €', checkpoint: false },
  { level: 9, amount: 24000, display: '24 000 €', checkpoint: false },
  { level: 10, amount: 48000, display: '48 000 €', checkpoint: true }, // Second checkpoint
  { level: 11, amount: 72000, display: '72 000 €', checkpoint: false },
  { level: 12, amount: 100000, display: '100 000 €', checkpoint: false },
  { level: 13, amount: 150000, display: '150 000 €', checkpoint: false },
  { level: 14, amount: 300000, display: '300 000 €', checkpoint: false },
  { level: 15, amount: 1000000, display: '1 000 000 €', checkpoint: true }, // MILLION!
];

// Get guaranteed amount based on checkpoints
export const getGuaranteedAmount = (currentLevel) => {
  const completedLevels = currentLevel - 1;
  if (completedLevels >= 10) return MONEY_LEVELS[9]; // 48 000 € (Q10 réussie)
  if (completedLevels >= 5) return MONEY_LEVELS[4]; // 1 500 € (Q5 réussie)
  return { level: 0, amount: 0, display: '0 €' };
};

// Phone a friend responses (simulated)
export const PHONE_RESPONSES = [
  "Je suis presque sûr que c'est {answer}, j'ai vu ça récemment.",
  "Hmm, je dirais {answer}, mais je ne suis pas certain à 100%.",
  "Oh là là, c'est difficile... Je pencherais pour {answer}.",
  "D'après mes souvenirs, c'est {answer}. J'en suis assez confiant.",
  "Je crois que c'est {answer}, mais vérifie quand même !",
  "Mon instinct me dit {answer}. Bonne chance !",
  "Sans hésiter, je répondrais {answer}.",
  "Ça me parle beaucoup, je dirais {answer}.",
  "Je ne veux pas t'induire en erreur, mais je pense à {answer}.",
  "Si je dois choisir vite, je pars sur {answer}.",
  "Franchement, {answer} me semble la meilleure option.",
  "Je mettrais une pièce sur {answer}.",
  "J'ai un doute, mais {answer} reste mon premier choix.",
  "Pour moi, c'est {answer}, sauf énorme piège.",
  "J'irais sur {answer}. Fais-toi confiance aussi.",
];

const PHONE_CORRECT_CHANCE_BY_LEVEL = [
  0.9, 0.9, 0.88, 0.88, 0.85, // Q1-Q5: tres fiable
  0.7, 0.68, 0.66, 0.64, 0.62, // Q6-Q10: fiabilite moyenne
  0.52, 0.5, 0.48, 0.46, 0.44, // Q11-Q15: incertain, mais peut etre juste
];

const TRICK_WORDS = [
  ' sauf ',
  ' excepte ',
  ' excepté ',
  ' pas ',
  ' jamais ',
  ' aucun ',
  ' aucune ',
  ' faux ',
  ' n est pas ',
  " n'est pas ",
];

const normalizeText = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ' ')
    .replace(/\s+/g, ' ');

const isTrickQuestion = (questionText = '') => {
  const normalized = ` ${normalizeText(questionText)} `;
  return TRICK_WORDS.some((word) => normalized.includes(word));
};

const normalizePercentages = (values, allowedIndexes) => {
  const safeAllowed = allowedIndexes.filter((idx) => idx >= 0 && idx < values.length);
  const normalized = values.map((value, idx) => {
    if (!safeAllowed.includes(idx)) return 0;
    return Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
  });

  let total = normalized.reduce((sum, value) => sum + value, 0);

  if (safeAllowed.length === 0) {
    return normalized;
  }

  while (total < 100) {
    const pick = safeAllowed[Math.floor(Math.random() * safeAllowed.length)];
    normalized[pick] += 1;
    total += 1;
  }

  while (total > 100) {
    const candidates = safeAllowed.filter((idx) => normalized[idx] > 0);
    if (candidates.length === 0) break;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    normalized[pick] -= 1;
    total -= 1;
  }

  return normalized;
};

const getPhoneCorrectChance = (currentLevel) => {
  const index = Math.min(Math.max((currentLevel || 1) - 1, 0), PHONE_CORRECT_CHANCE_BY_LEVEL.length - 1);
  return PHONE_CORRECT_CHANCE_BY_LEVEL[index];
};

// Get random phone response with reliability by level.
export const getPhoneResponse = (correctAnswer, allAnswers, currentLevel = 1) => {
  const suggestCorrect = Math.random() < getPhoneCorrectChance(currentLevel);
  const wrongAnswers = allAnswers.filter((answer) => answer !== correctAnswer);
  const answer = suggestCorrect
    ? correctAnswer
    : wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
  const template = PHONE_RESPONSES[Math.floor(Math.random() * PHONE_RESPONSES.length)];
  const confidenceMin = suggestCorrect ? 62 : 25;
  const confidenceMax = suggestCorrect ? 92 : 60;
  return {
    message: template.replace('{answer}', answer),
    confidence: Math.floor(Math.random() * (confidenceMax - confidenceMin + 1)) + confidenceMin,
  };
};

// Generate audience results with optional "trick question" behavior.
export const generateAudienceResults = (correctIndex, eliminatedIndexes = [], questionText = '') => {
  const results = [0, 0, 0, 0];
  let remaining = 100;
  const availableIndexes = [0, 1, 2, 3].filter((i) => !eliminatedIndexes.includes(i));
  const wrongAvailableIndexes = availableIndexes.filter((i) => i !== correctIndex);
  const trickQuestion = isTrickQuestion(questionText);
  const misleadAudience = trickQuestion && wrongAvailableIndexes.length > 0 && Math.random() < 0.65;

  const dominantIndex = misleadAudience
    ? wrongAvailableIndexes[Math.floor(Math.random() * wrongAvailableIndexes.length)]
    : correctIndex;

  const dominantVotesMin = misleadAudience ? 42 : 45;
  const dominantVotesMax = misleadAudience ? 58 : 68;
  const dominantVotes =
    Math.floor(Math.random() * (dominantVotesMax - dominantVotesMin + 1)) + dominantVotesMin;
  results[dominantIndex] = dominantVotes;
  remaining -= dominantVotes;

  // Ensure the correct answer still keeps some support when audience is wrong.
  if (misleadAudience) {
    const correctVotes = Math.min(remaining, Math.floor(Math.random() * 16) + 12);
    results[correctIndex] = correctVotes;
    remaining -= correctVotes;
  }

  const secondaryIndexes = availableIndexes.filter((i) => i !== dominantIndex && (misleadAudience ? i !== correctIndex : true));
  secondaryIndexes.forEach((idx, i) => {
    if (i === secondaryIndexes.length - 1) {
      results[idx] = remaining;
    } else {
      const maxChunk = Math.max(5, Math.floor(remaining / 2));
      const votes = Math.floor(Math.random() * (maxChunk - 4)) + 4;
      results[idx] = Math.min(votes, remaining);
      remaining -= results[idx];
    }
  });

  if (!misleadAudience && remaining > 0) {
    results[correctIndex] += remaining;
  }

  // Set eliminated answers to 0.
  eliminatedIndexes.forEach((idx) => {
    results[idx] = 0;
  });

  return normalizePercentages(results, availableIndexes);
};

// Answer letters
export const ANSWER_LETTERS = ['A', 'B', 'C', 'D'];

// Default empty question template
export const createEmptyQuestion = (index) => ({
  id: `q-${index}`,
  question: '',
  answers: ['', '', '', ''],
  correctIndex: 0,
});
