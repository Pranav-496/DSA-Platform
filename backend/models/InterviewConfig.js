const mongoose = require('mongoose');

const interviewConfigSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // e.g. "default_config"
    edgeCaseKeywords: [{ type: String }],
    patterns: [{ type: String }],
    confidenceDeductions: [{ type: String }],
    followUpQuestions: {
        type: Map,
        of: [String]
    },
    scoringWeights: {
        speed: { type: Number, default: 0.2 },
        edge: { type: Number, default: 0.3 },
        pattern: { type: Number, default: 0.3 },
        confidence: { type: Number, default: 0.2 }
    }
});

module.exports = mongoose.model('InterviewConfig', interviewConfigSchema);
