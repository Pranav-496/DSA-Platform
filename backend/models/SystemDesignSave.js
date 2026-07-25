const mongoose = require('mongoose');

const SystemDesignSaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  challengeId: {
    type: Number,
    default: null
  },
  elements: {
    type: Array,
    required: true,
    default: []
  },
  appState: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('SystemDesignSave', SystemDesignSaveSchema);
