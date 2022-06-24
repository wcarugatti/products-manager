import { FileStorage } from "../interfaces/FileStorage";
import { FileQueue } from "../interfaces/FileQueue";
import { FileEntity } from "./../interfaces/FileEntity";

export default class AddFileToQueue {
  constructor(
    private readonly fileStorage: FileStorage,
    private readonly taskManager: FileQueue,
  ) {}

  async execute(fileEntity: FileEntity): Promise<string> {
    const timestamp = +new Date();
    const storageFilename = `${timestamp}-${fileEntity.filename}`;
    await this.fileStorage.upload({
      file: fileEntity.file,
      filename: storageFilename,
    });
    await this.taskManager.add(storageFilename);
    return storageFilename;
  }
}
