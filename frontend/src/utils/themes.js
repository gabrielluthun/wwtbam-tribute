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
      q('Quel est le plus long fleuve de France ?', ['Loire', 'Rhône', 'Seine', 'Garonne'], 'A'),
      q('En quelle année la Tour Eiffel a-t-elle été inaugurée ?', ['1885', '1887', '1889', '1900'], 'C'),
      q('Combien de régions administratives compte la France métropolitaine depuis 2016 ?', ['11', '12', '13', '14'], 'C'),
      q('Quel pays est le premier producteur mondial de café ?', ['Colombie', 'Vietnam', 'Éthiopie', 'Brésil'], 'D'),
      q('Qui a peint "Le Radeau de la Méduse" ?', ['Delacroix', 'Géricault', 'David', 'Courbet'], 'B'),
      q('Dans quelle ville se trouve le musée du Prado ?', ['Barcelone', 'Madrid', 'Séville', 'Lisbonne'], 'B'),
      q('Quelle est la plus grande île du monde ?', ['Bornéo', 'Nouvelle-Guinée', 'Madagascar', 'Groenland'], 'D'),
      q('Combien d\'États ont signé le traité de Rome fondateur de la CEE en 1957 ?', ['4', '5', '6', '7'], 'C'),
      q('Quel philosophe a écrit "Critique de la raison pure" ?', ['Hegel', 'Kant', 'Hume', 'Schopenhauer'], 'B'),
      q('En quelle année Copernic a-t-il publié "De revolutionibus orbium coelestium" ?', ['1503', '1523', '1543', '1573'], 'C'),
      q('Quelle bataille de 1515 vit la victoire de François Ier sur les Suisses ?', ['Azincourt', 'Marignan', 'Pavie', 'Castillon'], 'B'),
      q('Qui était le premier secrétaire général de l\'ONU (1946-1952) ?', ['Dag Hammarskjöld', 'Trygve Lie', 'U Thant', 'Kurt Waldheim'], 'B'),
      q('Quel mathématicien a démontré le dernier théorème de Fermat ?', ['Grigori Perelman', 'John Nash', 'Andrew Wiles', 'Terence Tao'], 'C'),
      q('Quelle langue fut la principale langue de la diplomatie européenne du XVIIe au XXe siècle ?', ['Latin', 'Espagnol', 'Anglais', 'Français'], 'D'),
      q('Qui a remporté le prix Nobel de littérature en 2023 ?', ['Annie Ernaux', 'Salman Rushdie', 'Jon Fosse', 'Olga Tokarczuk'], 'C'),
    ],
  },

  sport: {
    id: 'sport',
    name: 'Sport',
    icon: 'Trophy',
    color: '#FF6B35',
    description: 'Défiez-vous sur le sport mondial',
    questions: [
      q('Quelle distance court-on lors d\'un marathon ?', ['40,195 km', '41,195 km', '42,195 km', '44,195 km'], 'C'),
      q('Combien de joueurs compose une équipe de hockey sur glace sur la glace (gardien compris) ?', ['5', '6', '7', '8'], 'B'),
      q('Quel pays a remporté la Coupe du Monde de football 2022 au Qatar ?', ['France', 'Brésil', 'Argentine', 'Maroc'], 'C'),
      q('Combien de points vaut un drop-goal au rugby à XV ?', ['2', '3', '4', '5'], 'B'),
      q('En combien d\'épreuves se dispute le décathlon ?', ['8', '9', '10', '12'], 'C'),
      q('Quel club a remporté le plus de titres de champion de Ligue 1 ?', ['PSG', 'Marseille', 'Lyon', 'Saint-Étienne'], 'D'),
      q('En quelle année le Brésil a-t-il remporté sa toute première Coupe du Monde ?', ['1950', '1954', '1958', '1962'], 'C'),
      q('Quel est le record du monde masculin du 100 mètres établi par Usain Bolt en 2009 ?', ['9,58 s', '9,63 s', '9,69 s', '9,74 s'], 'A'),
      q('Quel pays a remporté le plus de Coupes du Monde de football ?', ['Brésil', 'Allemagne', 'Italie', 'Argentine'], 'A'),
      q('En quelle année Lance Armstrong a-t-il officiellement été dépossédé de ses titres du Tour de France ?', ['2010', '2011', '2012', '2013'], 'C'),
      q('Quel pays a accueilli les premiers Jeux Olympiques d\'hiver de l\'histoire ?', ['Suisse', 'Autriche', 'France', 'Norvège'], 'C'),
      q('Quel joueur détient le record absolu de titres en Grand Chelem masculin ?', ['Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Pete Sampras'], 'C'),
      q('Quel est le seul joueur à avoir remporté la Coupe du Monde de football à deux reprises ?', ['Maradona', 'Pelé', 'Ronaldo', 'Zidane'], 'B'),
      q('Quel pays détient le record absolu de victoires en Coupe Davis ?', ['Australie', 'États-Unis', 'Espagne', 'France'], 'B'),
      q('Quel est le seul pays à avoir participé à toutes les éditions de la Coupe du Monde ?', ['Uruguay', 'Brésil', 'Italie', 'France'], 'B'),
    ],
  },

  cinema: {
    id: 'cinema',
    name: 'Cinéma',
    icon: 'Film',
    color: '#E91E63',
    description: 'Le 7ème art n\'aura plus de secrets pour vous',
    questions: [
      q('Qui a réalisé "Titanic" (1997) et "Avatar" (2009) ?', ['James Cameron', 'Steven Spielberg', 'Roland Emmerich', 'Ron Howard'], 'A'),
      q('Quelle actrice incarne l\'agent Clarice Starling dans "Le Silence des Agneaux" (1991) ?', ['Sigourney Weaver', 'Jodie Foster', 'Meryl Streep', 'Susan Sarandon'], 'B'),
      q('Quel film de 1999 a popularisé l\'effet visuel dit "bullet time" ?', ['Dark City', 'eXistenZ', 'Matrix', 'Strange Days'], 'C'),
      q('Dans quel film Humphrey Bogart prononce-t-il la réplique "Here\'s looking at you, kid" ?', ['Key Largo', 'The Maltese Falcon', 'To Have and Have Not', 'Casablanca'], 'D'),
      q('Quel réalisateur est à l\'origine de "2001 : L\'Odyssée de l\'espace" et d\'"Orange Mécanique" ?', ['Ridley Scott', 'Stanley Kubrick', 'John Cassavetes', 'Robert Altman'], 'B'),
      q('Qui a réalisé "Blade Runner" en 1982 ?', ['James Cameron', 'John Carpenter', 'David Cronenberg', 'Ridley Scott'], 'D'),
      q('Quel film de Martin Scorsese (1990) met en scène Ray Liotta, Joe Pesci et Robert De Niro ?', ['Les Affranchis', 'Casino', 'Mean Streets', 'The Departed'], 'A'),
      q('Quel acteur a remporté l\'Oscar du meilleur acteur pour son rôle dans "Philadelphia" (1993) ?', ['Dustin Hoffman', 'Jack Nicholson', 'Tom Hanks', 'Al Pacino'], 'C'),
      q('Quel film de 1950, avec Bette Davis, dépeint les rivalités impitoyables dans le monde du théâtre new-yorkais ?', ['Sunset Boulevard', 'Tout sur Ève', 'The Philadelphia Story', 'Stage Fright'], 'B'),
      q('Qui a composé la bande originale d\'"Il était une fois dans l\'Ouest" de Sergio Leone (1968) ?', ['Nino Rota', 'Bernard Herrmann', 'Dimitri Tiomkin', 'Ennio Morricone'], 'D'),
      q('Quel film français de 1939, signé Jean Renoir, est régulièrement cité parmi les plus grands films de l\'histoire du cinéma ?', ['La Règle du jeu', 'La Bête humaine', 'Les Enfants du paradis', 'Pépé le Moko'], 'A'),
      q('Quel réalisateur japonais est l\'auteur de "Rashomon" (1950) et des "Sept Samouraïs" (1954) ?', ['Yasujiro Ozu', 'Kenji Mizoguchi', 'Akira Kurosawa', 'Nagisa Oshima'], 'C'),
      q('Quel acteur est le seul à avoir reçu l\'Oscar du meilleur acteur à titre posthume, pour son rôle dans "Network" (1976) ?', ['Dustin Hoffman', 'Peter Finch', 'Jack Nicholson', 'William Holden'], 'B'),
      q('Quel réalisateur suédois est l\'auteur du "Septième Sceau" (1957) et de "Persona" (1966) ?', ['Victor Sjöström', 'Bo Widerberg', 'Alf Sjöberg', 'Ingmar Bergman'], 'D'),
      q('Quel film de 1941, souvent désigné comme le plus grand film de tous les temps, était le premier long métrage de son réalisateur, alors âgé de 25 ans ?', ['Citizen Kane', 'The Magnificent Ambersons', 'Touch of Evil', 'The Lady from Shanghai'], 'A'),
    ],
  },

  musique: {
    id: 'musique',
    name: 'Musique',
    icon: 'Music',
    color: '#9C27B0',
    description: 'De Mozart aux tubes actuels',
    questions: [
      q('Combien de touches comporte un piano standard ?', ['49', '61', '78', '88'], 'D'),
      q('En quelle année les Beatles se sont-ils officiellement séparés ?', ['1968', '1969', '1970', '1971'], 'C'),
      q('Qui a composé "La Flûte enchantée" ?', ['Beethoven', 'Mozart', 'Haydn', 'Schubert'], 'B'),
      q('Quel est l\'instrument principal de Miles Davis ?', ['Saxophone', 'Trompette', 'Guitare', 'Contrebasse'], 'B'),
      q('En quelle année Michael Jackson a-t-il sorti l\'album "Thriller" ?', ['1980', '1982', '1984', '1986'], 'B'),
      q('Quel compositeur français a écrit "Boléro" ?', ['Debussy', 'Saint-Saëns', 'Ravel', 'Bizet'], 'C'),
      q('Quel est le vrai nom de Lady Gaga ?', ['Beyoncé Knowles', 'Robyn Fenty', 'Stefani Germanotta', 'Onika Maraj'], 'C'),
      q('En quelle année Elvis Presley est-il décédé ?', ['1975', '1977', '1979', '1981'], 'B'),
      q('Quel instrument joue le célèbre musicien Yo-Yo Ma ?', ['Violon', 'Alto', 'Violoncelle', 'Contrebasse'], 'C'),
      q('En quelle année "The Dark Side of the Moon" de Pink Floyd a-t-il été publié ?', ['1971', '1973', '1975', '1977'], 'B'),
      q('Quelle chanteuse de jazz américaine a interprété "Strange Fruit", hymne contre le lynchage racial, pour la première fois en 1939 ?', ['Ella Fitzgerald', 'Billie Holiday', 'Nina Simone', 'Bessie Smith'], 'B'),
      q('Qui a composé l\'opéra "Carmen" ?', ['Verdi', 'Rossini', 'Bizet', 'Puccini'], 'C'),
      q('En quelle année Jim Morrison est-il décédé à Paris ?', ['1969', '1971', '1973', '1975'], 'B'),
      q('Quel guitariste britannique est surnommé "Slowhand" ?', ['Jimi Hendrix', 'Carlos Santana', 'Eric Clapton', 'Jeff Beck'], 'C'),
      q('Quel compositeur est l\'auteur du cycle de quatre opéras "L\'Anneau du Nibelung" ?', ['Johannes Brahms', 'Gustav Mahler', 'Richard Wagner', 'Richard Strauss'], 'C'),
    ],
  },

  sciences: {
    id: 'sciences',
    name: 'Sciences',
    icon: 'Atom',
    color: '#4CAF50',
    description: 'Physique, chimie, biologie et plus',
    questions: [
      q('Quel est le symbole chimique du potassium ?', ['Po', 'Pt', 'K', 'Ka'], 'C'),
      q('Combien de protons contient le noyau d\'un atome d\'hélium ?', ['1', '2', '3', '4'], 'B'),
      q('Quelle est la vitesse approximative du son dans l\'air à 20 °C ?', ['240 m/s', '290 m/s', '343 m/s', '450 m/s'], 'C'),
      q('Quelle loi stipule que la pression d\'un gaz est inversement proportionnelle à son volume à température constante ?', ['Loi de Boyle-Mariotte', 'Loi de Charles', 'Loi de Gay-Lussac', 'Loi d\'Avogadro'], 'A'),
      q('Quelle est la valeur approximative du nombre d\'Avogadro ?', ['3,14 × 10²³', '6,02 × 10²²', '6,02 × 10²⁴', '6,02 × 10²³'], 'D'),
      q('En quelle année Marie Curie a-t-elle remporté son premier prix Nobel (de Physique) ?', ['1898', '1903', '1906', '1911'], 'B'),
      q('Quel est le gaz le plus abondant dans l\'atmosphère terrestre ?', ['Oxygène', 'Argon', 'Azote', 'CO2'], 'C'),
      q('Quelle est la demi-vie approximative du carbone 14, utilisé en datation archéologique ?', ['5 730 ans', '570 ans', '57 300 ans', '573 000 ans'], 'A'),
      q('Quel physicien a unifié l\'électricité et le magnétisme en formulant ses équations au XIXe siècle ?', ['Faraday', 'Hertz', 'Ampère', 'Maxwell'], 'D'),
      q('Quelle planète possède le plus grand nombre de lunes confirmées dans le système solaire (2024) ?', ['Jupiter', 'Saturne', 'Uranus', 'Neptune'], 'B'),
      q('Quelle est l\'unité structurelle de base de l\'ADN ?', ['Acide aminé', 'Glucose', 'Nucléotide', 'Phospholipide'], 'C'),
      q('À quelle température approximative l\'eau bout-elle au sommet de l\'Everest (8 849 m) ?', ['70 °C', '80 °C', '90 °C', '100 °C'], 'A'),
      q('Quel élément chimique de numéro atomique 79 est utilisé en bijouterie et en finance mondiale ?', ['Argent', 'Platine', 'Mercure', 'Or'], 'D'),
      q('Quel phénomène décrit la courbure des rayons lumineux par la gravité d\'un objet massif ?', ['Effet Doppler', 'Lentille gravitationnelle', 'Effet Compton', 'Parallaxe'], 'B'),
      q('Quelle constante relie l\'énergie d\'un photon à sa fréquence dans la relation E = hf ?', ['Constante de Boltzmann', 'Constante de Faraday', 'Constante de Planck', 'Constante de Neper'], 'C'),
    ],
  },

  jeux_video: {
    id: 'jeux_video',
    name: 'Jeux Vidéo',
    icon: 'Gamepad2',
    color: '#00BCD4',
    description: 'De Mario aux jeux next-gen',
    questions: [
      q('En quelle année est sorti le jeu "Pac-Man" en arcade pour la première fois ?', ['1978', '1979', '1980', '1982'], 'C'),
      q('Quel est le nom du protagoniste de la série "Half-Life" de Valve ?', ['Gordon Freeman', 'Isaac Clarke', 'Marcus Fenix', 'Alyx Vance'], 'A'),
      q('Quel studio a créé la franchise "Grand Theft Auto" ?', ['Ubisoft', 'EA Games', 'Activision', 'Rockstar Games'], 'D'),
      q('Dans quel jeu incarne-t-on le sorceleur Geralt de Riv ?', ['Dark Souls', 'The Witcher', 'Dragon Age', 'Skyrim'], 'B'),
      q('Quelle est la console de salon la plus vendue de l\'histoire (environ 155 millions d\'unités) ?', ['PS2', 'Nintendo DS', 'Wii', 'Game Boy'], 'A'),
      q('En quelle année est sorti le premier "Doom" d\'id Software ?', ['1990', '1991', '1992', '1993'], 'D'),
      q('Quel est le nom du héros de la saga "God of War" ?', ['Kratos', 'Zeus', 'Ares', 'Odin'], 'A'),
      q('Quel jeu de FromSoftware a remporté le prix GOTY aux Game Awards 2022 ?', ['Dark Souls III', 'Sekiro', 'Bloodborne', 'Elden Ring'], 'D'),
      q('En quelle année est sorti "Final Fantasy VII" au Japon ?', ['1995', '1996', '1997', '1998'], 'C'),
      q('Quel jeu de stratégie en temps réel, sorti en 1998, est considéré comme un pilier du genre ?', ['Command & Conquer', 'StarCraft', 'Age of Empires', 'Warcraft II'], 'B'),
      q('Qui a composé la bande originale de "The Legend of Zelda : Ocarina of Time" ?', ['Nobuo Uematsu', 'Yasunori Mitsuda', 'Yoko Shimomura', 'Koji Kondo'], 'D'),
      q('Quelle entreprise a développé le moteur graphique Unreal Engine ?', ['Crytek', 'id Software', 'Epic Games', 'Valve'], 'C'),
      q('En quelle année l\'Atari 2600 a-t-il été commercialisé ?', ['1975', '1977', '1979', '1981'], 'B'),
      q('Quel studio indépendant australien a développé "Hollow Knight" ?', ['Supergiant Games', 'Team Cherry', 'Motion Twin', 'Devolver Digital'], 'B'),
      q('Quel jeu de 1999 est généralement crédité d\'avoir popularisé les "Quick Time Events" dans les jeux d\'action modernes ?', ['Resident Evil 4', 'Devil May Cry', 'Shenmue', 'God of War'], 'C'),
    ],
  },

  adultes_18: {
    id: 'adultes_18',
    name: '18+ Piquant',
    icon: 'Flame',
    color: '#FF1744',
    adult: true,
    description: 'Réservé aux adultes : nuit, cocktails, sujets coquins',
    questions: [
      q('Quels sont les trois ingrédients de base d\'un Negroni ?', ['Vodka, Campari, Vermouth', 'Rhum, Campari, Citron', 'Gin, Campari, Vermouth doux', 'Whisky, Campari, Vermouth sec'], 'C'),
      q('Dans quelle capitale européenne se trouve le quartier autogéré de Christiania, connu pour sa permissivité ?', ['Amsterdam', 'Bruxelles', 'Copenhague', 'Stockholm'], 'C'),
      q('Quel est l\'alcool de base d\'un Cosmopolitan ?', ['Gin', 'Vodka', 'Tequila', 'Bourbon'], 'B'),
      q('Selon les études médicales, combien de temps dure en moyenne un rapport (hors préliminaires) ?', ['1 minute', 'Environ 5 minutes', '30 minutes', '1 heure'], 'B'),
      q('Quel alcool est obtenu par distillation du jus de canne à sucre ?', ['Vodka', 'Tequila', 'Whisky', 'Rhum'], 'D'),
      q('Quel organe humain compte environ 8 000 terminaisons nerveuses, le plus dense du corps humain ?', ['Le gland', 'Le clitoris', 'La langue', 'Le téton'], 'B'),
      q('Quelle est la molécule responsable de l\'ivresse dans les boissons alcoolisées ?', ['Le méthanol', 'L\'éthanol', 'Le propanol', 'Le butanol'], 'B'),
      q('Dans l\'Antiquité romaine, qu\'étaient les "lupanars" ?', ['Des temples', 'Des maisons closes', 'Des thermes', 'Des arènes'], 'B'),
      q('Quelle hormone est surnommée "hormone de l\'amour" ou de l\'attachement ?', ['Dopamine', 'Sérotonine', 'Ocytocine', 'Adrénaline'], 'C'),
      q('En quelle année les Pays-Bas ont-ils officiellement légalisé les maisons closes ?', ['1985', '1992', '2000', '2008'], 'C'),
      q('Quel terme japonais désigne les estampes érotiques dont "Le Rêve de la femme du pêcheur" d\'Hokusai est un exemple célèbre ?', ['Shunga', 'Hentai', 'Kinbaku', 'Ukiyo-e'], 'A'),
      q('En quelle année le cabaret du Moulin Rouge a-t-il ouvert ses portes à Paris ?', ['1879', '1889', '1899', '1909'], 'B'),
      q('Quel écrivain français, mort en 1814, donna son nom au mot "sadisme" ?', ['Balzac', 'Hugo', 'Le Marquis de Sade', 'Flaubert'], 'C'),
      q('Combien de positions sont traditionnellement décrites dans le Kâma-Sûtra ?', ['64', '108', '216', '365'], 'A'),
      q('Quel auteur français a publié le roman érotique surréaliste "Histoire de l\'œil" sous pseudonyme en 1928 ?', ['Henry Miller', 'André Breton', 'Georges Bataille', 'Jean Genet'], 'C'),
    ],
  },

  sexe_anatomie: {
    id: 'sexe_anatomie',
    name: 'Sexe & Anatomie',
    icon: 'Heart',
    color: '#FF0266',
    adult: true,
    description: 'Quiz explicite : anatomie, pratiques et culture adulte',
    questions: [
      q('Quelle glande endocrine est principalement responsable de la production de testostérone chez l\'homme ?', ['Les surrénales', 'Les testicules', 'L\'hypophyse', 'La thyroïde'], 'B'),
      q('Combien de paires de lèvres composent la vulve ?', ['1 paire', '2 paires', '3 paires', '4 paires'], 'B'),
      q('Quelle glande sécrète environ 30 % du volume du sperme ?', ['Les surrénales', 'La prostate', 'La thyroïde', 'Le pancréas'], 'B'),
      q('Où se situe le "point G" selon les anatomistes ?', ['Sur le clitoris externe', 'Sur la paroi antérieure du vagin', 'Au col de l\'utérus', 'Sur les grandes lèvres'], 'B'),
      q('Selon une méta-analyse de 2014, quelle est la taille moyenne d\'un pénis en érection ?', ['Environ 11 cm', 'Environ 13 cm', 'Environ 16 cm', 'Environ 18 cm'], 'B'),
      q('Quelle proportion du clitoris est en réalité interne (non visible) ?', ['Environ 30 %', 'Environ 50 %', 'Environ 70 %', 'Environ 90 %'], 'D'),
      q('Combien de spermatozoïdes environ contient une éjaculation moyenne ?', ['1 million', '40 millions', '200 à 500 millions', '2 milliards'], 'C'),
      q('Quel terme anglais désigne l\'éjaculation féminine par les glandes de Skène ?', ['Squirting', 'Blowing', 'Gushing', 'Teasing'], 'A'),
      q('Quelle pratique consiste à prolonger le plaisir en retardant volontairement l\'orgasme ?', ['Gooning', 'Edging', 'Pegging', 'Rimming'], 'B'),
      q('Quels trophées sont surnommés "les Oscars du porno" aux États-Unis ?', ['AVN Awards', 'XBIZ Awards', 'Hot d\'Or', 'Venus Awards'], 'A'),
      q('Quelle pratique sexuelle consiste à introduire la main entière (vaginale ou anale) ?', ['Rimming', 'Fisting', 'Pegging', 'Docking'], 'B'),
      q('Quel pays produit le plus grand nombre de films pornographiques par an (estimation industrie) ?', ['États-Unis', 'Japon', 'Allemagne', 'France'], 'B'),
      q('Dans la mythologie grecque, quel dieu mineur de la fertilité est représenté avec un phallus surdimensionné ?', ['Dionysos', 'Pan', 'Priape', 'Éros'], 'C'),
      q('Quel art japonais d\'attachement érotique à la corde est devenu un classique du BDSM ?', ['Kabuki', 'Shibari', 'Ikebana', 'Kintsugi'], 'B'),
      q('Quel psychiatre austro-allemand a fondé la sexologie moderne avec "Psychopathia Sexualis" (1886) ?', ['Sigmund Freud', 'Krafft-Ebing', 'Alfred Kinsey', 'Magnus Hirschfeld'], 'B'),
    ],
  },

  anime: {
    id: 'anime',
    name: 'Animés & Manga',
    icon: 'Sparkles',
    color: '#FF4081',
    description: 'Du Japon au reste du monde',
    questions: [
      q('Qui est l\'auteur du manga "Dragon Ball" ?', ['Eiichiro Oda', 'Masashi Kishimoto', 'Tite Kubo', 'Akira Toriyama'], 'D'),
      q('Quel est le nom du neuf-queues scellé dans le corps de Naruto Uzumaki ?', ['Gyûki', 'Shukaku', 'Kurama', 'Matatabi'], 'C'),
      q('Dans "L\'Attaque des Titans", quel est le vrai nom du porteur du Titan Colossale ?', ['Reiner Braun', 'Bertolt Hoover', 'Zeke Yeager', 'Annie Leonhart'], 'B'),
      q('Qui a réalisé le film d\'animation "Akira" (1988) ?', ['Mamoru Oshii', 'Katsuhiro Otomo', 'Hideaki Anno', 'Satoshi Kon'], 'B'),
      q('Comment s\'appelle l\'équipage de Monkey D. Luffy dans "One Piece" ?', ['Les Pirates au Chapeau de Paille', 'Les Pirates de l\'Est Bleu', 'Les Pirates du Nouveau Monde', 'Les Pirates de la Liberté'], 'A'),
      q('Quel studio d\'animation a produit "Neon Genesis Evangelion" ?', ['Toei Animation', 'Madhouse', 'Gainax', 'Bones'], 'C'),
      q('En quelle année a débuté la diffusion de "Fullmetal Alchemist : Brotherhood" ?', ['2003', '2006', '2007', '2009'], 'D'),
      q('Quel mangaka a créé "Berserk", décédé avant d\'achever son œuvre en 2021 ?', ['Junji Ito', 'Kentaro Miura', 'Hajime Isayama', 'Naoki Urasawa'], 'B'),
      q('Dans "Hunter x Hunter", quel est le nom du système de pouvoirs utilisé par les personnages ?', ['Chakra', 'Ki', 'Nen', 'Haki'], 'C'),
      q('Quel film de Makoto Shinkai a battu des records au box-office japonais en 2016 ?', ['Your Name', '5 Centimètres par Seconde', 'Suzume', 'Weathering with You'], 'A'),
      q('Quel est le vrai nom complet du personnage connu sous le pseudonyme "L" dans "Death Note" ?', ['Lawliet L', 'L Lind', 'Lawrence L', 'L Lawliet'], 'D'),
      q('Quel est le surnom d\'Edward Elric dans "Fullmetal Alchemist" ?', ['L\'Alchimiste de Fer', 'L\'Alchimiste d\'Acier', 'L\'Alchimiste de Feu', 'L\'Alchimiste d\'État'], 'B'),
      q('Dans "Demon Slayer", comment appelle-t-on le système de combat des Tueurs de Démons basé sur la respiration ?', ['Style total', 'Concentration du Souffle', 'Respiration', 'Hashira'], 'C'),
      q('Quel film du studio Ghibli a remporté l\'Oscar du meilleur film d\'animation en 2003 ?', ['Princesse Mononoké', 'Nausicaä', 'Mon Voisin Totoro', 'Le Voyage de Chihiro'], 'D'),
      q('Quel mangaka a créé "Monster", thriller psychologique acclamé pour sa narration adulte ?', ['Naoki Urasawa', 'Junji Ito', 'Osamu Tezuka', 'Go Nagai'], 'A'),
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
