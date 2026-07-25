const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    difficulty: { type: String, required: true },
    tags: [{ type: String }],
    funcName: { type: String, required: true },
    description: { type: String, required: true },
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],
    starterCode: {
        javascript: String,
        python: String,
        java: String,
        cpp: String
    },
    testCases: [{
        input: String,
        expected: String
    }]
});

module.exports = mongoose.model('Problem', problemSchema);
