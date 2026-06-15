const { createClient } = require('redis');

// Initialize Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Redis Connected'));

// Only connect if not in a pure build environment (optional safeguard)
if (process.env.NODE_ENV !== 'test') {
  redisClient.connect().catch(console.error);
}

module.exports = redisClient;
