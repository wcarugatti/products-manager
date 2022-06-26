export interface WorkerProcessor {
  execute(filename: string): Promise<void>;
}
