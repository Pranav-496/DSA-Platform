const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const SystemDesignSave = require("../models/SystemDesignSave");
const Problem = require("../models/Problem");
const QuizQuestion = require("../models/QuizQuestion");

const PROBLEMS_DATA = require("../data/problems");
const QUIZ_DATA = require("../data/quizData");

// Mock DB for when MongoDB is not connected
const mockDb = {
  progress: {
    problemsSolved: 0,
    accuracy: 100,
    placementReadiness: 0,
    weakAreas: [],
    quizScores: new Map(),
    voiceScores: [],
    systemDesignScores: [],
    recentActivity: []
  },
  gamification: {
    xp: 0,
    rankTier: 'Bronze',
    streak: { current: 0, highest: 0, lastActive: null },
    badges: []
  },
  user: {
    name: "Test User",
    email: "test@algonova.com",
    bio: "",
    website: ""
  }
};

router.get("/problems", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(PROBLEMS_DATA);
    }
    const problems = await Problem.find({}).sort({ id: 1 }).lean();
    if (!problems || problems.length === 0) {
      return res.json(PROBLEMS_DATA);
    }
    res.json(problems);
  } catch (err) {
    console.error("GET /problems fallback:", err.message);
    res.json(PROBLEMS_DATA);
  }
});

router.get("/quiz", async (req, res) => {
  try {
    const topic = req.query.topic || "arrays";
    if (mongoose.connection.readyState !== 1) {
      const questions = QUIZ_DATA[topic] || QUIZ_DATA["arrays"] || [];
      return res.json(questions.map((q, idx) => ({ ...q, topic, _id: `mock_q_${idx}` })));
    }
    const questions = await QuizQuestion.find({ topic }).sort({ id: 1 }).lean();
    if (!questions || questions.length === 0) {
      const fallback = QUIZ_DATA[topic] || QUIZ_DATA["arrays"] || [];
      return res.json(fallback.map((q, idx) => ({ ...q, topic, _id: `mock_q_${idx}` })));
    }
    res.json(questions);
  } catch (err) {
    console.error("GET /quiz fallback:", err.message);
    const topic = req.query.topic || "arrays";
    const questions = QUIZ_DATA[topic] || QUIZ_DATA["arrays"] || [];
    res.json(questions.map((q, idx) => ({ ...q, topic, _id: `mock_q_${idx}` })));
  }
});

// ============================================
// Personalized Tracking & Progress API
// ============================================

router.get("/progress", protect, async (req, res) => {
  try {
    if (req.user.isMock) {
      return res.json({
        progress: mockDb.progress,
        gamification: mockDb.gamification,
        user: mockDb.user
      });
    }
    const user = await User.findById(req.user._id);
    res.json({
      progress: user.progress || {
        problemsSolved: 0,
        accuracy: 100,
        quizScores: {},
        voiceScores: [],
        systemDesignScores: [],
        placementReadiness: 0,
        weakAreas: [],
        recentActivity: [],
      },
      gamification: user.gamification || {
        xp: 0,
        rankTier: 'Bronze',
        streak: { current: 0, highest: 0, lastActive: null },
        badges: []
      },
      user: {
        name: user.name,
        email: user.email,
        bio: user.bio,
        website: user.website
      }
    });
  } catch (error) { console.error(error);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

router.post("/progress/update", protect, async (req, res) => {
  try {
    const { type, data } = req.body;
    let prog, gamify, user;

    if (req.user.isMock) {
      prog = mockDb.progress;
      gamify = mockDb.gamification;
    } else {
      user = await User.findById(req.user._id);
      prog = user.progress;
      gamify = user.gamification;
    }

    // --- Streak Logic ---
    const now = new Date();
    if (gamify.streak.lastActive) {
      const last = new Date(gamify.streak.lastActive);
      const diffTime = Math.abs(now - last);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
         gamify.streak.current += 1;
      } else if (diffDays > 1) {
         gamify.streak.current = 1;
      }
    } else {
      gamify.streak.current = 1;
    }
    gamify.streak.lastActive = now;
    if (gamify.streak.current > gamify.streak.highest) {
      gamify.streak.highest = gamify.streak.current;
    }
    // --------------------

    // Badge Evaluation Helper
    const awardBadge = (id, name, desc, iconColor) => {
      if (!gamify.badges.find(b => b.id === id)) {
        gamify.badges.push({ id, name, description: desc, iconColor });
        prog.recentActivity.unshift({
          type: "system", text: `Unlocked Badge: ${name} 🏆`, time: new Date()
        });
      }
    };

    // Update Activity Heatmap
    const todayKey = now.toISOString().split('T')[0];
    if (!prog.activityHeatmap) prog.activityHeatmap = new Map();
    const currentActivity = prog.activityHeatmap.get(todayKey) || 0;
    prog.activityHeatmap.set(todayKey, currentActivity + 1);

    if (now.getHours() >= 0 && now.getHours() < 4) {
      awardBadge('night_owl', 'Night Owl', 'Solved a challenge after midnight.', 'neon-purple');
    }

    if (type === "quiz") {
      gamify.xp += Math.floor(data.score * 0.2); // Up to 20 XP
      prog.quizScores.set(data.topic, data.score);
      prog.recentActivity.unshift({
        type: "quiz",
        text: `Completed ${data.topic} quiz (${data.score}%)`,
        time: now,
      });
      if (data.score < 60 && !prog.weakAreas.includes(data.topic)) {
        prog.weakAreas.push(data.topic);
      }
    } else if (type === "problem") {
      gamify.xp += 50; // Flat 50 XP for solving
      prog.problemsSolved += 1;
      prog.recentActivity.unshift({
        type: "problem",
        text: `Solved ${data.title} (+50 XP)`,
        time: now,
      });
      if (prog.problemsSolved === 1) {
        awardBadge('first_blood', 'First Blood', 'Solved your very first problem.', 'neon-cyan');
      }
      if (prog.problemsSolved >= 10) {
        awardBadge('coder_ten', 'Dedicated Hacker', 'Solved 10 problems.', 'neon-yellow');
      }

    } else if (type === "voice") {
      gamify.xp += 100; // 100 XP for explaining
      prog.voiceScores.push(data);
      prog.recentActivity.unshift({
        type: "voice",
        text: `Voice AI: ${data.topic} (${data.score}%) (+100 XP)`,
        time: now,
      });
      if (data.score < 60 && !prog.weakAreas.includes(data.topic)) {
        prog.weakAreas.push(data.topic);
      }
    } else if (type === "system_design") {
      gamify.xp += 150 + Math.floor(data.score); // Base 150 + score
      prog.systemDesignScores.push(data);
      prog.recentActivity.unshift({
        type: "system",
        text: `System Design: ${data.challengeTitle} (${data.score}/100) (+${150 + Math.floor(data.score)} XP)`,
        time: now,
      });
      if (prog.systemDesignScores.length === 1) {
        awardBadge('architect_init', 'Architect', 'Completed your first System Design critique.', 'neon-green');
      }
    } else if (type === "resume") {
      gamify.xp += 75 + Math.floor((data.score || 0) * 0.5);
      if (!prog.resumeScores) prog.resumeScores = [];
      prog.resumeScores.push(data);
      prog.recentActivity.unshift({
        type: "system",
        text: `Resume ATS Scan: ${data.score}/100 (${data.grade}) (+${75 + Math.floor((data.score || 0) * 0.5)} XP)`,
        time: now,
      });
      if (prog.resumeScores.length === 1) {
        awardBadge('resume_ready', 'Resume Ready', 'Completed your first ATS Resume Scan.', 'neon-cyan');
      }
    }

    // Rank Tier Evaluation
    if (gamify.xp >= 1000) gamify.rankTier = 'AlgoNova Elite';
    else if (gamify.xp >= 500) gamify.rankTier = 'Diamond';
    else if (gamify.xp >= 250) gamify.rankTier = 'Gold';
    else if (gamify.xp >= 100) gamify.rankTier = 'Silver';
    else gamify.rankTier = 'Bronze';

    prog.recentActivity = prog.recentActivity.slice(0, 15);

    // ===== REAL Placement Readiness Calculation =====
    // Formula: (problemAccuracy * 0.4) + (avgQuizScore * 0.2) + (avgVoiceScore * 0.2) + (consistency * 0.2)
    const totalProblems = 8; // Total available problems
    const problemAccuracy = Math.min(100, (prog.problemsSolved / totalProblems) * 100);

    let avgQuizScore = 0;
    if (prog.quizScores && prog.quizScores.size > 0) {
      const quizValues = Array.from(prog.quizScores.values());
      avgQuizScore = quizValues.reduce((a, b) => a + b, 0) / quizValues.length;
    }

    let avgVoiceScore = 0;
    if (prog.voiceScores && prog.voiceScores.length > 0) {
      avgVoiceScore = prog.voiceScores.reduce((a, b) => a + (b.score || 0), 0) / prog.voiceScores.length;
    }

    let avgSystemScore = 0;
    if (prog.systemDesignScores && prog.systemDesignScores.length > 0) {
      avgSystemScore = prog.systemDesignScores.reduce((a, b) => a + (b.score || 0), 0) / prog.systemDesignScores.length;
    }

    // Consistency = streak-based (max 100)
    const consistency = Math.min(100, (gamify.streak.current || 0) * 15);

    // If no learning activity at all, readiness = 0
    const hasActivity = prog.problemsSolved > 0 || (prog.quizScores && prog.quizScores.size > 0) || (prog.voiceScores && prog.voiceScores.length > 0) || (prog.systemDesignScores && prog.systemDesignScores.length > 0);
    prog.placementReadiness = hasActivity
      ? Math.round((problemAccuracy * 0.3) + (avgQuizScore * 0.15) + (avgVoiceScore * 0.15) + (avgSystemScore * 0.25) + (consistency * 0.15))
      : 0;

    if (req.user.isMock) {
      mockDb.progress = prog;
      mockDb.gamification = gamify;
      return res.json({ success: true, progress: mockDb.progress, gamification: mockDb.gamification });
    } else {
      user.progress = prog;
      user.gamification = gamify;
      await user.save();
      return res.json({ success: true, progress: user.progress, gamification: user.gamification });
    }
  } catch (error) { console.error(error);
    console.error(error);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

// ============================================
// Ecosystem & Gamification API
// ============================================

router.post("/profile/update", protect, async (req, res) => {
  try {
    const { name, bio, website } = req.body;
    
    if (req.user.isMock) {
      if (name) mockDb.user.name = name;
      if (bio !== undefined) mockDb.user.bio = bio;
      if (website !== undefined) mockDb.user.website = website;
      return res.json({ success: true, user: mockDb.user });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    if (name && name.trim() !== "") {
       user.name = name;
    }
    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    
    await user.save();
    
    res.json({ success: true, user: { name: user.name, bio: user.bio, website: user.website } });
  } catch (error) { console.error(error);
    console.error("Profile Update Error: ", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

router.get("/leaderboard", async (req, res) => {
  const getMockLeaderboard = () => [
    { rank: 1, id: "1", identity: "CyberCoder", xp: 1250, tier: "AlgoNova Elite", problems: 18, streak: 7 },
    { rank: 2, id: "2", identity: "BinaryNinja", xp: 820, tier: "Diamond", problems: 14, streak: 5 },
    { rank: 3, id: "3", identity: "DevOperator", xp: 450, tier: "Gold", problems: 9, streak: 3 },
    { rank: 4, id: "4", identity: "Test User", xp: mockDb.gamification.xp, tier: mockDb.gamification.rankTier, problems: mockDb.progress.problemsSolved, streak: mockDb.gamification.streak.current }
  ];

  try {
    const redisClient = require('../utils/redisClient');
    const CACHE_KEY = 'leaderboard:top100';

    if (redisClient.isReady) {
      const cached = await redisClient.get(CACHE_KEY);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }

    if (mongoose.connection.readyState !== 1) {
      return res.json(getMockLeaderboard());
    }

    const topUsers = await User.find({ isVerified: true })
      .sort({ "gamification.xp": -1, "progress.problemsSolved": -1 })
      .limit(100)
      .select("name email gamification progress.problemsSolved")
      .lean();
    
    if (!topUsers || topUsers.length === 0) {
      return res.json(getMockLeaderboard());
    }

    // Anonymize emails slightly for the leaderboard
    const formattedLeaderboard = topUsers.map((u, index) => ({
      rank: index + 1,
      id: u._id,
      identity: u.name || (u.email ? u.email.split('@')[0].substring(0, 5) + '***' : 'Anonymous'),
      xp: u.gamification?.xp || 0,
      tier: u.gamification?.rankTier || 'Bronze',
      problems: u.progress?.problemsSolved || 0,
      streak: u.gamification?.streak?.current || 0
    }));

    if (redisClient.isReady) {
      await redisClient.setEx(CACHE_KEY, 60, JSON.stringify(formattedLeaderboard));
    }

    res.json(formattedLeaderboard);
  } catch (error) {
    console.error("Leaderboard Error: ", error.message);
    res.json(getMockLeaderboard());
  }
});

// ============================================
// System Design Cloud Save API
// ============================================

router.post("/system-design/save", protect, async (req, res) => {
  try {
    if (req.user.isMock) {
      return res.json({ success: true, message: "Mock user save successful" });
    }
    
    const { name, challengeId, elements, appState } = req.body;
    
    // Upsert logic based on challengeId or name
    let save = null;
    if (challengeId) {
      save = await SystemDesignSave.findOne({ userId: req.user._id, challengeId });
    }
    if (!save) {
      save = await SystemDesignSave.findOne({ userId: req.user._id, name });
    }
    
    if (save) {
      save.elements = elements;
      save.appState = appState;
      save.name = name;
      await save.save();
    } else {
      save = new SystemDesignSave({
        userId: req.user._id,
        name,
        challengeId,
        elements,
        appState
      });
      await save.save();
    }
    
    res.json({ success: true, save });
  } catch (error) { console.error(error);
    console.error("System Design Save Error:", error);
    res.status(500).json({ error: "Failed to save system design" });
  }
});

router.get("/system-design/saves", protect, async (req, res) => {
  try {
    if (req.user.isMock) {
      return res.json([]);
    }
    const saves = await SystemDesignSave.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(saves);
  } catch (error) { console.error(error);
    console.error("Fetch Saves Error:", error);
    res.status(500).json({ error: "Failed to fetch system designs" });
  }
});

router.delete("/system-design/saves/:id", protect, async (req, res) => {
  try {
    if (req.user.isMock) {
      return res.json({ success: true });
    }
    const save = await SystemDesignSave.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!save) {
      return res.status(404).json({ error: "Save not found" });
    }
    res.json({ success: true });
  } catch (error) { console.error(error);
    console.error("Delete Save Error:", error);
    res.status(500).json({ error: "Failed to delete save" });
  }
});

module.exports = router;
