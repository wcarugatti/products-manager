import { Readable } from "stream";
import { FileEntity } from "../entities/FileEntity";

export interface FileStorage {
  upload(input: FileEntity): Promise<void>;
  getFileReadable(filename: string): Promise<Readable>;
  deleteFile(filename: string): Promise<void>;
}
