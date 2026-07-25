const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const seedDatabase = require('./utils/seedDatabase');
const apiRoutes = require("./routes/api");
const aiRoutes = require("./routes/ai");
const authRouter = require("./routes/auth").router;
const codeRoutes = require("./routes/code");
const interviewRoutes = require("./routes/interview");
const proctorRoutes = require("./routes/proctor");

const app = express();
const { apiLimiter, aiLimiter, codeExecLimiter } = require("./middleware/rateLimiter");

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "5mb" }));

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/algonova";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    await seedDatabase();
  })
  .catch((err) => console.log("❌ MongoDB Error: ", err.message));

// Auth routes
app.use("/api/auth", authRouter);

// Core API routes (problems, quiz, progress, leaderboard)
app.use("/api", apiLimiter, apiRoutes);

// AI routes (code analysis, voice analysis)
app.use("/api/ai", aiLimiter, aiRoutes);

// Code execution routes
app.use("/api/code", codeExecLimiter, codeRoutes);

// Interview evaluation routes
app.use("/api/interview", aiLimiter, interviewRoutes);

// Proctoring routes
app.use("/api/proctor", proctorRoutes);

app.get("/health", (req, res) => res.send("AlgoNova Backend is Running"));

// Serve static files from the React app build directory (production)
const clientDistPath = path.join(__dirname, "../frontend/dist");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Catch-all: send index.html for client-side routing (must be AFTER API routes)
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
  console.log("📦 Serving frontend build from:", clientDistPath);
} else {
  console.log("⚠️  Frontend build not found at:", clientDistPath);
  console.log("   Current Directory:", process.cwd());
  console.log("   Run 'npm run build' in /frontend to generate production build");
}

const http = require("http");
const { Server } = require("socket.io");
const matchmaking = require("./socket/matchmaking");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  }
});

matchmaking(io);

server.listen(PORT, () => {
  console.log(`🚀 AlgoNova Server running on port ${PORT}`);
});
