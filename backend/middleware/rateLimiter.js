const rateLimit = require('express-rate-limit');

// General rate limiter for most API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});

// Stricter rate limiter for expensive AI routes
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 requests per hour for AI
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many AI requests from this IP. To prevent abuse, please try again in an hour.' }
});

// Stricter rate limiter for code execution
const codeExecLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 code runs per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many code execution requests. Please wait a few minutes before trying again.' }
});

module.exports = {
  apiLimiter,
  aiLimiter,
  codeExecLimiter
};
