const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { analyzeVoice, evaluateCode } = require("../ai/ruleEngine");
const InterviewConfig = require("../models/InterviewConfig");

/**
 * POST /api/interview/analyze
 * Full interview evaluation combining code, voice, and behavioral metrics.
 * All scores are derived from actual analysis — no fake numbers.
 */
router.post("/analyze", async (req, res) => {
  try {
    const { transcript, topic, code, thinkingTime, language } = req.body;

    let config = null;
    if (mongoose.connection.readyState === 1) {
      try {
        config = await InterviewConfig.findOne({ id: "default_config" }).lean();
      } catch (e) {
        console.error("Config fetch error:", e.message);
      }
    }

    if (!config) {
      // Fallback in case DB is unseeded or offline
      config = {
        edgeCaseKeywords: ["edge case:20", "boundary:15", "null:15", "empty:15"],
        patterns: ["binary search:20", "hash map:20", "two pointer:20"],
        confidenceDeductions: ["uh:5", "um:5", "not sure:15"],
        followUpQuestions: {},
        scoringWeights: { speed: 0.1, edge: 0.1, pattern: 0.08, confidence: 0.07 }
      };
    }

    // ===== 1. Voice/DSA Analysis (AI or Rule-based) =====
    const voiceResult = await analyzeVoice(transcript || "", topic);

    const dsaScore = voiceResult.dsa_score !== undefined ? voiceResult.dsa_score : (voiceResult.score || 0);
    const logicScore = voiceResult.logic_score !== undefined ? voiceResult.logic_score : dsaScore;
    const communicationScore = voiceResult.communication_score !== undefined
      ? voiceResult.communication_score
      : (voiceResult.communication || 0);

    // ===== 2. Code Evaluation (AI or Rule-based) =====
    const codeResult = await evaluateCode(code || "", topic);
    const codeScore = codeResult.code_score || 0;

    // ===== 3. Thinking Speed Score =====
    // Explanation: <30s is excellent, 30-60s is good, 60-120s is average, >120s is slow
    let speedScore = 100;
    const tTime = thinkingTime || 0;
    if (tTime > 30000) speedScore -= 10;
    if (tTime > 60000) speedScore -= 20;
    if (tTime > 90000) speedScore -= 20;
    if (tTime > 120000) speedScore -= 20;
    if (tTime > 180000) speedScore -= 30;
    speedScore = Math.max(0, speedScore);

    // ===== 4. Edge Case Score — from transcript analysis =====
    let edgeScore = 0;
    const tLower = (transcript || "").toLowerCase();
    
    config.edgeCaseKeywords.forEach((entry) => {
      const [word, weightStr] = entry.split(":");
      const weight = parseInt(weightStr || "10", 10);
      if (tLower.includes(word)) edgeScore += weight;
    });
    edgeScore = Math.min(100, edgeScore);

    // ===== 5. Pattern Recognition Score =====
    let patternScore = 0;
    config.patterns.forEach((entry) => {
      const [word, weightStr] = entry.split(":");
      const weight = parseInt(weightStr || "10", 10);
      if (tLower.includes(word)) patternScore += weight;
    });
    patternScore = Math.min(100, patternScore);

    // ===== 6. Confidence Score — based on speech patterns =====
    let confidenceScore = 100;
    
    config.confidenceDeductions.forEach((entry) => {
      const [word, weightStr] = entry.split(":");
      const weight = parseInt(weightStr || "10", 10);
      const regex = new RegExp(word, 'gi');
      const matches = tLower.match(regex);
      if (matches) confidenceScore -= (matches.length * weight);
    });
    // Bonus if no filler words and substantial explanation
    const wordCount = (transcript || "").split(/\s+/).filter(w => w).length;
    if (wordCount < 10) confidenceScore -= 30; // Very short = low confidence
    confidenceScore = Math.max(0, Math.min(100, confidenceScore));

    // ===== 7. Final Score — Weighted Formula =====
    const finalScore = Math.round(
      0.25 * codeScore +
      0.25 * dsaScore +
      0.15 * communicationScore +
      (config.scoringWeights.speed || 0.10) * speedScore +
      (config.scoringWeights.edge || 0.10) * edgeScore +
      (config.scoringWeights.pattern || 0.08) * patternScore +
      (config.scoringWeights.confidence || 0.07) * confidenceScore
    );

    // ===== 8. Generate Follow-Up Question =====
    let followUpQuestion = "Can you optimize this further, or explain what would happen if the input scale doubled?";
    if (config.followUpQuestions && config.followUpQuestions[topic]) {
      const qArray = config.followUpQuestions[topic];
      if (qArray.length > 0) {
        followUpQuestion = qArray[0];
      }
    }

    return res.json({
      codeScore: Math.round(codeScore),
      logicScore: Math.round(logicScore),
      communicationScore: Math.round(communicationScore),
      speedScore: Math.round(speedScore),
      edgeScore: Math.round(edgeScore),
      patternScore: Math.round(patternScore),
      confidenceScore: Math.round(confidenceScore),
      dsaScore: Math.round(dsaScore),
      finalScore: Math.min(100, finalScore),
      followUpQuestion,
      feedback: voiceResult.feedback || "Assessment complete. Review your score breakdown for areas to improve.",
      missedSteps: voiceResult.missedSteps || [],
      codeAnalysis: {
        timeComplexity: codeResult.time_complexity || "Not analyzed",
        spaceComplexity: codeResult.space_complexity || "Not analyzed",
        isOptimal: codeResult.is_optimal || false,
      },
      evaluationSource: voiceResult.source || "hybrid",
    });
  } catch (error) {
    console.error("Interview API Error:", error);
    res.status(500).json({ error: "Failed to analyze interview" });
  }
});

module.exports = router;
