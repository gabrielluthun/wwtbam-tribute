# Qui Veut Gagner des Millions - PRD

## Problème Original
L'utilisateur souhaite créer une application "Qui Veut Gagner des Millions" fidèle à l'émission TV française avec:
- Création de questions personnalisées (15 questions avec 4 réponses chacune)
- Mode solo et multijoueur
- Jokers classiques (50:50, appel à un ami, avis du public)
- Design fidèle à l'émission (encadré des questions, animations, passage des paliers)
- Musiques et effets sonores pour chaque palier
- Pyramide des gains avec les 15 paliers d'argent

## User Personas
1. **Animateur/Créateur de quiz** : Crée les questions pour animer une soirée
2. **Joueur solo** : Teste ses connaissances avec ses propres questions
3. **Groupe d'amis** : Joue en mode multijoueur lors de soirées

## Core Requirements (Static)
- 15 questions avec 4 réponses (A, B, C, D)
- 1 bonne réponse par question
- 3 jokers utilisables une fois
- Pyramide des gains : 100€ → 1 000 000€
- Paliers de sécurité : 1 000€, 24 000€, 1 000 000€
- Animations de sélection, bonne/mauvaise réponse
- Effets sonores atmosphériques

## What's Been Implemented ✅ (18 Jan 2026)
### Frontend
- **Page d'accueil** : Logo stylisé, boutons Solo/Multijoueur, info box
- **Page Setup** : 
  - Formulaire de création de 15 questions
  - Navigation entre questions
  - Sélection de la bonne réponse (badge vert)
  - Indicateur de progression
  - Noms des joueurs en mode multi
- **Page Game** :
  - Interface fidèle à l'émission TV
  - Question dans cadre bleu avec bordure cyan
  - 4 boutons réponses hexagonaux (A/B/C/D)
  - Pyramide des gains (15 niveaux) à droite
  - 3 jokers fonctionnels :
    - 50:50 : élimine 2 mauvaises réponses
    - Téléphone : affiche dialogue avec conseil simulé
    - Public : affiche graphique avec pourcentages
  - Animation de sélection (pulse doré)
  - Confirmation "C'est mon dernier mot !"
  - Délai de tension avant révélation
  - Animations bonne/mauvaise réponse
  - Bouton "Partir avec X €"
  - Écran de fin (victoire/défaite/million)
  - Mode multijoueur avec alternance de tours

### Design
- Thème sombre fidèle à l'émission
- Couleurs : Bleu nuit, Or (#FFD700), Cyan (#00E5FF)
- Polices : Chivo (titres), Outfit (corps)
- Effets glassmorphisme
- Animations framer-motion

## Prioritized Backlog

### P0 (Critical) - Done ✅
- [x] Création de questions
- [x] Interface de jeu complète
- [x] Jokers fonctionnels
- [x] Pyramide des gains
- [x] Animations

### P1 (Important)
- [ ] Améliorer les sons (actuellement mixkit, prévoir sons personnalisés)
- [ ] Mode "Import JSON" pour charger des questions pré-faites
- [ ] Sauvegarde des meilleurs scores (localStorage)

### P2 (Nice to have)
- [ ] Mode "Question aléatoire" (mélange l'ordre)
- [ ] Timer par question
- [ ] Thèmes de questions (culture, sport, etc.)
- [ ] Export des questions en JSON
- [ ] Mode spectateur pour le multijoueur

## Architecture
```
/app/frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx        # Page d'accueil
│   │   ├── SetupQuestions.jsx  # Création des questions
│   │   └── Game.jsx        # Interface de jeu
│   ├── components/
│   │   ├── AnswerButton.jsx    # Boutons réponses hexagonaux
│   │   ├── MoneyTree.jsx       # Pyramide des gains
│   │   └── Jokers.jsx          # Jokers + dialogues
│   └── utils/
│       ├── gameData.js     # Constantes, niveaux, helpers
│       └── sounds.js       # Gestionnaire de sons
```

## Next Tasks
1. Ajouter des sons personnalisés de meilleure qualité
2. Implémenter l'import/export de questions JSON
3. Ajouter un mode timer optionnel
