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
    const storageName = `${timestamp}-${fileEntity.filename}`;
    await this.fileStorage.upload({
      file: fileEntity.file,
      filename: storageName,
    });
    await this.taskManager.add(storageName);
    return storageName;
  }
}
