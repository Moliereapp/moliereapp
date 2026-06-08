# Molière — Application web

Application d'enrichissement du vocabulaire français.

## Structure du projet

```
moliere/
├── pages/
│   ├── _app.tsx        → point d'entrée global
│   └── index.tsx       → page principale
├── components/
│   ├── BottomNav.tsx   → navigation
│   ├── ScreenAccueil.tsx
│   ├── ScreenQuiz.tsx
│   ├── ScreenHistorique.tsx
│   └── ScreenProfil.tsx
├── lib/
│   ├── mots.ts         → banque de mots
│   └── useLocalStorage.ts
└── styles/
    └── globals.css
```

## Déploiement sur Vercel (étape par étape)

### 1. Mettre le projet sur GitHub

1. Va sur github.com → clique le "+" en haut à droite → "New repository"
2. Nomme le repo `moliere` → clique "Create repository"
3. Sur la page du repo, clique "uploading an existing file"
4. Glisse tous les fichiers du projet dans la zone → clique "Commit changes"

### 2. Déployer sur Vercel

1. Va sur vercel.com → clique "Add New Project"
2. Sélectionne ton repo `moliere`
3. Vercel détecte Next.js automatiquement → clique "Deploy"
4. Ton app est en ligne en 2 minutes !

### 3. Ajouter les variables d'environnement (optionnel pour l'instant)

Dans Vercel → Settings → Environment Variables, ajoute :
- `ANTHROPIC_API_KEY` → ta clé API Anthropic

## Développement local

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000
