# Integrated Charity Crowdfunding, Disaster Management & Food Donation System

MERN stack (MongoDB, Express, React, Node.js). Users can donate money, manage disaster/charity campaigns, contribute food, and volunteers can complete assigned tasks. Admins approve campaigns and assign volunteers.

---

## Quick start (for evaluators)

**Prerequisites:** Node.js (v18+) and a MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

### 1. Backend

In a terminal:

```bash
cd server
copy .env.example .env
```

Edit `server/.env`: set `MONGO_URI` to your MongoDB URL. Optionally set `JWT_SECRET` (if omitted, a dev default is used).

```bash
npm install
npm run dev
```

Leave this running. You should see **"Server running on port 5000"** and **"MongoDB Connected"**. Backend: **http://localhost:5000**.

*(On Mac/Linux use `cp .env.example .env` instead of `copy`.)*

### 2. Frontend

Open a **second terminal**:

```bash
cd client
npm install
npm run dev
```

Leave this running. Open **http://localhost:5173** in your browser. You should see the app home page and **"Backend: Server is running successfully!"**.

### 3. Demo checklist (manual test)

Use this flow to verify all roles and features:

1. **Admin** – Register (role: **Admin**) → Login → open **Admin** in the nav. You should see Users, Pending campaigns, Assign task, All tasks.
2. **Creator** – Register another user (role: **Creator / NGO**) → Login → **Create Campaign**: fill title, description, goal amount, type (e.g. Charity) → submit.
3. **Approve campaign** – Login as **Admin** → **Admin** → under "Pending campaigns" click **Approve** for the new campaign.
4. **Donor** – Register (role: **Donor**) → Login → **Campaigns** → open the approved campaign → enter amount in **Donate** form → submit. Then open **My Donations** and confirm the donation appears.
5. **Volunteer** – Register (role: **Volunteer**) → Login. As **Admin**, go to Admin → **Assign task**: select that volunteer, task type (e.g. Food), location → submit. Login as **Volunteer** → **My Tasks** → you should see the task → **Start (In Progress)** → **Mark Completed**.

Optional: **Food donations** – As Donor, you can create a food donation via API or (if you add a simple page) from the UI. **Campaigns** list supports filters by status and type.

### 4. Running for demo / deployment

- **Local demo:** Keep both terminals open (server + client). Frontend talks to `http://localhost:5000` by default.
- **Production build:** In `client` run `npm run build`; serve the `dist` folder with any static host. Set `VITE_API_URL` at build time to your backend URL so the frontend calls the correct API.
- **Backend in production:** Use `npm run start` in `server` (runs `node server.js`). Set `NODE_ENV=production` and a strong `JWT_SECRET` in `.env`.

---

## Phase 1 – Run the app (reference)

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas connection string)

### 1. Backend (server)

```bash
cd server
```

- Copy env template and set your MongoDB URL:
  - `copy .env.example .env` (Windows) or `cp .env.example .env` (Mac/Linux)
  - Edit `.env` and set `MONGO_URI` (and optionally `JWT_SECRET`; see `.env.example`)
- Install and run:

```bash
npm install
npm run dev
```

Server runs at **http://localhost:5000**. You should see “Server running on port 5000” and “MongoDB Connected”.

- Test: open http://localhost:5000 in browser → `{"message":"Server is running successfully!"}`

### 2. Frontend (client)

In a **second terminal**:

```bash
cd client
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**. You should see “Frontend Running” and a line showing backend status (e.g. “Backend: Server is running successfully!”).

### Phase 1 done when

- Backend: http://localhost:5000 returns the JSON message.
- Frontend: http://localhost:5173 shows “Frontend Running” and “Backend: …” (OK or Not reachable).
- No errors in server or client terminals.

---

## Phase 2 – Auth & users

### Backend

- **POST /api/auth/register** – body: `{ name, email, password }` – returns `{ user, token }`
- **POST /api/auth/login** – body: `{ email, password }` – returns `{ user, token }`
- **GET /api/auth/me** – header: `Authorization: Bearer <token>` – returns current user (protected)

Passwords are hashed with bcrypt; JWT is used for auth. Add `JWT_SECRET` to `server/.env` if you want a fixed secret (optional; dev fallback exists).

### Frontend

- **Home (/)** – backend status; if logged in, shows user name and Logout; otherwise links to Login / Register.
- **Login (/login)** – email + password; on success stores token and redirects to Home.
- **Register (/register)** – name, email, password (min 6); on success logs in and redirects to Home.

Token is stored in `localStorage` and sent in the `Authorization` header for `/api/auth/me` and future protected API calls.

---

## Phase 3 – Domain features & CRUD

Project: **Charity crowdfunding, disaster relief & food donation**. User roles: donor, creator, volunteer, admin.

### Backend

- **User roles** (in `User` model): `donor`, `creator`, `volunteer`, `admin`. Register accepts optional `role` in body.
- **Campaigns**  
  - `GET /api/campaigns` – list (public; query: `status`, `campaignType`)  
  - `GET /api/campaigns/:id` – single (public)  
  - `POST /api/campaigns` – create (creator/admin)  
  - `PUT /api/campaigns/:id` – update (creator/admin)  
  - `PUT /api/campaigns/approve/:id` – body `{ status: 'Approved'|'Rejected' }` (admin only)
- **Donations**  
  - `POST /api/donations` – body `{ campaignId, amount }` (donor/admin)  
  - `GET /api/donations/user/:id` – history (self or admin)  
  - `GET /api/donations/campaign/:id` – list for campaign (creator or admin)
- **Food donations**  
  - `GET /api/food-donations` – list (public)  
  - `POST /api/food-donations` – body `{ foodType, quantity, expiryTime, pickupLocation }` (donor/admin)
- **Volunteer tasks**  
  - `GET /api/tasks/volunteer/:id` – tasks for volunteer (self or admin)  
  - `GET /api/tasks` – all tasks (admin only)  
  - `POST /api/tasks` – assign task: body `{ volunteerId, taskType, assignedLocation }` (admin only)  
  - `PUT /api/tasks/:id` – body `{ status }` – update task status (volunteer for own task, or admin)
- **Users**  
  - `GET /api/users` – list all users (admin only, no passwords)

### Frontend

- **Layout** – Nav: Home, Campaigns, Create Campaign (creator/admin), My Donations (donor), My Tasks (volunteer/admin), Admin (admin), Login/Register or Logout.
- **Campaigns** – List with filters; detail page with Donate form (donor, only for Approved campaigns).
- **Create Campaign** – Form: title, description, goal amount, type (Charity/Disaster), optional disaster type & location.
- **My Donations** – List of current user’s donations with links to campaigns.
- **Admin** – Pending campaigns (Approve/Reject), Users list, Assign task to volunteer, All tasks list.
- **Register** – Optional role selector (donor, creator, volunteer, admin) for demo.

---

## Phase 4 – Admin & volunteer tasks

### Backend

- **GET /api/users** – list users (admin only; excludes passwords).
- **Tasks**  
  - **GET /api/tasks** – all tasks (admin only).  
  - **POST /api/tasks** – create/assign task: `volunteerId`, `taskType` (Food/Disaster), `assignedLocation` (admin only).  
  - **PUT /api/tasks/:id** – update `status` (Assigned | In Progress | Completed); volunteer can update own task, admin can update any.

### Frontend

- **Admin** – Four sections: (1) Pending campaigns – Approve/Reject, (2) Users – list name, email, role, (3) Assign task – select volunteer (dropdown of users with role volunteer), task type, location; submit creates task, (4) All tasks – list with volunteer and status.
- **My Tasks** (/my-tasks) – Volunteers (and admin) see assigned tasks; for each task: “Start (In Progress)” when status is Assigned, “Mark Completed” when In Progress. Status updates via PUT /api/tasks/:id.
- **Layout** – “My Tasks” link shown for volunteer and admin.

---

## Phase 5 – Validation, error handling & polish

### Backend

- **Validation** – `server/middleware/validate.js`: simple validation helper used on auth routes. Register: name required, email required + valid format, password required + min 6 characters. Login: email required + valid format, password required. Invalid requests return 400 with a single `message`.
- **404** – Unknown routes respond with `404` and `{ message: 'Not found' }`.
- **Central error handler** – `server/middleware/errorHandler.js`: handles errors passed to `next(err)`, returns appropriate status and `{ message }` (generic “Server error” for 500 in production).

### Frontend

- **Base styles** – `src/index.css`: reset-like base (box-sizing, body font/background), styled inputs/selects/textarea/buttons (border, focus ring), `.error-message` block for errors, `.card` for list/card blocks.
- **ErrorMessage** – Reusable `src/components/ErrorMessage.jsx`: shows server/client error message in a consistent red alert block. Used on Login, Register, Create Campaign, Campaign Donate form, Admin assign form, and list pages (Campaigns, My Donations, My Tasks, Admin) when load or submit fails.
- **Cards** – Campaign list, donation list, and task list items use the `.card` class for consistent spacing and borders.

---

## Phase 6 – Testing, docs & deployment

### README and setup

- **Project title and description** at the top of the README (Integrated Charity Crowdfunding, Disaster Management & Food Donation System).
- **Quick start (for evaluators)** – Copy-paste steps: prerequisites, backend (cd server, copy .env, npm install, npm run dev), frontend (second terminal, cd client, npm install, npm run dev), open http://localhost:5173. Notes for Mac/Linux (`cp` instead of `copy`) and optional `JWT_SECRET`.
- **`.env.example`** in server includes `PORT`, `MONGO_URI`, and `JWT_SECRET` so evaluators know what to set.

### Demo checklist (manual test)

- Step-by-step flow in the README: (1) Register/Login as Admin and open Admin panel, (2) Register as Creator and create a campaign, (3) Approve campaign as Admin, (4) Register as Donor, donate to the campaign, check My Donations, (5) Register as Volunteer, Admin assigns a task, Volunteer opens My Tasks and updates status (Start → Mark Completed). Optional: food donations and campaign filters.

### Deployment / running for demo

- **Local demo:** Two terminals (server + client); frontend uses `http://localhost:5000` by default.
- **Production build:** `npm run build` in client; serve `dist`; set `VITE_API_URL` to backend URL at build time.
- **Backend production:** `npm run start` in server; set `NODE_ENV=production` and a strong `JWT_SECRET` in `.env`.
