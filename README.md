# QVGDM — Qui Veut Gagner Des Millions ?

Application web de quiz inspirée du jeu télévisé **Qui veut gagner des millions ?**. Vous composez **15 questions** à quatre réponses, puis vous jouez pour gravir les **15 paliers** jusqu’au gain maximal.

---

## Aperçu de l’interface

En partie, l’écran est organisé ainsi :

- **En-tête** : retour et volume à gauche ; au centre, les **trois jokers** (50:50, appel à un ami, avis du public) ; à droite, le bouton pour **partir avec les gains** affichés.
- **Zone centrale** : indicatif **QUESTION n** et **montant du palier** au-dessus d’un grand bandeau pour l’intitulé ; en dessous, les **quatre réponses** en grille 2×2 (pastilles A à D).
- **Colonne « Gains »** à droite : pyramide des **15 niveaux** avec les montants ; le palier courant est mis en évidence ; certains niveaux correspondent à des **seuils de sécurité** (repères visuels sur la liste).
- **Pied de page** : raccourcis pour quitter ou afficher la pyramide selon la taille d’écran.

**Exemple de question :**
![Question](/docs/screenshots/ecran-question.png)

---

## Fonctionnalités

| Domaine | Détail |
|--------|--------|
| **Modes** | Solo ou **multijoueur local** (2 joueurs, tours alternés) |
| **Questions** | 15 questions, 4 propositions, une seule bonne réponse par question |
| **Jokers** | 50:50, téléphone (conseil simulé), avis du public (pourcentages) — **une utilisation chacun** par partie |
| **Timer** | Optionnel, pour limiter le temps par question |
| **Données** | Import / export des quiz en **JSON**, **thèmes** réutilisables |
| **Ambiance** | Sons par palier, interface sombre type plateau TV |

---

## Règles en bref

- Une **mauvaise réponse** termine la manche ; le gain retenu correspond au **dernier palier de sécurité** déjà franchi le cas échéant (sinon 0 €), comme dans le jeu télévisé.
- Vous pouvez **vous arrêter** à tout moment et repartir avec le montant du dernier palier que vous avez **validé** en répondant correctement.
- En mode **chrono**, chaque question est soumise au temps imparti.

---

## Parcours habituel

1. **Accueil** — Choisir solo ou multijoueur et entrer les prénoms si besoin.
2. **Création du quiz** — Rédiger les 15 questions, cocher la bonne réponse, naviguer entre les questions ; importer un fichier JSON si vous en avez un.
3. **Partie** — Lancer le jeu, utiliser les jokers au bon moment, confirmer la réponse (« dernier mot »), suivre la progression sur la pyramide.

---

## Lancer l’application en local

Le jeu s’exécute dans le navigateur via le frontend React.

```bash
cd frontend
npm install
npm start
```

Ouvrez l’URL indiquée dans le terminal (souvent `http://localhost:3000`).

Le dépôt contient aussi un backend **FastAPI** (ex. pour des extensions avec base de données) ; **le flux de jeu actuel ne dépend pas de ce serveur** pour fonctionner en local.

---

## Technique (résumé)

- **Frontend** : React, React Router, Tailwind CSS, Framer Motion (animations).
- **Contenu** : questions et paliers gérés côté client (stockage local / import-export selon les écrans).

---

## Remarque

Projet **ludique et non officiel**, hommage au format télévisé — destiné aux parties entre amis, en famille ou en classe.
