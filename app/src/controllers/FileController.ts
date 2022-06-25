import AddFileToQueue from "./../useCases/AddFileToQueue";
import { Request, Response } from "express";
import RedisFileQueue from "./../infra/queues/RedisFileQueue";
import AwsS3FileStorage from "../infra/gateways/AwsS3FileStorage";
import { FileEntity } from "../interfaces/entities/FileEntity";

export default class FileController {
  static async addProductList(req: Request, res: Response) {
    const { file } = req;

    if (!file) {
      return res.status(400).send("File not provided");
    }

    const awsS3FileStorage = AwsS3FileStorage.getInstance();
    const redisFileQueue = RedisFileQueue.getInstance();
    const addFileToQueue = new AddFileToQueue(awsS3FileStorage, redisFileQueue);

    const fileEntity: FileEntity = {
      file: file.buffer,
      filename: file.originalname,
    };

    const { storageFilename, jobId } = await addFileToQueue.execute(fileEntity);
    res.send({ storageFilename, jobId });
  }

  static async getProductListStatus(req: Request, res: Response) {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).send("jobId not provided");
    }

    const redisFileQueue = RedisFileQueue.getInstance();

    const productListStatus = await redisFileQueue.getJobStatus(jobId);

    if (productListStatus === "notFound") {
      return res.status(404).send({
        productListStatus,
      });
    }

    res.send({
      productListStatus,
    });
  }
}
