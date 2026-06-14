const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const apiRoutes = require("./routes/api");
const aiRoutes = require("./routes/ai");
const authRouter = require("./routes/auth").router;
const codeRoutes = require("./routes/code");
const interviewRoutes = require("./routes/interview");
const proctorRoutes = require("./routes/proctor");

const app = express();

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
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error: ", err.message));

// Auth routes
app.use("/api/auth", authRouter);

// Core API routes (problems, quiz, progress, leaderboard)
app.use("/api", apiRoutes);

// AI routes (code analysis, voice analysis)
app.use("/api/ai", aiRoutes);

// Code execution routes
app.use("/api/code", codeRoutes);

// Interview evaluation routes
app.use("/api/interview", interviewRoutes);

// Proctoring routes
app.use("/api/proctor", proctorRoutes);

app.get("/health", (req, res) => res.send("AlgoNova Backend is Running"));

// Serve static files from the React app build directory (production)
const clientDistPath = path.join(__dirname, "../frontend/dist");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Catch-all: send index.html for client-side routing (must be AFTER API routes)
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
  console.log("📦 Serving frontend build from:", clientDistPath);
} else {
  console.log("⚠️  Frontend build not found at:", clientDistPath);
  console.log("   Current Directory:", process.cwd());
  console.log("   Run 'npm run build' in /frontend to generate production build");
}

app.listen(PORT, () => {
  console.log(`🚀 AlgoNova Server running on port ${PORT}`);
});
