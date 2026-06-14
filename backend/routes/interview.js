const express = require("express");
const router = express.Router();
const { analyzeVoice, evaluateCode } = require("../ai/ruleEngine");

/**
 * POST /api/interview/analyze
 * Full interview evaluation combining code, voice, and behavioral metrics.
 * All scores are derived from actual analysis — no fake numbers.
 */
router.post("/analyze", async (req, res) => {
  try {
    const { transcript, topic, code, thinkingTime, language } = req.body;

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
    const edgeCaseKeywords = [
      { word: "empty", weight: 15 },
      { word: "null", weight: 15 },
      { word: "single element", weight: 15 },
      { word: "single", weight: 10 },
      { word: "edge case", weight: 20 },
      { word: "edge", weight: 10 },
      { word: "boundary", weight: 15 },
      { word: "overflow", weight: 15 },
      { word: "negative", weight: 10 },
      { word: "zero", weight: 10 },
      { word: "duplicate", weight: 10 },
      { word: "worst case", weight: 15 },
    ];
    edgeCaseKeywords.forEach(({ word, weight }) => {
      if (tLower.includes(word)) edgeScore += weight;
    });
    edgeScore = Math.min(100, edgeScore);

    // ===== 5. Pattern Recognition Score =====
    let patternScore = 0;
    const patterns = [
      { word: "binary search", weight: 20 },
      { word: "divide and conquer", weight: 20 },
      { word: "two pointer", weight: 20 },
      { word: "two pointers", weight: 20 },
      { word: "hash map", weight: 20 },
      { word: "hash table", weight: 20 },
      { word: "sliding window", weight: 20 },
      { word: "dynamic programming", weight: 20 },
      { word: "greedy", weight: 15 },
      { word: "recursion", weight: 15 },
      { word: "backtracking", weight: 15 },
      { word: "bfs", weight: 15 },
      { word: "dfs", weight: 15 },
      { word: "stack", weight: 10 },
      { word: "queue", weight: 10 },
      { word: "in-place", weight: 10 },
      { word: "memoization", weight: 15 },
    ];
    patterns.forEach(({ word, weight }) => {
      if (tLower.includes(word)) patternScore += weight;
    });
    patternScore = Math.min(100, patternScore);

    // ===== 6. Confidence Score — based on speech patterns =====
    let confidenceScore = 100;
    const confidenceDeductions = [
      { word: "uh", weight: 5 },
      { word: "um", weight: 5 },
      { word: "maybe", weight: 10 },
      { word: "i think", weight: 8 },
      { word: "i guess", weight: 12 },
      { word: "not sure", weight: 15 },
      { word: "i don't know", weight: 20 },
      { word: "probably", weight: 8 },
      { word: "sort of", weight: 8 },
    ];
    confidenceDeductions.forEach(({ word, weight }) => {
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
      0.10 * speedScore +
      0.10 * edgeScore +
      0.08 * patternScore +
      0.07 * confidenceScore
    );

    // ===== 8. Generate Follow-Up Question =====
    const followUpQuestions = {
      "Binary Search": "What happens if the array contains duplicates? How would you find the first occurrence?",
      "Bubble Sort": "Can you optimize Bubble Sort to detect if the array is already sorted? What's the best case then?",
      "Merge Sort": "Can Merge Sort be done in-place? What's the trade-off?",
      "Quick Sort": "How does pivot selection affect worst-case performance? What's the Median of Three strategy?",
      "BFS": "How would you modify BFS to find the shortest path in a weighted graph?",
      "DFS": "Can you use DFS to detect a cycle in a directed graph? How?",
      "Hash Map": "How would you handle hash collisions if using open addressing instead of chaining?",
      "Two Pointers": "Can the Two Pointers approach work on unsorted arrays? When would it fail?",
    };
    const followUpQuestion = followUpQuestions[topic] ||
      "Can you optimize this further, or explain what would happen if the input scale doubled?";

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
