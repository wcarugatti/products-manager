import RedisFileQueue from "./../../../src/infra/queues/RedisFileQueue";

var mockBull: jest.Mock;
var mockAdd: jest.Mock;
var mockIsReady: jest.Mock;
var mockGetJobs: jest.Mock;

jest.mock("bull", () => {
  mockIsReady = jest.fn();
  mockAdd = jest.fn();
  mockGetJobs = jest
    .fn()
    .mockReturnValue([
      { name: "test_filename", getState: jest.fn().mockReturnValue("waiting") },
    ]);
  mockBull = jest.fn().mockReturnValue({
    isReady: mockIsReady,
    add: mockAdd,
    getJobs: mockGetJobs,
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
    await redisFileQueue.add(mockFilename);

    expect(mockAdd).toBeCalledWith(mockFilename);
  });

  it("should return job status", async () => {
    const mockFilename = "test_filename";
    const status = await redisFileQueue.getJobStatus(mockFilename);
    expect(mockGetJobs).toBeCalled();
    expect(status).toBe("waiting");
  });
  
  it("should return notFound", async () => {
    const mockFilename = "test_notfound";
    const status = await redisFileQueue.getJobStatus(mockFilename);
    expect(mockGetJobs).toBeCalled();
    expect(status).toBe("notFound");
  });
});
