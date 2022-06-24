import RedisFileQueue from "./../../../src/infra/queues/RedisFileQueue";

var mockBull: jest.Mock;
var mockAdd: jest.Mock;
var mockIsReady: jest.Mock;

jest.mock("bull", () => {
  mockIsReady = jest.fn();
  mockAdd = jest.fn();
  mockBull = jest.fn().mockReturnValue({
    isReady: mockIsReady,
    add: mockAdd,
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

  it("should add filename to the queue", () => {
    const mockFilename = "test_filename";
    redisFileQueue.add(mockFilename);

    expect(mockAdd).toBeCalledWith(mockFilename);
  });
});
