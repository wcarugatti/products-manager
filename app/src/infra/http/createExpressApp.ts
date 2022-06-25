import "dotenv/config";
import express, { Express } from "express";
import { createAwsS3FileStorage } from "../../factories/infra/gateways/createAwsS3FileStorage";
import { createRedisFileQueue } from "../../factories/infra/queues/createRedisFileQueue";
import { router } from "./routes";

export async function createExpressApp(): Promise<Express> {
  await createAwsS3FileStorage();
  await createRedisFileQueue();

  const app = express();
  app.use(express.json());
  app.use(router);

  return app;
}
