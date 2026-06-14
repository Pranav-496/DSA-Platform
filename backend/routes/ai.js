const express = require('express');
const router = express.Router();
const { analyzeVoice, evaluateCode } = require('../ai/ruleEngine');

// Code analysis endpoint
router.post('/analyze', (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code required' });
    
    let feedback = 'Code structure looks solid.';
    let status = 'ok';

    const nestedLoops = code.match(/for.*\{[^}]*for|while.*\{[^}]*while/gs);
    if (nestedLoops) {
        feedback = 'Detected nested loops → likely O(n²) time complexity. Consider using a hash map for O(n) optimization.';
        status = 'warning';
    }

    if (code.includes('function') && code.match(/(\w+)\([^)]*\)[\s\S]*\1\(/)) {
        if (!code.includes('memo') && !code.includes('cache') && !code.includes('dp')) {
            feedback = 'Recursive solution detected. Consider adding memoization to avoid redundant computations.';
            status = 'warning';
        }
    }

    if (code.includes('Map()') || code.includes('{}') || code.includes('dict(')) {
        if (status === 'ok') {
            feedback = 'Good use of hash map/object for efficient lookups. Time complexity looks optimal.';
        }
    }

    if (code.includes('.sort(')) {
        feedback += ' Note: Built-in sort is O(n log n).';
    }

    if (code.includes('if') && (code.includes('null') || code.includes('undefined') || code.includes('length === 0') || code.includes('!') )) {
        feedback += ' Good edge case handling detected.';
    }

    res.json({ feedback, status });
});

// Voice analysis endpoint
router.post('/voice/analyze', async (req, res) => {
    const { transcript, topic } = req.body;
    if (!transcript || !topic) return res.status(400).json({ error: 'Missing transcript or topic' });

    const result = await analyzeVoice(transcript, topic);
    res.json(result);
});

// ========================================
// Code Review AI (Deep Analysis)
// ========================================
router.post('/code-review', async (req, res) => {
    const { code, topic, language } = req.body;
    if (!code) return res.status(400).json({ error: 'Code required' });

    const result = await evaluateCode(code, topic || "General");
    res.json(result);
});

// ========================================
// Speech Quality Analysis
// ========================================
router.post('/speech-quality', (req, res) => {
    const { transcript } = req.body;
    if (!transcript) return res.status(400).json({ error: 'Transcript required' });

    const words = transcript.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const tLower = transcript.toLowerCase();

    // Filler word analysis
    const fillers = { "um": 0, "uh": 0, "like": 0, "basically": 0, "you know": 0, "sort of": 0, "kind of": 0, "i mean": 0, "actually": 0 };
    let totalFillers = 0;
    Object.keys(fillers).forEach(f => {
        const regex = new RegExp(`\\b${f}\\b`, 'gi');
        const matches = tLower.match(regex);
        if (matches) { fillers[f] = matches.length; totalFillers += matches.length; }
    });

    // Clarity score
    let clarityScore = 100;
    const fillerRatio = wordCount > 0 ? totalFillers / wordCount : 0;
    if (fillerRatio > 0.15) clarityScore -= 30;
    else if (fillerRatio > 0.08) clarityScore -= 15;
    else if (fillerRatio > 0.03) clarityScore -= 5;

    // Structure checks
    let structureScore = 0;
    if (tLower.includes("first") || tLower.includes("step one")) structureScore += 20;
    if (tLower.includes("then") || tLower.includes("next")) structureScore += 20;
    if (tLower.includes("finally") || tLower.includes("so overall")) structureScore += 20;
    if (tLower.includes("because") || tLower.includes("the reason")) structureScore += 15;
    if (tLower.includes("time complexity") || tLower.includes("space complexity")) structureScore += 25;
    structureScore = Math.min(100, structureScore);

    // Pace (words per assumed minute — rough)
    const estimatedMinutes = wordCount / 130; // average speaking rate
    const pace = estimatedMinutes > 0 ? Math.round(wordCount / estimatedMinutes) : 0;
    let paceRating = "good";
    if (pace > 170) paceRating = "too fast";
    else if (pace < 90 && wordCount > 10) paceRating = "too slow";

    // Suggestions
    const suggestions = [];
    if (totalFillers > 3) suggestions.push(`Reduce filler words (${totalFillers} found). Practice pausing instead of saying "um" or "uh".`);
    if (structureScore < 40) suggestions.push("Structure your answer: start with approach, then steps, then complexity.");
    if (wordCount < 20) suggestions.push("Your explanation is too brief. Aim for 30-60 seconds of clear explanation.");
    if (!tLower.includes("complexity")) suggestions.push("Always mention time and space complexity in your explanation.");
    if (structureScore >= 60 && totalFillers < 2) suggestions.push("Great communication! Your explanation is clear and structured.");

    res.json({
        wordCount,
        totalFillers,
        fillerBreakdown: Object.fromEntries(Object.entries(fillers).filter(([, v]) => v > 0)),
        clarityScore: Math.max(0, clarityScore),
        structureScore,
        pace,
        paceRating,
        suggestions,
        overallSpeechScore: Math.round((clarityScore * 0.4) + (structureScore * 0.4) + (Math.min(100, wordCount * 1.5) * 0.2)),
    });
});

// ========================================
// AI Follow-Up Questions (Dynamic)
// ========================================
router.post('/follow-up', async (req, res) => {
    const { topic, code, transcript, previousScore } = req.body;

    // Try Gemini first
    if (process.env.GEMINI_API_KEY) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `You are a senior tech interviewer. The candidate just solved a "${topic}" problem.

Their code:
\`\`\`
${code || "No code submitted"}
\`\`\`

Their verbal explanation: "${transcript || "No explanation given"}"

Generate exactly 3 follow-up questions that a real interviewer would ask. Focus on:
1. Optimization or edge cases
2. Scalability or real-world application
3. Alternative approaches

Return ONLY a JSON array of strings (no markdown):
["question 1", "question 2", "question 3"]` }] }],
                    generationConfig: { temperature: 0.5, maxOutputTokens: 300 }
                })
            });
            const data = await response.json();
            if (data.candidates && data.candidates[0]) {
                const raw = data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
                const questions = JSON.parse(raw);
                return res.json({ questions, source: "gemini" });
            }
        } catch (e) {
            console.error("Gemini follow-up error:", e.message);
        }
    }

    // Fallback: rule-based follow-ups
    const followUps = {
        "Binary Search": [
            "What if the array contains duplicates and you need the first occurrence?",
            "Can this work on a rotated sorted array? How would you modify it?",
            "What's the space complexity of iterative vs recursive binary search?"
        ],
        "Bubble Sort": [
            "How can you optimize Bubble Sort to detect an already sorted array?",
            "Is Bubble Sort stable? Why does stability matter?",
            "When would Bubble Sort outperform Quick Sort?"
        ],
        "Merge Sort": [
            "Can you implement Merge Sort in-place? What's the trade-off?",
            "Why is Merge Sort preferred for linked lists over Quick Sort?",
            "What happens to the space complexity if you don't use auxiliary arrays?"
        ],
        "BFS": [
            "How would you modify BFS to find the shortest path in a weighted graph?",
            "What's the difference between BFS and Dijkstra's algorithm?",
            "Can BFS detect cycles in a directed graph?"
        ],
        "DFS": [
            "How do you detect a cycle using DFS with coloring?",
            "What's the difference between DFS pre-order and post-order?",
            "When would you prefer iterative DFS over recursive?"
        ],
    };

    const questions = followUps[topic] || [
        "Can you optimize the time complexity further?",
        "What if the input size is 10^6? Would your solution still work?",
        "Are there alternative data structures that could improve this?"
    ];

    res.json({ questions, source: "rule_fallback" });
});

// ========================================
// Test Case Generator
// ========================================
router.post('/generate-tests', (req, res) => {
    const { problemId, size = 100, type = "random" } = req.body;

    const generators = {
        1: (sz, tp) => { // Two Sum
            const arr = [];
            for (let i = 0; i < sz; i++) arr.push(Math.floor(Math.random() * sz * 2) - sz);
            const idx1 = Math.floor(Math.random() * sz);
            let idx2 = Math.floor(Math.random() * sz);
            while (idx2 === idx1) idx2 = Math.floor(Math.random() * sz);
            const target = arr[idx1] + arr[idx2];
            return { input: `[${arr.join(",")}], ${target}`, expected: `[${Math.min(idx1,idx2)},${Math.max(idx1,idx2)}]`, note: `Array size: ${sz}` };
        },
        2: (sz, tp) => { // Binary Search
            const arr = Array.from({ length: sz }, (_, i) => i * 2 + 1);
            const target = tp === "worst" ? -1 : arr[Math.floor(Math.random() * sz)];
            const expected = arr.indexOf(target);
            return { input: `[${arr.join(",")}], ${target}`, expected: `${expected}`, note: `Sorted array, size: ${sz}` };
        },
        5: (sz, tp) => { // Max Subarray
            const arr = [];
            for (let i = 0; i < sz; i++) arr.push(Math.floor(Math.random() * 200) - 100);
            if (tp === "worst") arr.fill(-1); // worst case: all negatives
            let maxSum = -Infinity, cur = 0;
            arr.forEach(n => { cur = Math.max(n, cur + n); maxSum = Math.max(maxSum, cur); });
            return { input: `[${arr.join(",")}]`, expected: `${maxSum}`, note: `Size: ${sz}, type: ${tp}` };
        },
        7: (sz) => { // Climbing stairs
            const n = Math.min(sz, 45);
            let a = 1, b = 2;
            for (let i = 3; i <= n; i++) { const t = a + b; a = b; b = t; }
            return { input: `${n}`, expected: `${n <= 1 ? 1 : n === 2 ? 2 : b}`, note: `n = ${n}` };
        }
    };

    const gen = generators[problemId];
    if (!gen) {
        return res.json({ error: "Generator not available for this problem", testCases: [] });
    }

    const testCases = [];
    const count = Math.min(5, Math.max(1, Math.ceil(size / 100)));
    for (let i = 0; i < count; i++) {
        testCases.push(gen(size, type));
    }

    res.json({ testCases, count: testCases.length, size, type });
});

module.exports = router;
