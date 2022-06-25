import { FileStorage } from "../interfaces/FileStorage";
import { FileQueue } from "../interfaces/FileQueue";
import { FileEntity } from "./../interfaces/FileEntity";

export default class AddFileToQueue {
  constructor(
    private readonly fileStorage: FileStorage,
    private readonly fileQueue: FileQueue,
  ) {}

  async execute(fileEntity: FileEntity): Promise<string> {
    const timestamp = +new Date();
    const storageFilename = `${timestamp}-${fileEntity.filename}`;
    await this.fileStorage.upload({
      file: fileEntity.file,
      filename: storageFilename,
    });
    await this.fileQueue.add(storageFilename);
    return storageFilename;
  }
}
