# RIT 3D Quiz Portal

Ramco Institute of Technology interactive 3D department and quiz portal built with React, TypeScript and Vite.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

This project is preconfigured for Vercel with `vercel.json`.

### Option 1 — Vercel Dashboard

1. Push this folder to a GitHub repository.
2. Open Vercel and import the repository.
3. Vercel detects Vite automatically.
4. Keep the build command as `npm run build`.
5. Keep the output directory as `dist`.
6. Deploy.

### Option 2 — Vercel CLI

```bash
npm install
npm install -g vercel
vercel
```

For production:

```bash
vercel --prod
```

The SPA rewrite in `vercel.json` keeps direct URLs working correctly.

## Important

The current leaderboard/user storage is browser-local storage. A Vercel deployment makes the website publicly accessible, but it does not create a shared cloud database. A future database layer can be added for global cross-device scores.
