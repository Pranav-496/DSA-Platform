# 🚀 AlgoNova Split Deployment Guide (Vercel Frontend + Render Backend)

This guide takes you step-by-step through deploying **AlgoNova** using **Vercel** for lightning-fast frontend CDN loading (< 1s load times) and **Render** for backend API services.

---

## 📋 Overview of Split Deployment Architecture

```
                                 ┌─────────────────────────┐
                                 │   User Browser / Client │
                                 └───────────┬─────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
                       ▼                                           ▼
       ┌───────────────────────────────┐           ┌───────────────────────────────┐
       │   Vercel Global Edge CDN      │           │      Render Web Service       │
       │   • Serves React UI Instantly │           │      • Express API Server     │
       │   • Zero Cold Starts (< 1 sec)│           │      • AI & Code Execution   │
       └───────────────────────────────┘           └───────────────┬───────────────┘
                                                                   │
                                                                   ▼
                                                   ┌───────────────────────────────┐
                                                   │  MongoDB Atlas & Google APIs  │
                                                   └───────────────────────────────┘
```

---

## 1️⃣ Step 1: Deploy Frontend on Vercel (Instant Load Times)

1. Go to [Vercel Dashboard](https://vercel.com/new) and sign in with GitHub.
2. Click **"Import"** next to your `DSA-Platform` / `AlgoNova` repository.
3. Configure the Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` *(or select `frontend` if prompted)*
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`

4. Add **Environment Variables** on Vercel:

| Key | Value / Example |
| :--- | :--- |
| `VITE_API_URL` | `https://algonova-backend.onrender.com` *(your Render backend URL)* |
| `VITE_GOOGLE_CLIENT_ID` | `230333404653-c49r3m9e69klcu4p1mmtnsobserfk3gn.apps.googleusercontent.com` |

5. Click **"Deploy"**.
   Vercel will give you a live frontend URL: `https://algonova.vercel.app`.

---

## 2️⃣ Step 2: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/) $\rightarrow$ **"New +"** $\rightarrow$ **"Web Service"**.
2. Connect your GitHub repository.
3. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = `mongodb+srv://pranavlandge79_db_user:3ILW0wx2hCCPiaEZ@cluster0.kqjj6pz.mongodb.net/algonova?retryWrites=true&w=majority`
   - `JWT_SECRET` = `algonova_production_secret_key_998877!`
   - `GEMINI_API_KEY` = `your_gemini_key`
   - `GOOGLE_CLIENT_ID` = `230333404653-c49r3m9e69klcu4p1mmtnsobserfk3gn.apps.googleusercontent.com`

---

## 3️⃣ Step 3: Update Google Cloud Console Credentials

1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Edit your Client ID `230333404653-c49r3m9e69klcu4p1mmtnsobserfk3gn.apps.googleusercontent.com`.
3. Add your Vercel URL to **Authorized JavaScript origins** and **Authorized redirect URIs**:
   - `https://algonova.vercel.app`
   - `http://localhost:5173`
4. Click **Save**.

🎉 **Your frontend is now live on Vercel with zero cold starts!**

---

## 4️⃣ Step 4: Keep Render Backend Awake (Zero Cold Starts)

Since Render's Free tier spins down your backend API after 15 minutes of inactivity, the first API request after a while can take up to 50 seconds to respond. 

To prevent this, you should use **UptimeRobot** to ping the backend every 10 minutes:

1. Go to [UptimeRobot](https://uptimerobot.com/) and create a free account.
2. Click **"+ Add New Monitor"**.
3. Configure the monitor:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `AlgoNova Backend API`
   - **URL (or IP)**: `https://algonova-backend.onrender.com/api/health` *(Replace with your actual Render URL + `/api/health`)*
   - **Monitoring Interval**: `10 minutes` (This prevents the 15-minute timeout).
4. Click **Create Monitor**.

✅ Your backend is now protected from going to sleep. UptimeRobot will ping the health check route we already built in `server.js`, and your app will remain lightning-fast 24/7!
