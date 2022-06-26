import RedisFileQueue from "./../../../src/infra/queues/RedisFileQueue";

var mockBull: jest.Mock;
var mockAdd: jest.Mock;
var mockIsReady: jest.Mock;
var mockGetJob: jest.Mock;
var mockProcess: jest.Mock;

const mockFilename = "test_filename";

var mockJob: {
  id: string;
  data: {
    filename: string;
  };
  getState: jest.Mock;
};
const mockProcessor = { execute: jest.fn() };

jest.mock("bull", () => {
  mockIsReady = jest.fn();
  mockJob = {
    id: "test_jobId",
    data: {
      filename: "test_filename",
    },
    getState: jest.fn().mockReturnValue("waiting"),
  };
  mockAdd = jest.fn().mockReturnValue(mockJob);
  mockGetJob = jest.fn().mockReturnValue(mockJob);
  mockProcess = jest.fn();
  mockBull = jest.fn().mockReturnValue({
    isReady: mockIsReady,
    add: mockAdd,
    getJob: mockGetJob,
    process: mockProcess,
  });

  return mockBull;
});

describe("RedisFileQueue", () => {
  const mockQueueName = "test_QueueName";
  const mockRedisHost = "test_RedisHost";
  const mockRedisPort = 6000;
  const redisFileQueue = RedisFileQueue.getInstance();

  it("should create redis queue", async () => {
    await redisFileQueue.initialize(
      mockQueueName,
      mockRedisHost,
      mockRedisPort,
    );
    expect(mockIsReady).toBeCalled();
  });

  it("should add filename to the queue", async () => {
    const jobId = await redisFileQueue.add(mockFilename);
    expect(mockAdd).toBeCalledWith({ filename: mockFilename });
    expect(jobId).toBe("test_jobId");
  });

  it("should return job status", async () => {
    const status = await redisFileQueue.getJobStatus(mockFilename);
    expect(mockGetJob).toBeCalled();
    expect(status).toBe("waiting");
  });

  it("should return notFound", async () => {
    mockGetJob.mockReturnValue(undefined);
    const mockFilename = "test_notfound";
    const status = await redisFileQueue.getJobStatus(mockFilename);
    expect(mockGetJob).toBeCalled();
    expect(status).toBe("notFound");
  });

  it("should setup worker process", async () => {
    redisFileQueue.setupWorker(mockProcessor);
    const mockProcessCallback = mockProcess.mock.calls[0][0];
    await mockProcessCallback(mockJob, jest.fn());
    expect(mockProcessor.execute).toBeCalledWith(mockFilename);
  });

  it("should throw error on process", async () => {
    redisFileQueue.setupWorker(mockProcessor);
    const mockProcessCallback = mockProcess.mock.calls[0][0];
    const mockDone = jest.fn()
    mockProcessor.execute = jest.fn().mockRejectedValue("test_error")
    await mockProcessCallback(mockJob, mockDone);
    expect(mockDone).toBeCalledWith("test_error");
  });
});
