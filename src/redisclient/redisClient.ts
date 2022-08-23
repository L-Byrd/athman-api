import redis from 'redis';
import { createClient } from 'redis';

//setup redis client
type RedisClientType = ReturnType<typeof createClient>;
const url = process.env.REDIS_URI;
const redisClient: RedisClientType = redis.createClient({url});


export default redisClient;