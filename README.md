# Hackathon 2026 – CFI-CIRAS

Application Next.js (app router) pour présenter et administrer le Hackathon 2026 du CFI-CIRAS.

## Pré-requis

- Node.js 18+ recommandé
- npm (fourni avec Node.js)

## Installation

Dans le dossier du projet :

```bash
npm install
```

## Démarrer le serveur de développement

```bash
npm run dev
```

Par défaut, l’application est accessible sur :

- http://localhost:9002/

## Pages principales

- `/` : page d’accueil du hackathon (héros, sections, formulaire d’inscription).
- `/results` : page publique des résultats.
- `/login` : connexion à l’interface administrateur.
- `/admin` : interface d’administration (inscriptions, résultats, monitoring, paramètres, etc.).

## Scripts npm disponibles

- `npm run dev` : lance le serveur de développement.
- `npm run build` : construit l’application pour la production.
- `npm start` : démarre l’application construite.
- `npm run lint` : lance les vérifications ESLint.
- `npm run typecheck` : vérifie les types TypeScript.

## Structure du projet

- `src/app` : pages Next.js (app router).
- `src/components` : composants UI et sections.
- `src/context` : contextes React (authentification, inscriptions, événement).
- `src/lib` : types et utilitaires partagés.

## Git & fichiers ignorés

Le fichier `.gitignore` est configuré pour ignorer :

- `node_modules`, `.next`, fichiers de build et de couverture de tests.
- Éventuels sous-dossiers utilitaires dans `src` (`src/node_modules`, `src/.next`, `src/coverage`, etc.).

Tu peux maintenant committer en toute sécurité sans ajouter les fichiers de build ou les dépendances.
