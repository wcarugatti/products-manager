import RedisFileQueue from "./../../../src/infra/queues/RedisFileQueue";

var mockBull: jest.Mock;
var mockAdd: jest.Mock;
var mockIsReady: jest.Mock;
var mockGetJob: jest.Mock;
var mockJob: { id: string; name: string; getState: jest.Mock };

jest.mock("bull", () => {
  mockIsReady = jest.fn();
  mockJob = {
    id: "test_jobId",
    name: "test_filename",
    getState: jest.fn().mockReturnValue("waiting"),
  };
  mockAdd = jest.fn().mockReturnValue(mockJob);
  mockGetJob = jest.fn().mockReturnValue(mockJob);
  mockBull = jest.fn().mockReturnValue({
    isReady: mockIsReady,
    add: mockAdd,
    getJob: mockGetJob,
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
    const mockFilename = "test_filename";
    const jobId = await redisFileQueue.add(mockFilename);
    expect(mockAdd).toBeCalledWith({ filename: mockFilename });
    expect(jobId).toBe("test_jobId");
  });

  it("should return job status", async () => {
    const mockFilename = "test_filename";
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
});
