import { FileStorage } from "../interfaces/infra/FileStorage";
import { FileQueue } from "../interfaces/infra/FileQueue";
import { FileEntity } from "../interfaces/entities/FileEntity";

interface executeOutput {
  storageFilename: string;
  jobId: string;
}

export default class AddFileToQueue {
  constructor(
    private readonly fileStorage: FileStorage,
    private readonly fileQueue: FileQueue,
  ) {}

  async execute(fileEntity: FileEntity): Promise<executeOutput> {
    const timestamp = +new Date();
    const storageFilename = `${timestamp}-${fileEntity.filename}`;
    await this.fileStorage.upload({
      file: fileEntity.file,
      filename: storageFilename,
    });
    const jobId = await this.fileQueue.add(storageFilename);
    return { storageFilename, jobId };
  }
}
