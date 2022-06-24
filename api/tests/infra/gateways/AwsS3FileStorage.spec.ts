import AwsS3FileStorage from "../../../src/infra/gateways/AwsS3FileStorage";

const mockS3ListBucketsPromise = jest
  .fn()
  .mockReturnValue({ Buckets: [{ Name: "test_BucketName" }] });
var mockS3Upload: jest.Mock;
const mockS3CreateBucketPromise = jest.fn();

jest.mock("aws-sdk", () => {
  mockS3Upload = jest.fn().mockReturnValue({
    promise: jest.fn(),
  });
  return {
    S3: jest.fn().mockReturnValue({
      listBuckets: () => ({
        promise: mockS3ListBucketsPromise,
      }),
      createBucket: () => ({
        promise: mockS3CreateBucketPromise,
      }),
      upload: mockS3Upload,
    }),
  };
});

describe("AwsS3FileStorage", () => {
  const mockAwsBucketEndpoint = "test_AwsBucketEndpoint";
  const mockAwsAccessKeyId = "test_AwsAccessKeyId";
  const mockAwsSecretAccessKey = "test_AwsSecretAccessKey";
  const mockBucketName = "test_BucketName";
  const awsS3FileStorage = AwsS3FileStorage.getInstance();

  it("should not call create bucket", async () => {
    await awsS3FileStorage.initialize(
      mockAwsBucketEndpoint,
      mockAwsAccessKeyId,
      mockAwsSecretAccessKey,
      mockBucketName,
    );

    expect(mockS3CreateBucketPromise).toBeCalledTimes(0);
  });

  it("should call s3 upload with correct inputs", async () => {
    const mockInput = {
      file: Buffer.from("test_buffer"),
      filename: "test_filename",
    };

    await awsS3FileStorage.upload(mockInput);

    expect(mockS3Upload).toBeCalledWith({
      Bucket: mockBucketName,
      Key: mockInput.filename,
      Body: mockInput.file,
    });
  });
});
