const redis = require('redis');
const { exec} = require('child_process');

// if in development mode use Redis file attached
// start redis as a child process
if (process.env.ENV === 'dev') {
    const puts = (error, stdout) =>{
        console.log(error);
        console.log(stdout);
}
//exec('redis/src/redis-server redis/redis.conf', puts);  
}

const redisClient = redis.createClient();

redisClient.on('connect',()=>{
    console.log('Redis client connected');
});

redisClient.on('error', (error)=>{
    console.log('Redis not connected', error);
});

module.exports = redisClient;