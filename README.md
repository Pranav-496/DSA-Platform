<div align="center">
  <img src="https://algonova-by-pranav.vercel.app/logo.png" alt="AlgoNova Logo" width="100" />
  <h1 align="center">🚀 AlgoNova</h1>
  <p align="center">
    <strong>The Next-Generation AI-Powered DSA & System Design Mastering Platform</strong>
    <br />
    <em>Conceptualized, Designed & Developed by <a href="https://pranavlandge.in">Pranav Landge</a></em>
    <br />
    <br />
    <a href="https://algonova-by-pranav.vercel.app"><strong>🌐 Live Web App</strong></a>
    ·
    <a href="#comprehensive-feature-breakdown">Feature Deep Dive</a>
    ·
    <a href="#system-architecture">Architecture</a>
    ·
    <a href="#local-setup-guide">Setup Guide</a>
  </p>
</div>

---

## 📖 Executive Summary

**AlgoNova** is an interactive, Neo-Brutalist platform built to redefine technical interview preparation. Moving away from traditional passive learning platforms, AlgoNova integrates cutting-edge Generative AI to provide real-time code reviews, dynamic interview simulations, system design critiques, and automated resume screening.

The platform is designed to be a "One-Stop Solution" for aspiring software engineers, seamlessly combining **learning, practice, evaluation, and career readiness**.

---

## 🏗️ Comprehensive Feature Breakdown

### 1. 🤖 AI-Powered Interview Simulation
A fully immersive mock interview environment that simulates real-world technical screening.
* **Workflow:**
  1. The user enters the interview room; proctoring is immediately initialized.
  2. The user reads the prompt and writes the solution using the integrated Monaco Editor.
  3. The user records their explanation using the browser's MediaRecorder API.
  4. The code and audio transcript (via speech recognition) are sent to the backend.
  5. The AI Engine evaluates time/space complexity, edge cases, and communication clarity.
  6. The AI dynamically generates 3 targeted follow-up questions.
* **APIs & Integration:** Google Gemini API (for code/speech analysis and follow-ups).
* **Tools & Libraries:** `@monaco-editor/react`, Web Speech API (for speech-to-text), MediaRecorder.

### 2. 📐 System Design Sandbox
An interactive whiteboard for architecting scalable systems with instant AI feedback.
* **Workflow:**
  1. The user receives a system design prompt (e.g., "Design a URL Shortener").
  2. They use the embedded Excalidraw canvas to draw load balancers, databases, caches, and APIs.
  3. The architectural JSON data is extracted and mapped to a semantic text representation.
  4. The AI reviews the architecture for scalability, fault tolerance, and bottlenecks.
  5. A grade out of 100 is awarded alongside a detailed, actionable critique.
* **APIs & Integration:** Google Gemini API (for architecture evaluation).
* **Tools & Libraries:** `@excalidraw/excalidraw`, custom canvas-to-text serialization engine.

### 3. 📄 Resume ATS Screener
A professional-grade Applicant Tracking System (ATS) simulator to optimize resumes.
* **Workflow:**
  1. The user uploads a PDF or pastes their resume text.
  2. PDF text is extracted entirely on the client-side (Zero-server upload for privacy).
  3. A robust Backend Rule Engine scans for keywords, section structures, contact info, and quantification metrics ($, %).
  4. Google Gemini performs a deep linguistic critique and suggests specific bullet-point rewrites.
  5. The dashboard presents an animated gauge score, keyword chips, and improvement suggestions.
* **APIs & Integration:** Google Gemini API (for linguistic critique).
* **Tools & Libraries:** `pdfjs-dist` (local worker-based extraction), custom Regex-based ATS Rule Engine.

### 4. 👁️ Interactive DSA Visualizer
Step-by-step state visualization for complex algorithms to build intuition.
* **Workflow:**
  1. The user selects an algorithm category (Sorting, Searching, Trees, Graphs, DP).
  2. The simulation control panel allows the user to step forward, step backward, or auto-play.
  3. The React state engine maps algorithm states to animated DOM elements.
* **Tools & Libraries:** Custom React state machines, Framer Motion (for fluid transitions).

### 5. 💻 Practice HQ (Code Execution & Judging)
A robust coding environment with immediate feedback.
* **Workflow:**
  1. The user selects a problem and writes a solution in their preferred language.
  2. Code is executed safely.
  3. The AI reviews the code for best practices and space/time complexity optimization.
* **APIs & Integration:** Google Gemini API (for heuristic review).
* **Tools & Libraries:** Monaco Editor.

### 6. 🏆 Gamified Progress Tracking & Global Arena
A sophisticated gamification layer to maintain user engagement.
* **Workflow:**
  1. Actions (quizzes, interviews, system design, resume scanning) emit events to the `api.js` progress route.
  2. XP is dynamically calculated based on performance scores.
  3. The system evaluates Rank Tiers (Bronze to AlgoNova Elite) and unlocks visual Badges.
  4. User progress is synced to MongoDB and displayed on the Global Leaderboard.
* **Tools & Libraries:** Mongoose, React Context API.

### 7. 🔐 Dual-Layer Authentication & Security
Secure, seamless user onboarding.
* **Workflow:**
  1. Users can register manually or use Google 1-Tap OAuth 2.0.
  2. The backend verifies credentials or OAuth tokens.
  3. JWTs (JSON Web Tokens) are issued and stored securely.
  4. Rate limiting is applied, with stricter limits on AI routes to prevent abuse.
* **APIs & Integration:** Google OAuth 2.0, Google Auth Library (`OAuth2Client`).
* **Tools & Libraries:** `jsonwebtoken`, `bcryptjs`, `express-rate-limit`.

---

## ⚙️ System Architecture

AlgoNova follows a modern decoupled **Client-Server Architecture**:

1. **Presentation Layer (Frontend):** 
   - Built with **React 19** and **Vite**.
   - State management via React Context.
   - UI styling utilizing a custom **Neo-Brutalist** design system via **Tailwind CSS**.
   - Routing via `react-router-dom`.

2. **Application Layer (Backend):** 
   - Built with **Node.js** and **Express.js**.
   - Modular route design (`/api/auth`, `/api/ai`, `/api/resume`, `/api/proctor`).
   - Custom middleware for JWT validation and rate-limiting.

3. **Data Layer:** 
   - **MongoDB Atlas** serves as the primary database.
   - Interfaced using **Mongoose** Object Data Modeling (ODM).
   - Features a robust **In-Memory Mock Fallback** mechanism to ensure zero downtime during local development if the database is unreachable.

---

## 🛠️ Technology Stack & Tools Required

### Frontend
- **Framework:** React 19, Vite
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **Animation:** Framer Motion
- **Editors/Canvas:** `@monaco-editor/react`, `@excalidraw/excalidraw`
- **Utilities:** `pdfjs-dist` (Client-side PDF parsing), `date-fns`

### Backend
- **Core:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **Authentication:** `jsonwebtoken`, `bcryptjs`, `google-auth-library`
- **Security:** `express-rate-limit`, `cors`, `dotenv`
- **Email:** `nodemailer` (for password resets)

### External APIs
- **Google Gemini API** (`gemini-1.5-flash`) - Core AI Engine
- **Google OAuth 2.0** - Authentication

---

## 🚀 Local Setup Guide

Follow these steps to run AlgoNova locally on your machine.

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Pranav-496/DSA-Platform.git
cd DSA-Platform
```

### 2. Install Dependencies
Install dependencies for both the frontend and backend simultaneously:
```bash
npm run install-all
```

### 3. Environment Variables
Create a `.env` file in both the `frontend` and `backend` directories.

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GEMINI_API_KEY=your_google_gemini_api_key
EMAIL_USER=your_smtp_email
EMAIL_PASS=your_smtp_password
```

**Frontend (`frontend/.env`):**
```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 4. Start the Development Servers
Start both servers concurrently using the root package.json:
```bash
npm run dev
```
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:5000](http://localhost:5000)

---

## 🌍 Deployment Strategy

- **Frontend (Vercel):** The React application is deployed on Vercel's Edge Network for global low-latency delivery. It utilizes Vercel's automated CI/CD pipeline linked to the GitHub repository.
- **Backend (Render):** The Express.js Node server is hosted on Render as a Web Service. It manages connections to MongoDB Atlas and handles all AI API interactions securely.

---

## ⚖️ Legal & Compliance
AlgoNova includes professionally drafted **Terms of Service** and **Privacy Policy** pages to comply with standard data protection guidelines, detailing data collection practices regarding OAuth, resumes, and code submissions.

---

## 👨‍💻 Author & Credits

Designed, architected, and developed by **Pranav Landge**.

- 🌐 **Portfolio**: [pranavlandge.in](https://pranavlandge.in)
- 🐙 **GitHub**: [@Pranav-496](https://github.com/Pranav-496)
- 💼 **LinkedIn**: [Pranav Landge](https://www.linkedin.com/in/pranav-landge-064072329)

---

<div align="center">
  <p>Distributed under the <strong>MIT License</strong>. Copyright © 2026 Pranav Landge.</p>
</div>
