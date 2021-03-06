import RedisFileQueue from "../../../infra/queues/RedisFileQueue";

export async function createRedisFileQueue(): Promise<RedisFileQueue> {
  const redisFileQueue = RedisFileQueue.getInstance();
  await redisFileQueue.initialize(
    process.env.QUEUE_NAME,
    process.env.REDIS_HOST,
    +process.env.REDIS_PORT,
  );
  return redisFileQueue;
}
