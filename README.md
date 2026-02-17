# Trainer Assessment Frontend

React + Vite frontend for the Trainer Assessment System.

## Setup

1. Install dependencies:
   `npm install`
2. Create `.env` (or copy from `.env.example`) and set:
   `VITE_API_BASE_URL=http://localhost:5000/api`
3. Run:
   `npm run dev`

## Environment Variables

- `VITE_API_BASE_URL`:
  Backend API base URL used by axios.
- `VITE_ALLOWED_HOST` (optional):
  Dev server host allowlist entry for tunnel tools (ngrok, etc.).

## Scripts

- `npm run dev`:
  Start local dev server.
- `npm run build`:
  Build production assets.
- `npm run preview`:
  Preview production build locally.
- `npm run lint`:
  Run ESLint.
