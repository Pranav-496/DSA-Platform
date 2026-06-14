const fs = require('fs');
const path = require('path');

const kbPath = path.join(__dirname, '../rag/knowledgeBase.json');
const knowledgeBase = JSON.parse(fs.readFileSync(kbPath, 'utf8'));

/**
 * Enhanced AI evaluation using Gemini API with structured DSA scoring.
 * Falls back to a deep rule-based analysis when API is unavailable.
 */
async function analyzeVoice(transcript, topic) {
    // ========================================
    // Try Gemini API first (structured prompt)
    // ========================================
    if (process.env.GEMINI_API_KEY) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a senior DSA interviewer evaluating a candidate's verbal explanation.

Topic: "${topic}"
Candidate's Explanation: "${transcript}"

Evaluate strictly and honestly based on:
1. **Correctness**: Does the explanation accurately describe the algorithm?
2. **Completeness**: Are all core steps, edge cases, and complexity analysis covered?
3. **Time/Space Complexity**: Did they mention and correctly state complexities?
4. **Communication Clarity**: Is the explanation clear, structured, and professional?

IMPORTANT: Be strict. Do NOT give high scores for vague or incomplete answers.
- A score of 90+ means near-perfect explanation
- A score of 70-89 means good but missing some points
- A score of 50-69 means average, missing several key concepts
- A score below 50 means poor or mostly incorrect

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "dsa_score": <number 0-100>,
  "logic_score": <number 0-100>,
  "communication_score": <number 0-100>,
  "final_score": <number 0-100>,
  "missing_points": ["list of concepts/steps the candidate missed"],
  "feedback": "concise, actionable feedback paragraph"
}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 1024
                    }
                })
            });
            const data = await response.json();
            if (data.candidates && data.candidates[0]) {
                const rawText = data.candidates[0].content.parts[0].text;
                const cleanJson = rawText.replace(/```json|```/g, "").trim();
                const aiResult = JSON.parse(cleanJson);

                // Validate scores are in range
                const clamp = (v) => Math.max(0, Math.min(100, Number(v) || 0));

                return {
                    dsa_score: clamp(aiResult.dsa_score),
                    logic_score: clamp(aiResult.logic_score),
                    communication_score: clamp(aiResult.communication_score),
                    final_score: clamp(aiResult.final_score),
                    score: clamp(aiResult.final_score),
                    confidence: clamp(aiResult.dsa_score),
                    communication: clamp(aiResult.communication_score),
                    matchedKeywords: [],
                    missedSteps: aiResult.missing_points || [],
                    feedback: aiResult.feedback || "Assessment complete.",
                    source: "gemini"
                };
            }
        } catch (e) {
            console.error("Gemini AI error, falling back to rules:", e.message);
        }
    }

    // ========================================
    // Enhanced Rule-Based Fallback (RAG)
    // ========================================
    return analyzeWithRules(transcript, topic);
}

/**
 * Deep rule-based analysis — not a simple keyword counter.
 * Scores based on concept coverage, explanation depth, and structure.
 */
function analyzeWithRules(transcript, topic) {
    const topicData = knowledgeBase.find(k => k.topic.toLowerCase() === topic.toLowerCase());
    if (!topicData) {
        return {
            dsa_score: 0,
            logic_score: 0,
            communication_score: 0,
            final_score: 0,
            score: 0,
            confidence: 0,
            communication: 0,
            matchedKeywords: [],
            missedSteps: [],
            feedback: 'Topic not found in knowledge base.',
            source: "rule_fallback"
        };
    }

    const words = transcript.toLowerCase().split(/\W+/).filter(w => w.length > 0);
    const transcriptLower = transcript.toLowerCase();
    const wordCount = words.length;

    // --- Keyword Match Analysis ---
    const matchedKeywords = topicData.keywords.filter(kw =>
        transcriptLower.includes(kw.toLowerCase())
    );
    const keywordCoverage = topicData.keywords.length > 0
        ? (matchedKeywords.length / topicData.keywords.length)
        : 0;

    // --- Core Steps Analysis ---
    const missedSteps = [];
    let stepsHit = 0;
    topicData.core_steps.forEach(step => {
        if (transcriptLower.includes(step.toLowerCase())) {
            stepsHit++;
        } else {
            missedSteps.push(step);
        }
    });
    const stepCoverage = topicData.core_steps.length > 0
        ? (stepsHit / topicData.core_steps.length)
        : 0;

    // --- Complexity Analysis ---
    let complexityScore = 0;
    const complexityPatterns = [
        /o\s*\(\s*n\s*\)/i,
        /o\s*\(\s*n\s*log\s*n\s*\)/i,
        /o\s*\(\s*log\s*n\s*\)/i,
        /o\s*\(\s*1\s*\)/i,
        /o\s*\(\s*n\s*[²2^]\s*\)/i,
        /o\s*\(\s*n\s*\*\s*n\s*\)/i,
        /logarithmic/i,
        /linear/i,
        /quadratic/i,
        /constant/i,
        /n squared/i,
        /n log n/i,
    ];
    complexityPatterns.forEach(pattern => {
        if (pattern.test(transcriptLower)) complexityScore += 15;
    });
    complexityScore = Math.min(100, complexityScore);

    // --- Communication Score ---
    let communicationScore = 0;
    if (wordCount < 5) communicationScore = 5;
    else if (wordCount < 10) communicationScore = 15;
    else if (wordCount < 20) communicationScore = 35;
    else if (wordCount < 40) communicationScore = 55;
    else if (wordCount < 60) communicationScore = 70;
    else if (wordCount < 100) communicationScore = 85;
    else communicationScore = 95;

    // Deduct for filler words
    const fillerWords = ["um", "uh", "like", "basically", "you know", "sort of"];
    let fillerCount = 0;
    fillerWords.forEach(f => {
        const regex = new RegExp(`\\b${f}\\b`, 'gi');
        const matches = transcriptLower.match(regex);
        if (matches) fillerCount += matches.length;
    });
    communicationScore = Math.max(0, communicationScore - (fillerCount * 3));

    // Bonus for structured explanation
    if (transcriptLower.includes("first") || transcriptLower.includes("step 1")) communicationScore += 5;
    if (transcriptLower.includes("then") || transcriptLower.includes("next")) communicationScore += 5;
    if (transcriptLower.includes("finally") || transcriptLower.includes("therefore")) communicationScore += 5;
    communicationScore = Math.min(100, communicationScore);

    // --- DSA Understanding Score ---
    const dsaScore = Math.round(
        (keywordCoverage * 40) +
        (stepCoverage * 40) +
        (complexityScore * 0.2)
    );

    // --- Logic Score ---
    const logicScore = Math.round(
        (stepCoverage * 50) +
        (keywordCoverage * 30) +
        (complexityScore * 0.2)
    );

    // --- Final Score ---
    const finalScore = Math.round(
        (dsaScore * 0.35) +
        (logicScore * 0.30) +
        (communicationScore * 0.20) +
        (complexityScore * 0.15)
    );

    // --- Generate feedback ---
    let feedback;
    if (finalScore >= 80) {
        feedback = topicData.feedback.positive;
    } else if (finalScore >= 50) {
        feedback = `Decent attempt. ${topicData.feedback.improvement} You covered ${matchedKeywords.length}/${topicData.keywords.length} key concepts.`;
    } else {
        feedback = `Needs significant improvement. ${topicData.feedback.improvement} Only ${matchedKeywords.length}/${topicData.keywords.length} key concepts were mentioned.`;
    }

    return {
        dsa_score: Math.min(100, dsaScore),
        logic_score: Math.min(100, logicScore),
        communication_score: Math.min(100, communicationScore),
        final_score: Math.min(100, finalScore),
        score: Math.min(100, finalScore),
        confidence: Math.round(keywordCoverage * 100),
        communication: communicationScore,
        matchedKeywords,
        missedSteps,
        feedback,
        source: "rule_engine"
    };
}

/**
 * Evaluate code quality using Gemini or rule-based analysis.
 * Used by the interview route for code scoring.
 */
async function evaluateCode(code, topic) {
    if (process.env.GEMINI_API_KEY) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a senior DSA code reviewer. Evaluate this code solution for "${topic}".

Code:
\`\`\`
${code}
\`\`\`

Evaluate:
1. Correctness (does it solve the problem?)
2. Time complexity
3. Space complexity
4. Code quality (readability, naming, edge cases)

Return ONLY a valid JSON (no markdown):
{
  "code_score": <0-100>,
  "time_complexity": "<e.g. O(n)>",
  "space_complexity": "<e.g. O(1)>",
  "is_optimal": <true/false>,
  "issues": ["list of problems"],
  "strengths": ["list of good things"]
}`
                        }]
                    }],
                    generationConfig: { temperature: 0.2, maxOutputTokens: 512 }
                })
            });
            const data = await response.json();
            if (data.candidates && data.candidates[0]) {
                const rawText = data.candidates[0].content.parts[0].text;
                const cleanJson = rawText.replace(/```json|```/g, "").trim();
                return JSON.parse(cleanJson);
            }
        } catch (e) {
            console.error("Gemini code eval error:", e.message);
        }
    }

    // Fallback: basic code analysis
    return analyzeCodeWithRules(code, topic);
}

function analyzeCodeWithRules(code, topic) {
    let score = 0;
    const codeStr = code || "";

    // Basic structure checks
    if (codeStr.includes("for") || codeStr.includes("while")) score += 15;
    if (codeStr.includes("if")) score += 10;
    if (codeStr.includes("return") || codeStr.includes("print")) score += 10;
    if (codeStr.length > 50) score += 10;
    if (codeStr.length > 200) score += 10;

    // Topic-specific checks
    const lowerTopic = (topic || "").toLowerCase();
    if (lowerTopic.includes("binary search")) {
        if (codeStr.includes("mid")) score += 15;
        if ((codeStr.includes("low") && codeStr.includes("high")) ||
            (codeStr.includes("left") && codeStr.includes("right"))) score += 15;
        if (codeStr.includes("while")) score += 5;
    } else if (lowerTopic.includes("two sum") || lowerTopic.includes("hash")) {
        if (codeStr.includes("Map") || codeStr.includes("dict") || codeStr.includes("{}")) score += 20;
    } else if (lowerTopic.includes("sort")) {
        if (codeStr.includes("swap") || codeStr.includes("temp")) score += 10;
        if (codeStr.includes("merge") || codeStr.includes("pivot")) score += 15;
    } else if (lowerTopic.includes("bfs")) {
        if (codeStr.includes("queue") || codeStr.includes("Queue")) score += 20;
        if (codeStr.includes("visited")) score += 10;
    } else if (lowerTopic.includes("dfs")) {
        if (codeStr.includes("stack") || codeStr.includes("recursive")) score += 15;
        if (codeStr.includes("visited")) score += 10;
    }

    // Edge case handling
    if (codeStr.includes("null") || codeStr.includes("None") ||
        codeStr.includes("undefined") || codeStr.includes("length === 0") ||
        codeStr.includes("!")) {
        score += 10;
    }

    score = Math.min(100, Math.max(0, score));

    return {
        code_score: score,
        time_complexity: "Unknown",
        space_complexity: "Unknown",
        is_optimal: score >= 70,
        issues: score < 50 ? ["Solution appears incomplete or incorrect"] : [],
        strengths: score >= 50 ? ["Basic structure present"] : []
    };
}

module.exports = { analyzeVoice, evaluateCode, analyzeCodeWithRules };
