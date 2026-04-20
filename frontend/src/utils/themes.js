// Pre-made question themes - 15 questions each, ordered from easy to difficult
// to match the progression of money levels (100€ → 1 000 000€)

import { ANSWER_LETTERS } from './gameData';

// Helper to create questions with correct index
const q = (question, answers, correctLetter) => ({
  question,
  answers,
  correctIndex: ANSWER_LETTERS.indexOf(correctLetter),
});

const CUSTOM_THEMES_STORAGE_KEY = 'qvgdm_custom_themes_v1';

export const THEMES = {
  culture_g: {
    id: 'culture_g',
    name: 'Culture Générale',
    icon: 'Brain',
    color: '#00E5FF',
    description: 'Testez vos connaissances générales',
    questions: [
      q('Quelle est la capitale de la France ?', ['Paris', 'Londres', 'Madrid', 'Berlin'], 'A'),
      q('Combien y a-t-il de jours dans une année bissextile ?', ['365', '366', '364', '367'], 'B'),
      q('Quel est le plus grand océan du monde ?', ['Atlantique', 'Indien', 'Pacifique', 'Arctique'], 'C'),
      q('Quelle est la monnaie du Japon ?', ['Yuan', 'Won', 'Baht', 'Yen'], 'D'),
      q('Qui a peint la Joconde ?', ['Léonard de Vinci', 'Michel-Ange', 'Raphaël', 'Van Gogh'], 'A'),
      q('Quel est le plus long fleuve du monde ?', ['Amazone', 'Nil', 'Yangtsé', 'Mississippi'], 'B'),
      q('Combien de pays composent l\'Union Européenne en 2024 ?', ['25', '26', '27', '28'], 'C'),
      q('Quelle est la plus haute montagne du monde ?', ['K2', 'Mont Blanc', 'Kilimandjaro', 'Everest'], 'D'),
      q('Qui a écrit "Les Misérables" ?', ['Victor Hugo', 'Émile Zola', 'Balzac', 'Flaubert'], 'A'),
      q('En quelle année a eu lieu la Révolution française ?', ['1799', '1789', '1769', '1779'], 'B'),
      q('Quel est le symbole chimique de l\'or ?', ['Ag', 'Fe', 'Au', 'Or'], 'C'),
      q('Quelle est la plus petite planète du système solaire ?', ['Vénus', 'Mars', 'Pluton', 'Mercure'], 'D'),
      q('Qui a découvert la pénicilline ?', ['Alexander Fleming', 'Louis Pasteur', 'Marie Curie', 'Einstein'], 'A'),
      q('Quel philosophe grec a été le maître d\'Aristote ?', ['Socrate', 'Platon', 'Épicure', 'Pythagore'], 'B'),
      q('Quelle œuvre musicale a composé Beethoven malgré sa surdité ?', ['Requiem', 'Les Quatre Saisons', '9ème Symphonie', 'Boléro'], 'C'),
    ],
  },
  
  sport: {
    id: 'sport',
    name: 'Sport',
    icon: 'Trophy',
    color: '#FF6B35',
    description: 'Défiez-vous sur le sport mondial',
    questions: [
      q('Combien de joueurs y a-t-il dans une équipe de football sur le terrain ?', ['11', '10', '12', '9'], 'A'),
      q('Quel sport pratique-t-on à Roland-Garros ?', ['Golf', 'Tennis', 'Rugby', 'Football'], 'B'),
      q('En combien de sets se joue un match de tennis masculin en Grand Chelem ?', ['3', '4', '5', '7'], 'C'),
      q('Combien de points vaut un essai au rugby à XV ?', ['3', '4', '7', '5'], 'D'),
      q('Qui a remporté la Coupe du Monde de football 2018 ?', ['France', 'Croatie', 'Brésil', 'Allemagne'], 'A'),
      q('Quel pays a organisé les JO d\'été en 2021 ?', ['Chine', 'Japon', 'Brésil', 'Angleterre'], 'B'),
      q('Combien mesure un terrain de basketball NBA (en mètres) ?', ['20x10', '24x12', '28.65x15.24', '30x18'], 'C'),
      q('Quel cycliste a remporté 5 fois le Tour de France dans les années 90 ?', ['Armstrong', 'Hinault', 'Merckx', 'Indurain'], 'D'),
      q('Combien de trous comporte un parcours de golf standard ?', ['18', '16', '20', '9'], 'A'),
      q('Qui détient le record du 100m masculin ?', ['Gay', 'Bolt', 'Blake', 'Powell'], 'B'),
      q('Quelle équipe a gagné le plus de Ligue des Champions ?', ['Barcelona', 'Liverpool', 'Real Madrid', 'Bayern'], 'C'),
      q('En F1, combien y a-t-il de Grands Prix en 2024 ?', ['20', '22', '23', '24'], 'D'),
      q('Qui est le premier joueur à avoir marqué 1000 buts ?', ['Pelé', 'Maradona', 'Cruyff', 'Puskás'], 'A'),
      q('Quel nageur a remporté 23 médailles d\'or olympiques ?', ['Thorpe', 'Phelps', 'Spitz', 'Lochte'], 'B'),
      q('En quelle année les JO modernes ont-ils été créés ?', ['1886', '1892', '1896', '1900'], 'C'),
    ],
  },
  
  cinema: {
    id: 'cinema',
    name: 'Cinéma',
    icon: 'Film',
    color: '#E91E63',
    description: 'Le 7ème art n\'aura plus de secrets pour vous',
    questions: [
      q('Qui joue le rôle de Jack dans "Titanic" ?', ['Leonardo DiCaprio', 'Brad Pitt', 'Tom Cruise', 'Johnny Depp'], 'A'),
      q('Quel film a gagné l\'Oscar du meilleur film en 2020 ?', ['1917', 'Parasite', 'Joker', 'Once Upon a Time'], 'B'),
      q('Qui a réalisé "Pulp Fiction" ?', ['Scorsese', 'Spielberg', 'Tarantino', 'Coppola'], 'C'),
      q('Dans quel film trouve-t-on la réplique "May the Force be with you" ?', ['Star Trek', 'Matrix', 'Interstellar', 'Star Wars'], 'D'),
      q('Qui a joué le Joker dans "The Dark Knight" ?', ['Heath Ledger', 'Jack Nicholson', 'Joaquin Phoenix', 'Jared Leto'], 'A'),
      q('Quel studio produit les films Marvel ?', ['Warner Bros', 'Marvel Studios', 'Universal', 'Paramount'], 'B'),
      q('En quelle année est sorti "Le Parrain" ?', ['1970', '1971', '1972', '1973'], 'C'),
      q('Qui a réalisé "Inception" ?', ['Villeneuve', 'Fincher', 'Nolan... non attends', 'Christopher Nolan'], 'D'),
      q('Quel film a la réplique "I\'ll be back" ?', ['Terminator', 'Rambo', 'Rocky', 'Die Hard'], 'A'),
      q('Combien d\'Oscars a gagné "Titanic" ?', ['9', '11', '10', '12'], 'B'),
      q('Qui a joué Neo dans Matrix ?', ['Jean-Claude Van Damme', 'Tom Cruise', 'Keanu Reeves', 'Will Smith'], 'C'),
      q('Quel acteur a interprété James Bond le plus de fois ?', ['Connery', 'Craig', 'Dalton', 'Roger Moore'], 'D'),
      q('Quel film de Kubrick est adapté d\'un roman de King ?', ['Shining', '2001', 'Orange Mécanique', 'Eyes Wide Shut'], 'A'),
      q('Qui a composé la musique de "Star Wars" ?', ['Hans Zimmer', 'John Williams', 'Danny Elfman', 'Ennio Morricone'], 'B'),
      q('Quel est le film le plus récompensé aux Oscars (11 statuettes) ?', ['Ben-Hur', 'Titanic', 'Le Retour du Roi', 'Tous ces films sont ex-aequo'], 'D'),
    ],
  },
  
  musique: {
    id: 'musique',
    name: 'Musique',
    icon: 'Music',
    color: '#9C27B0',
    description: 'De Mozart aux tubes actuels',
    questions: [
      q('Combien y a-t-il de notes dans une gamme majeure ?', ['7', '8', '6', '12'], 'A'),
      q('Quel groupe a chanté "Bohemian Rhapsody" ?', ['The Beatles', 'Queen', 'Led Zeppelin', 'Rolling Stones'], 'B'),
      q('Qui est surnommé "The King of Pop" ?', ['Elvis Presley', 'Prince', 'Michael Jackson', 'Stevie Wonder'], 'C'),
      q('Quel instrument joue Jimi Hendrix ?', ['Piano', 'Basse', 'Batterie', 'Guitare'], 'D'),
      q('Qui a composé "La Marche Turque" ?', ['Mozart', 'Beethoven', 'Bach', 'Chopin'], 'A'),
      q('Combien de cordes a une guitare classique ?', ['4', '6', '8', '12'], 'B'),
      q('Quelle chanteuse a chanté "Rolling in the Deep" ?', ['Beyoncé', 'Rihanna', 'Adele', 'Lady Gaga'], 'C'),
      q('Quel groupe français a chanté "Aux Champs-Élysées" ?', ['Téléphone', 'Indochine', 'Noir Désir', 'Joe Dassin (solo)'], 'D'),
      q('Combien de Beatles y avait-il ?', ['4', '3', '5', '6'], 'A'),
      q('Qui a composé "Les Quatre Saisons" ?', ['Bach', 'Vivaldi', 'Haendel', 'Mozart'], 'B'),
      q('Quel est l\'album le plus vendu de tous les temps ?', ['Back in Black', 'Dark Side of the Moon', 'Thriller', 'The Bodyguard'], 'C'),
      q('Quel DJ français a composé "One More Time" ?', ['David Guetta', 'Bob Sinclar', 'Martin Solveig', 'Daft Punk'], 'D'),
      q('Qui a fondé le groupe Nirvana ?', ['Kurt Cobain', 'Dave Grohl', 'Krist Novoselic', 'Eddie Vedder'], 'A'),
      q('En quelle année Freddie Mercury est-il mort ?', ['1989', '1991', '1993', '1995'], 'B'),
      q('Quelle est la note en dessous de La ?', ['Si', 'Do', 'Sol', 'Fa'], 'C'),
    ],
  },
  
  sciences: {
    id: 'sciences',
    name: 'Sciences',
    icon: 'Atom',
    color: '#4CAF50',
    description: 'Physique, chimie, biologie et plus',
    questions: [
      q('Combien de planètes dans le système solaire ?', ['8', '9', '7', '10'], 'A'),
      q('Quelle est la formule chimique de l\'eau ?', ['HO', 'H2O', 'H3O', 'CO2'], 'B'),
      q('Combien d\'os dans le corps humain adulte ?', ['186', '196', '206', '216'], 'C'),
      q('Quelle est l\'unité de la force ?', ['Joule', 'Watt', 'Pascal', 'Newton'], 'D'),
      q('Qui a formulé la théorie de la relativité ?', ['Einstein', 'Newton', 'Hawking', 'Bohr'], 'A'),
      q('Quel gaz respirons-nous principalement ?', ['Oxygène', 'Azote', 'CO2', 'Hydrogène'], 'B'),
      q('Quelle est la vitesse de la lumière (km/s) ?', ['150 000', '200 000', '300 000', '500 000'], 'C'),
      q('Quel est le plus gros organe du corps humain ?', ['Foie', 'Cerveau', 'Intestins', 'Peau'], 'D'),
      q('De quoi se compose l\'eau de mer principalement ?', ['Eau et sel', 'Eau et sable', 'Eau pure', 'Eau et algues'], 'A'),
      q('Quelle est l\'étoile la plus proche de la Terre ?', ['Proxima Centauri', 'Le Soleil', 'Sirius', 'Alpha Centauri'], 'B'),
      q('Qui a découvert la gravité ?', ['Galilée', 'Einstein', 'Newton', 'Copernic'], 'C'),
      q('Quel est le métal liquide à température ambiante ?', ['Fer', 'Or', 'Cuivre', 'Mercure'], 'D'),
      q('Quelle particule porte une charge négative ?', ['Électron', 'Proton', 'Neutron', 'Photon'], 'A'),
      q('Combien de chromosomes a l\'humain ?', ['44', '46', '48', '50'], 'B'),
      q('Quel scientifique a décrit la sélection naturelle ?', ['Pasteur', 'Mendel', 'Darwin', 'Lamarck'], 'C'),
    ],
  },
  
  jeux_video: {
    id: 'jeux_video',
    name: 'Jeux Vidéo',
    icon: 'Gamepad2',
    color: '#00BCD4',
    description: 'De Mario aux jeux next-gen',
    questions: [
      q('Qui est le plombier moustachu de Nintendo ?', ['Mario', 'Luigi', 'Wario', 'Bowser'], 'A'),
      q('Quel est le héros de "The Legend of Zelda" ?', ['Zelda', 'Link', 'Ganon', 'Epona'], 'B'),
      q('Dans Pokémon Rouge/Bleu, combien y a-t-il de Pokémon ?', ['100', '120', '151', '251'], 'C'),
      q('Quel studio a créé "The Witcher 3" ?', ['Ubisoft', 'Bethesda', 'Rockstar', 'CD Projekt Red'], 'D'),
      q('Quelle console est sortie en premier ?', ['NES', 'SNES', 'N64', 'GameCube'], 'A'),
      q('Qui est le héros de "Uncharted" ?', ['Lara Croft', 'Nathan Drake', 'Ezio', 'Kratos'], 'B'),
      q('Quel jeu a popularisé le genre Battle Royale ?', ['Call of Duty', 'PUBG', 'Fortnite', 'Apex'], 'C'),
      q('Dans quel jeu trouve-t-on l\'arme "Master Chief" ?', ['Call of Duty', 'Battlefield', 'Gears of War', 'Halo'], 'D'),
      q('Quel est le jeu le plus vendu de tous les temps ?', ['Minecraft', 'Tetris', 'GTA V', 'Wii Sports'], 'A'),
      q('Dans Super Mario, qui est la princesse à sauver ?', ['Daisy', 'Peach', 'Rosalina', 'Pauline'], 'B'),
      q('Quel studio a créé "Dark Souls" ?', ['Square Enix', 'Capcom', 'FromSoftware', 'Konami'], 'C'),
      q('En quelle année est sortie la PS1 ?', ['1991', '1993', '1995', '1994'], 'D'),
      q('Quel jeu Rockstar se passe dans le Far West ?', ['Red Dead Redemption', 'GTA', 'Bully', 'Max Payne'], 'A'),
      q('Qui est le créateur de Metal Gear ?', ['Miyamoto', 'Kojima', 'Suda51', 'Mikami'], 'B'),
      q('Quel jeu indépendant a gagné "Game of the Year" en 2016 ?', ['Stardew Valley', 'Undertale', 'Inside', 'Firewatch'], 'C'),
    ],
  },
  
  anime: {
    id: 'anime',
    name: 'Animés & Manga',
    icon: 'Sparkles',
    color: '#FF4081',
    description: 'Du Japon au reste du monde',
    questions: [
      q('Quel est le héros de "Dragon Ball" ?', ['Son Goku', 'Vegeta', 'Piccolo', 'Trunks'], 'A'),
      q('Quel ninja rêve de devenir Hokage ?', ['Sasuke', 'Naruto', 'Kakashi', 'Itachi'], 'B'),
      q('Dans "One Piece", quel est le rêve de Luffy ?', ['Trouver son père', 'Battre la marine', 'Devenir Roi des Pirates', 'Manger beaucoup'], 'C'),
      q('Quel studio a produit "Mon Voisin Totoro" ?', ['Madhouse', 'Bones', 'Toei Animation', 'Ghibli'], 'D'),
      q('Quel est le prénom de "L\'Attaque des Titans" protagoniste ?', ['Eren', 'Levi', 'Mikasa', 'Armin'], 'A'),
      q('Dans "Death Note", quel objet tue ?', ['Une épée', 'Un cahier', 'Un revolver', 'Une pomme'], 'B'),
      q('Quelle fruit du démon a mangé Luffy ?', ['Mera Mera', 'Hie Hie', 'Gomu Gomu', 'Yami Yami'], 'C'),
      q('Qui est le réalisateur de "Le Voyage de Chihiro" ?', ['Takahata', 'Otomo', 'Shinkai', 'Miyazaki'], 'D'),
      q('Dans "My Hero Academia", quel est le "One For All" ?', ['Un super-pouvoir', 'Une arme', 'Un lieu', 'Une équipe'], 'A'),
      q('Quel anime a popularisé le genre Magical Girl ?', ['Cardcaptor Sakura', 'Sailor Moon', 'Magic Knight Rayearth', 'Pretty Cure'], 'B'),
      q('Qui est l\'auteur de "One Piece" ?', ['Kishimoto', 'Toriyama', 'Oda', 'Kubo'], 'C'),
      q('Dans "Fullmetal Alchemist", qu\'ont perdu les frères Elric ?', ['Leur mère', 'Leur maison', 'Leur père', 'Des parties de leur corps'], 'D'),
      q('Quel anime se déroule dans l\'académie UA ?', ['My Hero Academia', 'Assassination Classroom', 'Boku no Hero', 'A et C sont justes'], 'A'),
      q('Quel manga a été récompensé pour sa narration à Angoulême 2024 ?', ['Chainsaw Man', 'Look Back', 'Jujutsu Kaisen', 'Spy x Family'], 'B'),
      q('En quelle année a été publié le premier chapitre de "One Piece" ?', ['1995', '1996', '1997', '1998'], 'C'),
    ],
  },
};

const canUseLocalStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const normalizeQuestion = (question, idx) => {
  const safeAnswers = Array.isArray(question?.answers) ? question.answers.slice(0, 4) : [];

  while (safeAnswers.length < 4) {
    safeAnswers.push('');
  }

  const correctIndex = Number.isInteger(question?.correctIndex) &&
    question.correctIndex >= 0 &&
    question.correctIndex <= 3
    ? question.correctIndex
    : 0;

  return {
    id: question?.id || `q-${idx + 1}`,
    question: typeof question?.question === 'string' ? question.question : '',
    answers: safeAnswers.map((answer) => (typeof answer === 'string' ? answer : '')),
    correctIndex,
  };
};

const normalizeCustomTheme = (theme) => {
  if (!theme || typeof theme !== 'object') return null;
  if (!Array.isArray(theme.questions) || theme.questions.length !== 15) return null;

  const name = typeof theme.name === 'string' ? theme.name.trim() : '';
  if (!name) return null;

  return {
    id: typeof theme.id === 'string' && theme.id ? theme.id : `custom-${Date.now()}`,
    name,
    icon: 'Palette',
    color: typeof theme.color === 'string' && theme.color ? theme.color : '#8B5CF6',
    description: typeof theme.description === 'string' && theme.description.trim()
      ? theme.description.trim()
      : 'Thème créé par un joueur',
    questions: theme.questions.map(normalizeQuestion),
    isCustom: true,
    createdAt: theme.createdAt || new Date().toISOString(),
  };
};

const readCustomThemes = () => {
  if (!canUseLocalStorage()) return [];

  try {
    const raw = window.localStorage.getItem(CUSTOM_THEMES_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(normalizeCustomTheme)
      .filter(Boolean);
  } catch {
    return [];
  }
};

const writeCustomThemes = (themes) => {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(themes));
};

export const saveCustomTheme = ({ name, description, color, questions }) => {
  const safeName = typeof name === 'string' ? name.trim() : '';
  if (!safeName) {
    throw new Error('Le nom du thème est requis');
  }

  if (!Array.isArray(questions) || questions.length !== 15) {
    throw new Error('Un thème doit contenir exactement 15 questions');
  }

  const nextTheme = normalizeCustomTheme({
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: safeName,
    description,
    color,
    questions,
    createdAt: new Date().toISOString(),
  });

  if (!nextTheme) {
    throw new Error('Impossible de sauvegarder ce thème');
  }

  const existingThemes = readCustomThemes();
  const updatedThemes = [...existingThemes, nextTheme];
  writeCustomThemes(updatedThemes);

  return nextTheme;
};

export const renameCustomTheme = ({ themeId, name, description, color }) => {
  const safeName = typeof name === 'string' ? name.trim() : '';
  if (!safeName) {
    throw new Error('Le nom du thème est requis');
  }

  const existingThemes = readCustomThemes();
  const themeIndex = existingThemes.findIndex((theme) => theme.id === themeId);
  if (themeIndex < 0) {
    throw new Error('Thème personnalisé introuvable');
  }

  const currentTheme = existingThemes[themeIndex];
  const updatedTheme = normalizeCustomTheme({
    ...currentTheme,
    name: safeName,
    description: typeof description === 'string' ? description : currentTheme.description,
    color: typeof color === 'string' ? color : currentTheme.color,
  });

  if (!updatedTheme) {
    throw new Error('Impossible de renommer ce thème');
  }

  const updatedThemes = [...existingThemes];
  updatedThemes[themeIndex] = updatedTheme;
  writeCustomThemes(updatedThemes);

  return updatedTheme;
};

export const deleteCustomTheme = (themeId) => {
  const existingThemes = readCustomThemes();
  const filteredThemes = existingThemes.filter((theme) => theme.id !== themeId);

  if (filteredThemes.length === existingThemes.length) {
    throw new Error('Thème personnalisé introuvable');
  }

  writeCustomThemes(filteredThemes);
};

// Get all themes as array for UI
export const getThemesList = () => [...Object.values(THEMES), ...readCustomThemes()];

export const getThemeById = (themeId) => {
  if (THEMES[themeId]) return THEMES[themeId];
  return readCustomThemes().find((theme) => theme.id === themeId) || null;
};

// Get a specific theme's questions formatted for the game
export const getThemeQuestions = (themeId) => {
  const theme = getThemeById(themeId);
  if (!theme) return null;
  
  return theme.questions.map((q, idx) => ({
    id: `q-${idx + 1}`,
    question: q.question,
    answers: q.answers,
    correctIndex: q.correctIndex,
  }));
};

// Shuffle questions randomly (Fisher-Yates)
export const shuffleQuestions = (questions) => {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Re-assign IDs to match new position
  return shuffled.map((q, idx) => ({ ...q, id: `q-${idx + 1}` }));
};
