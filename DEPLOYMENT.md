# DEPLOYMENT (Free Hosting): Vercel + Render + MongoDB Atlas

This guide explains how to deploy your MERN app with:
- **Vercel** for the React frontend
- **Render** for the Node/Express backend
- **MongoDB Atlas** for the database

It also covers **CORS** so your frontend can call the backend without errors.

---

## 1) One-time prerequisite: GitHub repository

Vercel and Render will import your code from GitHub.

Make sure your repository has both folders:
- `client/`
- `server/`

---

## 2) MongoDB Atlas (Cloud Database)

1. Create a MongoDB Atlas account and a **new Cluster**.
2. Create a **Database User** (username + password).
3. In **Network Access / IP Access List**:
   - For demo/testing, you can temporarily allow `0.0.0.0` / “Anywhere” (Atlas will show an “Add current IP” option as well).
4. In **Connect** → choose “Application” and copy the **MongoDB connection string**.
   - It will look like one of these:
     - `mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority`

You will set this value as:
- `MONGO_URI` (in Render backend)

---

## 3) Backend Hosting on Render

### 3.1 Create a Render Web Service
1. Go to Render → **New +** → **Web Service**
2. Connect your GitHub repo.
3. Set:
   - **Root Directory:** `server/`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run start`

### 3.2 Render Environment Variables
In the Render service → **Environment** section, set:
- `PORT` = `5000` (or whatever Render gives you; typically you can omit and let default work)
- `MONGO_URI` = your Atlas connection string
- `JWT_SECRET` = any long random string (important for consistency)
- `FRONTEND_URL` = your Vercel frontend URL exactly, for example:
  - `https://your-frontend.vercel.app`

Your backend already uses this CORS config:
```js
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
```

### 3.3 Confirm Backend Health
After Render deploys successfully, test:
- `https://<your-render-backend>/`  (should return `{ "message": "Server is running successfully!" }`)
- `https://<your-render-backend>/api/auth/register` (should respond with either validation errors or 400/500—not 404)

---

## 4) Frontend Hosting on Vercel

### 4.1 Create a Vercel Project
1. Vercel → **Add New…** → import your GitHub repo
2. Set **Framework Preset** to **Vite**
3. Set:
   - **Root Directory:** `client/`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 4.2 Vercel Environment Variables
Set:
- `VITE_API_URL` = your Render backend URL, for example:
  - `https://your-render-backend.onrender.com`

Important: `VITE_API_URL` must include `http://` or `https://` (not just `:5000`).

Your frontend uses `VITE_API_URL` to call endpoints like:
- `${VITE_API_URL}/api/campaigns`
- `${VITE_API_URL}/api/auth/login`

---

## 5) CORS (How to avoid “blocked by CORS” and 404-at-frontend issues)

### Why it happens
When your frontend (Vercel) calls your backend (Render) from a different origin (different domain), the browser requires the backend to allow that origin via CORS.

### What to set
- In Render: `FRONTEND_URL` must match the exact Vercel URL.
- In Vercel: `VITE_API_URL` must point to the exact Render backend URL.

### `credentials: true` note
Your app authenticates using **JWT stored in `localStorage`** and the frontend sends:
`Authorization: Bearer <token>`

This does not rely on cookies, but `credentials: true` in CORS is acceptable. The key point is that the backend must allow the exact frontend origin (which we do via `FRONTEND_URL`).

---

## 6) Deployment checklist (quick)

1. Atlas connection string copied into Render `MONGO_URI`
2. Render backend deployed and returns `/` JSON message
3. Render `FRONTEND_URL` set to Vercel domain (exact)
4. Vercel deployed and `VITE_API_URL` set to Render backend URL
5. Test full demo flow:
   - Register as admin → Admin dashboard works
   - Create campaign → approved by admin
   - Donate as donor → appears in My Donations
   - Assign task as admin → volunteer updates status

---

## If you want, I can also
- add a small “deployment test” script for you, or
- adjust Render commands if your repo layout differs (for monorepo vs single root).

