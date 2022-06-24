import { FileQueue } from "../../interfaces/FileQueue";
import Queue from "bull";

export default class RedisFileQueue implements FileQueue {
  private static instance?: RedisFileQueue;
  private redisQueue: Queue.Queue;

  private constructor() {}

  static getInstance(): RedisFileQueue {
    if (RedisFileQueue.instance === undefined)
      RedisFileQueue.instance = new RedisFileQueue();
    return RedisFileQueue.instance;
  }

  async initialize(
    queueName: string,
    redisHost: string,
    redisPort: number,
  ): Promise<void> {
    this.redisQueue = new Queue(queueName, {
      redis: {
        host: redisHost,
        port: redisPort,
      },
    });
    await this.redisQueue.isReady();
  }

  async add(filename: string): Promise<void> {
    await this.redisQueue.add(filename);
  }
}
