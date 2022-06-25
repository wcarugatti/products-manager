import { FileQueue } from "../../interfaces/infra/FileQueue";
import Queue, { JobId, JobStatus } from "bull";

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

  async add(filename: string): Promise<string> {
    const job = await this.redisQueue.add(filename);
    return String(job.id)
  }

  async getJobStatus(jobId: string): Promise<JobStatus | "stuck" | "notFound"> {
    const currentJob = await this.redisQueue.getJob(jobId);
    if (!currentJob) {
      return "notFound";
    }

    return await currentJob.getState();
  }
}
