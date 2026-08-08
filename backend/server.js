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
const resumeRoutes = require("./routes/resume");

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
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(async () => {
    console.log("✅ MongoDB Connected");
    await seedDatabase();
  })
  .catch((err) => console.log("⚠️ MongoDB Disconnected (Using Mock Fallback System):", err.message));

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

// Resume ATS Screener routes
app.use("/api/resume", aiLimiter, resumeRoutes);

// Health Check & Root Endpoints for Uptime Monitors
app.get(["/", "/health", "/api/health"], (req, res) => {
  res.status(200).json({
    status: "online",
    service: "AlgoNova API Backend Engine",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Serve static files from the React app build directory (if available)
const clientDistPath = path.join(__dirname, "../frontend/dist");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Catch-all: send index.html for client-side routing
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
  console.log("📦 Serving frontend build from:", clientDistPath);
} else {
  console.log("⚠️ Frontend build not compiled locally on backend (Serving as Dedicated API Server)");
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
