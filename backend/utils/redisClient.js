const { createClient } = require('redis');

// Initialize Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  if (err.code === 'ECONNREFUSED' || (err.message && err.message.includes('ECONNREFUSED'))) return;
  console.log('Redis Client Warning:', err.message || err);
});
redisClient.on('connect', () => console.log('✅ Redis Connected'));

if (process.env.NODE_ENV !== 'test') {
  redisClient.connect().catch(() => {});
}

module.exports = redisClient;
