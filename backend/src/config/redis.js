const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.RDS_PASS,
    socket: {
        host: process.env.RDS_HOST,
        port: process.env.RDS_PORT
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