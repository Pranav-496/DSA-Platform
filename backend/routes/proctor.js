const express = require("express");
const router = express.Router();

/**
 * Proctoring violation severity weights.
 * Each violation type has a defined impact on the integrity score.
 */
const VIOLATION_WEIGHTS = {
  tab_switch: 5,
  multiple_faces: 20,
  no_face: 15,
  copy_paste: 10,
  window_blur: 5,
  right_click: 3,
  devtools: 15,
};

/**
 * POST /api/proctor/log — Log a proctoring violation
 * Stores violations in session (could be extended to DB)
 */
const sessions = new Map(); // sessionId -> { violations: [], startTime, totalWeight }

router.post("/log", (req, res) => {
  try {
    const { sessionId, violationType, timestamp, details } = req.body;
    if (!sessionId || !violationType) {
      return res.status(400).json({ error: "sessionId and violationType required" });
    }

    const weight = VIOLATION_WEIGHTS[violationType] || 5;

    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {
        violations: [],
        startTime: Date.now(),
        totalWeight: 0
      });
    }

    const session = sessions.get(sessionId);
    session.violations.push({
      type: violationType,
      weight,
      timestamp: timestamp || new Date().toISOString(),
      details: details || null,
    });
    session.totalWeight += weight;

    const integrityScore = Math.max(0, 100 - session.totalWeight);

    res.json({
      logged: true,
      violationCount: session.violations.length,
      totalWeight: session.totalWeight,
      integrityScore,
      severity: integrityScore >= 80 ? "low" : integrityScore >= 50 ? "medium" : "high",
    });
  } catch (error) {
    console.error("Proctor log error:", error);
    res.status(500).json({ error: "Failed to log violation" });
  }
});

/**
 * GET /api/proctor/report/:sessionId — Get full proctoring report
 */
router.get("/report/:sessionId", (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) {
    return res.json({
      integrityScore: 100,
      violations: [],
      totalWeight: 0,
      duration: 0,
    });
  }

  const duration = Math.round((Date.now() - session.startTime) / 1000);
  const integrityScore = Math.max(0, 100 - session.totalWeight);

  // Group violations by type
  const violationSummary = {};
  session.violations.forEach(v => {
    if (!violationSummary[v.type]) {
      violationSummary[v.type] = { count: 0, totalWeight: 0 };
    }
    violationSummary[v.type].count++;
    violationSummary[v.type].totalWeight += v.weight;
  });

  res.json({
    integrityScore,
    violations: session.violations,
    violationSummary,
    totalWeight: session.totalWeight,
    totalViolations: session.violations.length,
    duration,
    severity: integrityScore >= 80 ? "low" : integrityScore >= 50 ? "medium" : "high",
  });
});

/**
 * POST /api/proctor/start — Start a new proctoring session
 */
router.post("/start", (req, res) => {
  const sessionId = `proctor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessions.set(sessionId, {
    violations: [],
    startTime: Date.now(),
    totalWeight: 0
  });
  res.json({ sessionId });
});

module.exports = router;
