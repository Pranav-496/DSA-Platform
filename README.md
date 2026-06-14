# AlgoNova - Next Gen DSA Platform

AlgoNova is a modern, brutalist-styled platform for mastering Data Structures and Algorithms (DSA). It features an interactive IDE, an AI-powered Interview Simulator, and gamification elements.

## Features
- **Interview Simulator**: Practice technical interviews with an AI that evaluates your code, logic, communication, and thinking speed. Includes voice transcription to analyze your verbal explanations!
- **AI Code Review**: Submit your code and receive deep, actionable feedback on time/space complexity and potential improvements.
- **Proctoring**: Stay focused. Tab-switching is monitored and impacts your "Integrity Score" during interviews.
- **Mock Fallback System**: No MongoDB? No problem. The backend seamlessly falls back to a mock in-memory database so you can still use the app.
- **Brutalist UI**: Bold aesthetics, strong contrasts, and clear layouts built with React and Tailwind CSS.

## Future Enhancements / Extra Features to Build
If you are looking to expand this project further, here are some highly recommended features:
1. **Multiplayer / 1v1 Battles**: Allow users to challenge each other in real-time coding matches. 
2. **Community Leaderboard**: Global ranking system based on Elo/MMR rating.
3. **Problem Explanations / Editorial**: Step-by-step guides and video tutorials for each problem.
4. **Daily Challenges**: Introduce a "Problem of the Day" with streak rewards to keep users engaged.
5. **System Design Practice**: A dedicated section to simulate system design interviews using an interactive whiteboard tool.
6. **Code Snippets/Shortcuts library**: Allow users to save their favorite algorithms or data structures.

## Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/Pranav-496/DSA-Platform.git
   ```
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```
4. Configure `.env` in the backend with `MONGO_URI` and `JWT_SECRET`.
5. Run the dev servers:
   - Frontend: `npm run dev`
   - Backend: `node server.js`

## Technologies Used
- Frontend: React, Vite, Tailwind CSS, Monaco Editor
- Backend: Node.js, Express, MongoDB (with Mock fallback)
- AI & Code Execution: Piston API for code execution, Groq / AI models for code review and interview analysis.
