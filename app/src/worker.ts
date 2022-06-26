import { createAwsS3FileStorage } from "./factories/infra/gateways/createAwsS3FileStorage";
import { createRedisFileQueue } from "./factories/infra/queues/createRedisFileQueue";
import dataSource from "./infra/postgres/DataSource";
import ProductsRepositoryPostgres from "./infra/postgres/repositories/ProductsRepositoryPostgres";
import CsvProductListProcessor from "./infra/processors/CsvProductListProcessor";

(async () => {
  const redisFileQueue = await createRedisFileQueue();
  const AwsS3FileStorage = await createAwsS3FileStorage();
  const productsRepositoryPostgres = new ProductsRepositoryPostgres();
  await dataSource.initialize();

  const csvProductListProcessor = new CsvProductListProcessor(
    AwsS3FileStorage,
    productsRepositoryPostgres,
  );

  redisFileQueue.setupWorker(csvProductListProcessor)

})();
