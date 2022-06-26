import { FileEntity } from "../entities/FileEntity";

export interface FileStorage {
  upload(input: FileEntity): Promise<void>;
  getFile(filename: string): Promise<Buffer>;
  deleteFile(filename: string): Promise<void>;
}
