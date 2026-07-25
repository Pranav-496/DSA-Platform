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

// ========================================
// System Design AI Review
// ========================================
router.post('/system-design-review', async (req, res) => {
    const { challengeTitle, elements, keyComponents, evaluationCriteria } = req.body;
    if (!elements || !Array.isArray(elements)) {
        return res.status(400).json({ error: 'Excalidraw elements array required' });
    }

    // Extract text labels from Excalidraw elements
    const textElements = elements
        .filter(el => el.type === 'text' && el.text && !el.isDeleted)
        .map(el => el.text.trim().toLowerCase());

    const rectElements = elements.filter(el => el.type === 'rectangle' && !el.isDeleted);
    const ellipseElements = elements.filter(el => el.type === 'ellipse' && !el.isDeleted);
    const diamondElements = elements.filter(el => el.type === 'diamond' && !el.isDeleted);
    const arrowElements = elements.filter(el => (el.type === 'arrow' || el.type === 'line') && !el.isDeleted);
    
    const componentCount = rectElements.length + ellipseElements.length + diamondElements.length;
    const connectionCount = arrowElements.length;
    const allText = textElements.join(' ');

    // Check which key components are present
    const expectedComponents = (keyComponents || []).map(c => c.toLowerCase());
    const foundComponents = [];
    const missingComponents = [];

    const abbreviationMap = {
        'load balancer': ['lb', 'nginx', 'haproxy', 'elb', 'alb', 'balancer'],
        'cache': ['redis', 'memcached', 'caching', 'cache layer', 'in-memory'],
        'database': ['db', 'mysql', 'postgres', 'postgresql', 'mongodb', 'sql', 'nosql', 'dynamo', 'dynamodb', 'cassandra', 'rds', 'aurora', 'cockroach'],
        'message queue': ['kafka', 'rabbitmq', 'sqs', 'queue', 'pub/sub', 'pubsub', 'broker', 'event bus', 'nats', 'pulsar', 'kinesis'],
        'cdn': ['cloudfront', 'akamai', 'content delivery', 'edge', 'fastly'],
        'api gateway': ['gateway', 'api gw', 'api layer', 'kong', 'apigee', 'zuul'],
        'object storage': ['s3', 'blob', 'gcs', 'object store', 'blob storage', 'minio'],
        'search': ['elasticsearch', 'solr', 'opensearch', 'algolia', 'typesense'],
        'notification': ['push', 'sns', 'alert', 'email', 'sms', 'notification service', 'fcm', 'apns'],
        'websocket': ['ws', 'socket', 'real-time', 'realtime', 'socket.io', 'signalr'],
        'consistent hashing': ['hash ring', 'consistent hash', 'virtual nodes', 'vnodes'],
        'lru cache': ['lru', 'eviction', 'least recently'],
        'gossip protocol': ['gossip', 'anti-entropy', 'rumor'],
        'replica': ['replica', 'replication', 'follower', 'secondary'],
        'trie': ['trie', 'prefix tree', 'radix'],
        'graph database': ['graph db', 'neo4j', 'dgraph'],
        'data pipeline': ['pipeline', 'etl', 'batch', 'spark', 'hadoop', 'flink'],
        'transcoding': ['transcode', 'encoding', 'ffmpeg', 'media processing'],
        'presence': ['presence', 'online', 'heartbeat', 'status'],
        'block server': ['block', 'chunk', 'chunking', 'delta sync'],
        'sync service': ['sync', 'synchronization', 'file sync'],
        'fanout': ['fanout', 'fan-out', 'fan out', 'push model'],
        'timeline': ['timeline', 'feed', 'news feed', 'home feed'],
        'routing service': ['routing', 'pathfinding', 'navigation', 'dijkstra', 'a*'],
        'traffic service': ['traffic', 'congestion', 'live traffic'],
        'inventory': ['inventory', 'stock', 'warehouse'],
        'order service': ['order', 'checkout', 'cart'],
        'payment': ['payment', 'billing', 'stripe', 'paypal', 'transaction'],
    };

    expectedComponents.forEach(comp => {
        const variations = [comp];
        // Add mapped abbreviations
        Object.entries(abbreviationMap).forEach(([key, aliases]) => {
            if (comp.includes(key)) {
                variations.push(...aliases);
            }
        });

        const found = variations.some(v => allText.includes(v));
        if (found) foundComponents.push(comp);
        else missingComponents.push(comp);
    });

    const componentCoverage = expectedComponents.length > 0
        ? Math.round((foundComponents.length / expectedComponents.length) * 100)
        : Math.min(100, componentCount * 10);

    // Score dimensions
    const scores = {
        componentCoverage,
        scalability: 0,
        availability: 0,
        dataFlow: 0,
        consistency: 0,
    };

    // Scalability scoring — deeper keyword matching
    const scalabilitySignals = [
        { keywords: ['load balancer', 'lb', 'nginx', 'elb', 'alb'], weight: 20 },
        { keywords: ['cache', 'redis', 'memcached', 'caching'], weight: 18 },
        { keywords: ['cdn', 'cloudfront', 'edge'], weight: 15 },
        { keywords: ['shard', 'partition', 'sharding'], weight: 20 },
        { keywords: ['queue', 'kafka', 'async', 'rabbitmq', 'sqs', 'event'], weight: 18 },
        { keywords: ['horizontal', 'scale out', 'auto-scale', 'autoscal'], weight: 12 },
        { keywords: ['microservice', 'service'], weight: 8 },
        { keywords: ['replica', 'read replica'], weight: 10 },
    ];
    scalabilitySignals.forEach(({ keywords, weight }) => {
        if (keywords.some(k => allText.includes(k))) scores.scalability += weight;
    });
    scores.scalability = Math.min(100, scores.scalability);

    // Availability scoring
    const availabilitySignals = [
        { keywords: ['replica', 'replication', 'replicate'], weight: 25 },
        { keywords: ['failover', 'backup', 'standby', 'hot standby'], weight: 22 },
        { keywords: ['health', 'monitor', 'heartbeat', 'watchdog'], weight: 18 },
        { keywords: ['redundan', 'fault toleran'], weight: 18 },
        { keywords: ['region', 'zone', 'multi-az', 'multi-region', 'cross-region'], weight: 15 },
        { keywords: ['circuit breaker', 'retry', 'timeout'], weight: 12 },
        { keywords: ['load balancer', 'lb'], weight: 10 },
    ];
    availabilitySignals.forEach(({ keywords, weight }) => {
        if (keywords.some(k => allText.includes(k))) scores.availability += weight;
    });
    if (componentCount >= 6) scores.availability += 10;
    scores.availability = Math.min(100, scores.availability);

    // Data flow scoring
    if (connectionCount > 0 && componentCount > 0) {
        const ratio = connectionCount / componentCount;
        if (ratio >= 1.2) scores.dataFlow = 85;
        else if (ratio >= 1.0) scores.dataFlow = 70;
        else if (ratio >= 0.7) scores.dataFlow = 55;
        else if (ratio >= 0.4) scores.dataFlow = 35;
        else scores.dataFlow = 15;
    }
    const flowKeywords = ['request', 'response', 'flow', 'read', 'write', 'query', 'publish', 'subscribe', 'send', 'receive', 'push', 'pull'];
    flowKeywords.forEach(k => {
        if (allText.includes(k)) scores.dataFlow += 3;
    });
    scores.dataFlow = Math.min(100, scores.dataFlow);

    // Consistency scoring (new dimension)
    const consistencySignals = [
        { keywords: ['eventual consistency', 'eventual'], weight: 20 },
        { keywords: ['strong consistency', 'acid', 'transaction'], weight: 22 },
        { keywords: ['cap theorem', 'cap'], weight: 15 },
        { keywords: ['consensus', 'raft', 'paxos', 'zookeeper'], weight: 20 },
        { keywords: ['idempoten'], weight: 15 },
        { keywords: ['saga', 'two-phase', '2pc', 'distributed transaction'], weight: 18 },
        { keywords: ['conflict resolution', 'vector clock', 'crdt'], weight: 15 },
        { keywords: ['write-ahead', 'wal', 'journal'], weight: 12 },
    ];
    consistencySignals.forEach(({ keywords, weight }) => {
        if (keywords.some(k => allText.includes(k))) scores.consistency += weight;
    });
    // If they mention database at all, give some baseline
    if (allText.includes('db') || allText.includes('database') || allText.includes('sql') || allText.includes('nosql')) {
        scores.consistency += 10;
    }
    scores.consistency = Math.min(100, scores.consistency);

    const overallScore = Math.round(
        scores.componentCoverage * 0.30 +
        scores.scalability * 0.22 +
        scores.availability * 0.18 +
        scores.dataFlow * 0.18 +
        scores.consistency * 0.12
    );

    // Letter grade
    let grade;
    if (overallScore >= 90) grade = 'A+';
    else if (overallScore >= 80) grade = 'A';
    else if (overallScore >= 70) grade = 'B+';
    else if (overallScore >= 60) grade = 'B';
    else if (overallScore >= 50) grade = 'C';
    else if (overallScore >= 35) grade = 'D';
    else grade = 'F';

    // Build suggestions
    const suggestions = [];
    if (componentCount < 3) suggestions.push('Your diagram has very few components. A production system typically needs 5-10+ architectural blocks.');
    if (connectionCount < 2) suggestions.push('Add more arrows/connections to show data flow between components.');
    if (missingComponents.length > 0) {
        suggestions.push(`Consider adding: ${missingComponents.slice(0, 4).map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}.`);
    }
    if (scores.scalability < 40) suggestions.push('Think about horizontal scaling: add a Load Balancer, Cache layer, or Message Queue.');
    if (scores.availability < 40) suggestions.push('Address fault tolerance: add replication, failover mechanisms, or health monitoring.');
    if (scores.dataFlow < 40) suggestions.push('Clarify data flow: label your arrows and show request/response paths.');
    if (scores.consistency < 30) suggestions.push('Discuss consistency: mention your consistency model (eventual vs strong), transactions, or conflict resolution strategy.');
    if (textElements.length < componentCount * 0.5) suggestions.push('Label your components! Text labels help communicate your design intent clearly.');
    if (overallScore >= 75 && suggestions.length === 0) suggestions.push('Excellent architecture! Consider adding capacity estimates and bottleneck analysis for a perfect score.');

    // Try Gemini for advanced feedback
    if (process.env.GEMINI_API_KEY && textElements.length > 2) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `You are a senior system design interviewer at a FAANG company. A candidate is designing "${challengeTitle || 'a system'}".

Their architecture diagram contains these components (extracted from labels): ${textElements.join(', ')}
They have ${componentCount} boxes/rectangles and ${connectionCount} arrows/connections.
${missingComponents.length > 0 ? `Missing key components: ${missingComponents.join(', ')}` : 'All key components are present.'}

Rule-based scores: Coverage ${scores.componentCoverage}%, Scalability ${scores.scalability}%, Availability ${scores.availability}%, Data Flow ${scores.dataFlow}%, Consistency ${scores.consistency}%.

Give a concise 3-4 sentence professional critique. Focus on:
1. What's good about their design
2. The most critical thing they're missing
3. One specific improvement suggestion

Keep it under 100 words. Be constructive but direct. Do NOT use markdown formatting.` }] }],
                    generationConfig: { temperature: 0.4, maxOutputTokens: 200 }
                })
            });
            const data = await response.json();
            if (data.candidates && data.candidates[0]) {
                const aiCritique = data.candidates[0].content.parts[0].text.trim();
                return res.json({
                    overallScore, grade, scores,
                    foundComponents, missingComponents,
                    suggestions, aiCritique,
                    source: 'gemini',
                    stats: { componentCount, connectionCount, textLabels: textElements.length }
                });
            }
        } catch (e) {
            console.error("Gemini system design review error:", e.message);
        }
    }

    // Rule-based fallback critique
    let critique = '';
    if (overallScore >= 75) {
        critique = `Strong architecture for ${challengeTitle || 'this system'}. You've covered ${foundComponents.length}/${expectedComponents.length} key components with clear data flow. Focus on documenting capacity estimates and failure scenarios to push this to the next level.`;
    } else if (overallScore >= 50) {
        critique = `Decent foundation for ${challengeTitle || 'this system'}, but there are gaps. ${missingComponents.length > 0 ? `You're missing critical components: ${missingComponents.slice(0, 3).join(', ')}.` : ''} Strengthen your design by adding explicit scalability and fault-tolerance mechanisms.`;
    } else {
        critique = `Your ${challengeTitle || 'system'} design needs more depth. Start by identifying the core data flow, then add essential infrastructure components like ${missingComponents.slice(0, 3).join(', ') || 'caching, load balancing, and message queues'}. Consider how the system handles 10x traffic growth.`;
    }

    res.json({
        overallScore, grade, scores,
        foundComponents, missingComponents,
        suggestions, aiCritique: critique,
        source: 'rule_engine',
        stats: { componentCount, connectionCount, textLabels: textElements.length }
    });
});

module.exports = router;

