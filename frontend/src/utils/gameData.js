// Money tree levels (15 levels like the real show)
export const MONEY_LEVELS = [
  { level: 1, amount: 100, display: '100 €', checkpoint: false },
  { level: 2, amount: 200, display: '200 €', checkpoint: false },
  { level: 3, amount: 300, display: '300 €', checkpoint: false },
  { level: 4, amount: 500, display: '500 €', checkpoint: false },
  { level: 5, amount: 1000, display: '1 000 €', checkpoint: true }, // First checkpoint
  { level: 6, amount: 2000, display: '2 000 €', checkpoint: false },
  { level: 7, amount: 4000, display: '4 000 €', checkpoint: false },
  { level: 8, amount: 8000, display: '8 000 €', checkpoint: false },
  { level: 9, amount: 12000, display: '12 000 €', checkpoint: false },
  { level: 10, amount: 24000, display: '24 000 €', checkpoint: true }, // Second checkpoint
  { level: 11, amount: 48000, display: '48 000 €', checkpoint: false },
  { level: 12, amount: 72000, display: '72 000 €', checkpoint: false },
  { level: 13, amount: 100000, display: '100 000 €', checkpoint: false },
  { level: 14, amount: 300000, display: '300 000 €', checkpoint: false },
  { level: 15, amount: 1000000, display: '1 000 000 €', checkpoint: true }, // MILLION!
];

// Get guaranteed amount based on checkpoints
export const getGuaranteedAmount = (currentLevel) => {
  if (currentLevel >= 10) return MONEY_LEVELS[9]; // 24 000 €
  if (currentLevel >= 5) return MONEY_LEVELS[4]; // 1 000 €
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
];

// Get random phone response
export const getPhoneResponse = (correctAnswer, allAnswers) => {
  // 70% chance to suggest correct answer
  const suggestCorrect = Math.random() < 0.7;
  const answer = suggestCorrect ? correctAnswer : allAnswers[Math.floor(Math.random() * allAnswers.length)];
  const template = PHONE_RESPONSES[Math.floor(Math.random() * PHONE_RESPONSES.length)];
  return {
    message: template.replace('{answer}', answer),
    confidence: suggestCorrect ? Math.floor(Math.random() * 20) + 70 : Math.floor(Math.random() * 40) + 30,
  };
};

// Generate audience results (simulated)
export const generateAudienceResults = (correctIndex, eliminatedIndexes = []) => {
  const results = [0, 0, 0, 0];
  let remaining = 100;
  
  // Give correct answer 40-60% of votes
  const correctVotes = Math.floor(Math.random() * 20) + 40;
  results[correctIndex] = correctVotes;
  remaining -= correctVotes;
  
  // Distribute remaining votes
  const availableIndexes = [0, 1, 2, 3].filter(i => i !== correctIndex && !eliminatedIndexes.includes(i));
  
  availableIndexes.forEach((idx, i) => {
    if (i === availableIndexes.length - 1) {
      results[idx] = remaining;
    } else {
      const votes = Math.floor(Math.random() * (remaining / 2));
      results[idx] = votes;
      remaining -= votes;
    }
  });
  
  // Set eliminated answers to 0
  eliminatedIndexes.forEach(idx => {
    results[idx] = 0;
  });
  
  return results;
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
