const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

const connectRedis = async () => {
    redisClient.on('error', err => console.log('Redis Client Error', err));

    await redisClient.connect();

    await redisClient.set('foo', 'bar');
    const result = await redisClient.get('foo');
    console.log("Redis result:", result);
};

module.exports = { connectRedis, redisClient };