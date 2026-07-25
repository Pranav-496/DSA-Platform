const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
    topic: { type: String, required: true, index: true },
    id: { type: Number, required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true }
});

// Compound index to ensure topic+id is unique
quizQuestionSchema.index({ topic: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
