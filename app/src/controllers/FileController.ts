import AddFileToQueue from "./../useCases/AddFileToQueue";
import { Request, Response } from "express";
import RedisFileQueue from "./../infra/queues/RedisFileQueue";
import AwsS3FileStorage from "../infra/gateways/AwsS3FileStorage";
import { FileEntity } from "./../interfaces/FileEntity.d";

export default class FileController {
  static async addProducts(req: Request, res: Response) {
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

    const newFilename = await addFileToQueue.execute(fileEntity);
    res.send({
      newFilename,
    });
  }

  static async getProductListStatus(req: Request, res: Response) {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).send("Filename not provided");
    }

    const redisFileQueue = RedisFileQueue.getInstance();

    const productListStatus = await redisFileQueue.getJobStatus(filename);

    res.send({
      productListStatus,
    });
  }
}
