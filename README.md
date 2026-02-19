# Trainer Assessment Frontend

React + Vite frontend for the Trainer Assessment System.

## What this app does

This frontend provides role-based dashboards and workflows for:
- `admin`: view all assessments and inspect details
- `assessor`: create assessments and update attempts
- `trainer`: view their own assessments

It communicates with the backend through REST APIs under `/api`.

## Run locally

1. Install dependencies
```bash
npm install
```

2. Create environment file
```bash
cp .env.example .env
```

3. Start dev server
```bash
npm run dev
```

## Build for production

1. Create production env file from template
```bash
cp .env.production.example .env.production
```

2. Set:
```env
VITE_API_BASE_URL=https://your-api-domain.example.com/api
```

3. Build:
```bash
npm run build
```

## Environment variables

- `VITE_API_BASE_URL`
  Backend API base URL used by Axios.

## Code map (frontend/src)

### App bootstrap
- `src/main.jsx`
  Global CSS imports, restores saved theme, mounts React app.
- `src/App.jsx`
  Route declarations and role-protected route wiring.

### Networking and session
- `src/services/httpClient.js`
  Axios client setup, API base URL, auth header injection, 401 auto-logout behavior.
- `src/utils/auth.js`
  Local storage helpers for token/role/email/name and logout flow.
- `src/utils/normalize.js`
  Input/output normalization functions for login and assessment API payloads.

### Route guard
- `src/components/AuthGuard.jsx`
  Prevents unauthorized role access to routes.

### Shared layout
- `src/components/layout/Layout.jsx`
  Shell component with sidebar, topbar, mobile overlay behavior.
- `src/components/layout/Topbar.jsx`
  Theme toggle + brand logo + mobile menu trigger.
- `src/components/layout/Sidebar.jsx`
  Role-specific navigation and logout.

### Pages
- `src/pages/Auth.jsx`
  Login screen and role-based redirect after successful login.
- `src/pages/Admin.jsx`
  Admin dashboard table, server-side filters, pagination, view navigation.
- `src/pages/Assessor.jsx`
  Assessor dashboard table, search, pagination, create/edit navigation.
- `src/pages/CreateAssessment.jsx`
  Assessment creation form with trainer lookup and score input.
- `src/pages/EditAssessment.jsx`
  Attempt update flow with lock checks and score/feedback update.
- `src/pages/Trainer.jsx`
  Trainer dashboard table and assessment detail navigation.
- `src/pages/ViewAssessment.jsx`
  Shared assessment detail screen used by admin, assessor, and trainer.

### Styling
- `src/styles/variables.css`
  Theme tokens for light/dark mode.
- `src/styles/global.css`
  Global element-level styles.
- `src/styles/layout.css`
  Topbar/sidebar/layout and responsive behavior.
- `src/styles/table.css`
  Table and pagination styles.
- `src/styles/form.css`
  Input/button/form grid styles.
- `src/styles/auth.css`
  Login page-specific styles.
- `src/index.css`
  Additional base stylesheet hook.

### Assets
- `src/assets/branding/omotec-logo.gif`
  Brand logo used in topbar and login page.

## Scripts

- `npm run dev`: run Vite dev server
- `npm run build`: create production build in `dist/`
- `npm run preview`: preview production build locally
- `npm run lint`: run ESLint
