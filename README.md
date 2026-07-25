<div align="center">
  <h1 align="center">🚀 AlgoNova</h1>
  <p align="center">
    <strong>Next Gen Data Structures and Algorithms Platform</strong>
    <br />
    <br />
    <a href="#about-the-project">About</a>
    ·
    <a href="#features">Features</a>
    ·
    <a href="#getting-started">Getting Started</a>
    ·
    <a href="#roadmap">Roadmap</a>
  </p>
</div>

---

## 📖 About The Project

AlgoNova is a modern, brutalist-styled platform designed for mastering Data Structures and Algorithms (DSA) comprehensively. Going beyond a simple coding playground, it acts as a personal interviewer, reviewer, and coding environment. It features an interactive IDE, a cutting-edge AI-powered Interview Simulator, and gamification elements, built specifically to help you ace your next technical interview.

## ✨ Key Features

- 🤖 **AI Interview Simulator**: Practice technical interviews with an AI that evaluates your code, logic, communication, and thinking speed. Includes voice transcription to analyze your verbal explanations!
- 🔍 **AI Code Review**: Submit your code and receive deep, actionable feedback on time/space complexity, edge cases, and potential code quality improvements.
- 👁️ **Proctoring System**: Stay focused. Tab-switching is continuously monitored and directly impacts your "Integrity Score" during simulated interviews.
- 💾 **Mock Fallback System**: No MongoDB? No problem. The backend seamlessly falls back to a mock in-memory database so you can start developing or using the app immediately.
- 🎨 **Brutalist UI**: Bold aesthetics, strong contrasts, and clear, intuitive layouts built with React and Tailwind CSS.

## 🛠️ Built With

**Frontend:**
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)

**Backend:**
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) (with in-memory mock fallback)

**AI & Code Execution:**
- **Piston API** - For secure and reliable code execution.
- **Groq / AI Models** - For comprehensive code review and interview analysis.

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Pranav-496/DSA-Platform.git
   cd DSA-Platform
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in the `backend` directory and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   *(Note: If MongoDB is not provided, the system will fall back to an in-memory database).*

5. **Run the development servers:**
   Open two terminal windows/tabs:
   
   *Terminal 1 (Frontend):*
   ```bash
   cd frontend
   npm run dev
   ```
   
   *Terminal 2 (Backend):*
   ```bash
   cd backend
   node server.js
   ```

## 🗺️ Roadmap & Future Enhancements

We have grand plans for AlgoNova. If you are looking to contribute or expand this project, here are some highly recommended features:

- [ ] ⚔️ **Multiplayer / 1v1 Battles**: Allow users to challenge each other in real-time coding matches. 
- [ ] 🏆 **Community Leaderboard**: Global ranking system based on Elo/MMR rating.
- [ ] 📚 **Problem Explanations / Editorial**: Step-by-step guides and video tutorials for each problem.
- [ ] 📅 **Daily Challenges**: Introduce a "Problem of the Day" with streak rewards to keep users engaged.
- [ ] 📐 **System Design Practice**: A dedicated section to simulate system design interviews using an interactive whiteboard tool.
- [ ] 📝 **Code Snippets Library**: Allow users to save and categorize their favorite algorithms or data structures.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
