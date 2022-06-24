import { FileStorage } from "../../src/interfaces/FileStorage";
import { FileQueue } from "../../src/interfaces/FileQueue";
import AddFileToQueue from "../../src/useCases/AddFileToQueue";

describe("AddFileToQueue", () => {
  const mockFileStorage: FileStorage = {
    upload: jest.fn(),
  };

  const mockFileQueue: FileQueue = {
    add: jest.fn(),
  };

  it("should add file to the queue", async () => {
    const mockDate = new Date("2022-01-01");
    jest.useFakeTimers().setSystemTime(mockDate);

    const mockFilename = `${+mockDate}-testname`;

    const file = Buffer.from("test_buffer")
    const addFileToQueue = new AddFileToQueue(mockFileStorage, mockFileQueue);
    await addFileToQueue.execute({ file, filename: "testname" });

    expect(mockFileStorage.upload).toBeCalledWith({
      file,
      filename: mockFilename,
    });
    expect(mockFileQueue.add).toBeCalledWith(mockFilename);
  });
});
