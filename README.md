# Midnight Academy — Course 1 Preflop — Modern Premium

Single-page Vite frontend for the Midnight Academy preflop course experience.

## Goals
- Dark-only responsive course UI
- Accessible in-page navigation for chapters `A1`-`A7` and drills `D1`-`D4`
- Local progress persistence with completion state, score, streak, and milestone badges
- GitHub Pages-safe asset handling via the existing Vite `base` config

## Dev
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## QA Notes
- The app renders course content from the markdown files in `src/content` using raw Vite imports.
- Diagram references are rewritten to `public/assets/diagrams` at runtime so the built site respects the configured Vite base path.
- Progress data is stored in `localStorage` under the key `midnight-academy-progress`.

## Deploy
Deployment is handled via GitHub Actions to GitHub Pages on push to `main`.
