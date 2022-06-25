import { FileEntity } from "./FileEntity";

export interface FileStorage {
  upload(input: FileEntity): Promise<void>;
}
