const Problem = require('../models/Problem');
const QuizQuestion = require('../models/QuizQuestion');
const InterviewConfig = require('../models/InterviewConfig');

const problemsData = require('../data/problems');
const quizData = require('../data/quizData');

async function seedDatabase() {
    try {
        const problemCount = await Problem.countDocuments();
        if (problemCount === 0) {
            console.log("🌱 Seeding Problems...");
            await Problem.insertMany(problemsData);
        }

        const quizCount = await QuizQuestion.countDocuments();
        if (quizCount === 0) {
            console.log("🌱 Seeding Quiz Questions...");
            const allQuizQuestions = [];
            for (const [topic, questions] of Object.entries(quizData)) {
                for (const q of questions) {
                    allQuizQuestions.push({
                        topic,
                        id: q.id,
                        question: q.question,
                        options: q.options,
                        answer: q.answer
                    });
                }
            }
            await QuizQuestion.insertMany(allQuizQuestions);
        }

        const configCount = await InterviewConfig.countDocuments();
        if (configCount === 0) {
            console.log("🌱 Seeding Interview Config...");
            await InterviewConfig.create({
                id: "default_config",
                edgeCaseKeywords: [
                    "empty:15", "null:15", "single element:15", "single:10",
                    "edge case:20", "edge:10", "boundary:15", "overflow:15",
                    "negative:10", "zero:10", "duplicate:10", "worst case:15"
                ],
                patterns: [
                    "binary search:20", "divide and conquer:20", "two pointer:20",
                    "two pointers:20", "hash map:20", "hash table:20",
                    "sliding window:20", "dynamic programming:20", "greedy:15",
                    "recursion:15", "backtracking:15", "bfs:15", "dfs:15",
                    "stack:10", "queue:10", "in-place:10", "memoization:15"
                ],
                confidenceDeductions: [
                    "uh:5", "um:5", "maybe:10", "i think:8", "i guess:12",
                    "not sure:15", "i don't know:20", "probably:8", "sort of:8"
                ],
                followUpQuestions: {
                    "Binary Search": ["What happens if the array contains duplicates? How would you find the first occurrence?"],
                    "Bubble Sort": ["Can you optimize Bubble Sort to detect if the array is already sorted? What's the best case then?"],
                    "Merge Sort": ["Can Merge Sort be done in-place? What's the trade-off?"],
                    "Quick Sort": ["How does pivot selection affect worst-case performance? What's the Median of Three strategy?"],
                    "BFS": ["How would you modify BFS to find the shortest path in a weighted graph?"],
                    "DFS": ["Can you use DFS to detect a cycle in a directed graph? How?"],
                    "Hash Map": ["How would you handle hash collisions if using open addressing instead of chaining?"],
                    "Two Pointers": ["Can the Two Pointers approach work on unsorted arrays? When would it fail?"]
                },
                scoringWeights: {
                    speed: 0.10,
                    edge: 0.10,
                    pattern: 0.08,
                    confidence: 0.07
                }
            });
        }

        console.log("✅ Database seeded successfully");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    }
}

module.exports = seedDatabase;
