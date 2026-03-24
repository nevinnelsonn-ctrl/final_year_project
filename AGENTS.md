# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

MERN-stack charity crowdfunding, disaster relief, and food donation platform. Monorepo with two independent npm projects:
- `server/` – Express 5 + Mongoose 9 REST API (CommonJS)
- `client/` – React 19 + Vite 7 SPA (ES modules, JSX)

Four user roles: `donor`, `creator`, `volunteer`, `admin`. Roles gate both API access and UI navigation.

`project_spec.txt` at the repo root contains the original feature specification with schemas and intended user journeys.

## Build & Run Commands

### Server (from `server/`)
- `npm install` – install dependencies
- `npm run dev` – start with nodemon (hot reload), runs on port 5000
- `npm run start` – production start (`node server.js`)

### Client (from `client/`)
- `npm install` – install dependencies
- `npm run dev` – Vite dev server on port 5173
- `npm run build` – production build to `client/dist/`
- `npm run lint` – ESLint (flat config, `eslint.config.js`)
- `npm run preview` – serve production build locally

### Environment
- Server requires `server/.env` with `MONGO_URI` (and optionally `PORT`, `JWT_SECRET`). Copy from `server/.env.example`.
- Client optionally uses `VITE_API_URL` env var; defaults to `http://localhost:5000`.
- No automated test suites exist. The server `test` script is a no-op placeholder.

## Architecture

### Server

Entry point: `server/server.js` – connects to MongoDB, registers middleware (cors, JSON parsing), mounts route modules, then adds 404 and central error handlers.

**Layered pattern (routes → controllers → models):**
- `routes/` – Express routers. Each file mounts middleware (`protect`, `requireRole`) before controller handlers.
- `controllers/` – Request handlers. Each function handles its own try/catch and sends JSON responses directly (no service layer).
- `models/` – Mongoose schemas. Five models: `User`, `Campaign`, `Donation`, `FoodDonation`, `VolunteerTask`.
- `config/db.js` – Mongoose connection helper, called once at startup.

**Middleware:**
- `middleware/authMiddleware.js` exports `protect` (JWT verification, attaches `req.user`) and `requireRole(...roles)` (role-based guard). JWT payload is `{ id, role }` with 7-day expiry. Fallback secret is `'dev_secret_key'`.
- `middleware/validate.js` – Lightweight request-body validation. Exports `validate(rules)` middleware factory plus check functions (`isRequired`, `minLength`, `isEmail`, `isNumber`, `minNumber`). Used on auth routes; other routes validate inline in controllers.
- `middleware/errorHandler.js` – Central Express error handler (for `next(err)` calls). Returns `{ message }` on error; in non-production also includes `{ detail }` for 500s.

**Key API patterns:**
- All error responses use `{ message }`. Success responses return the resource(s) directly.
- Donations atomically increment `Campaign.raisedAmount` inside the donation controller.
- Campaign approval is a separate `PUT /api/campaigns/approve/:id` endpoint (admin only), distinct from general update.

### Client

Entry point: `client/src/main.jsx` – mounts `<BrowserRouter>` + `<AuthProvider>` + `<App>`.

**Two layout modes:**
- `src/components/Layout.jsx` – Main app shell with Bootstrap 5 navbar. Nav links conditionally rendered by `user.role`. Wraps all pages in a `.container` except the Home page (full-width for hero sections).
- `src/components/AdminLayout.jsx` – Separate sidebar layout for the `/admin` route. The Admin page renders completely outside the main Layout (handled in `App.jsx` via a pathname check).

**Key files:**
- `src/api.js` – Centralized `api(url, options)` fetch wrapper. Auto-attaches JWT from `localStorage`. On non-OK responses, throws `{ status, ...responseBody }` – pages catch this and display `error.message`.
- `src/context/AuthContext.jsx` – React Context providing `user`, `loading`, `login(userData, token)`, `logout()`, and `loadUser()`. Token persisted in `localStorage`.
- `src/App.jsx` – Route definitions. All routes are top-level (no nested routing or lazy loading).
- `src/pages/` – One page component per route. Pages handle their own data fetching via `api()` and manage local state with `useState`/`useEffect`.

**Styling:** Bootstrap 5.3.2 CSS + JS and Bootstrap Icons 1.11.3 loaded via CDN in `index.html` (not npm dependencies). Google Fonts (Inter, Poppins) also loaded via CDN. Custom CSS variables and overrides in `src/index.css`. Some pages use inline styles instead of Bootstrap classes (inconsistent – `CreateCampaign`, `Admin`, `MyTasks`, `MyDonations`).

**ESLint:** Flat config in `client/eslint.config.js`. The `no-unused-vars` rule ignores variables starting with an uppercase letter or underscore (`varsIgnorePattern: '^[A-Z_]'`).

**No client-side route guards** – pages check `user.role` themselves and show "access denied" text inline.

## API Routes Summary

- `POST /api/auth/register` / `POST /api/auth/login` – public, with validation middleware
- `GET /api/auth/me` – protected
- `GET /api/campaigns` (public, filterable by `status` & `campaignType` query params)
- `GET /api/campaigns/:id` (public)
- `POST /api/campaigns` – creator/admin
- `PUT /api/campaigns/:id` – creator (own) or admin
- `PUT /api/campaigns/approve/:id` – admin only
- `POST /api/donations` – donor/admin
- `GET /api/donations/user/:id` – self or admin
- `GET /api/donations/campaign/:id` – campaign creator or admin
- `GET /api/food-donations` (public) / `POST /api/food-donations` – donor/admin
- `GET /api/tasks` – admin / `GET /api/tasks/volunteer/:id` – self or admin
- `POST /api/tasks` – admin / `PUT /api/tasks/:id` – volunteer (own) or admin
- `GET /api/users` – admin only
