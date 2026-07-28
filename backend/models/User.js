const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
  },
  avatar: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
    trim: true,
  },
  website: {
    type: String,
    default: "",
    trim: true,
  },
  gamification: {
    xp: { type: Number, default: 0 },
    rankTier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Diamond', 'AlgoNova Elite'], default: 'Bronze' },
    streak: {
      current: { type: Number, default: 0 },
      highest: { type: Number, default: 0 },
      lastActive: { type: Date, default: null }
    },
    badges: [{
      id: String,
      name: String,
      description: String,
      earnedAt: { type: Date, default: Date.now },
      iconColor: { type: String, default: 'neon-cyan' }
    }]
  },
  progress: {
    problemsSolved: { type: Number, default: 0 },
    accuracy: { type: Number, default: 100 },
    placementReadiness: { type: Number, default: 0 },
    weakAreas: { type: [String], default: [] },
    quizScores: {
      type: Map,
      of: Number,
      default: {},
    },
    activityHeatmap: {
      type: Map,
      of: Number,
      default: {},
    },
    voiceScores: [{
      topic: String,
      score: Number,
      date: { type: Date, default: Date.now }
    }],
    systemDesignScores: [{
      challengeTitle: String,
      score: Number,
      date: { type: Date, default: Date.now }
    }],
    recentActivity: [{
      type: { type: String, enum: ['problem', 'quiz', 'voice', 'system'] },
      text: String,
      time: { type: Date, default: Date.now }
    }]
  }
}, { timestamps: true });

// Pre-save hook to hash password
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
