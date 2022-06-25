export interface FileQueue {
  add(filename: string): Promise<string>;
}
