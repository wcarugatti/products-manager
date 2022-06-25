import AwsS3FileStorage from "../../../infra/gateways/AwsS3FileStorage";

export async function createAwsS3FileStorage(): Promise<void> {
  const awsS3FileStorage = AwsS3FileStorage.getInstance();
  await awsS3FileStorage.initialize(
    process.env.AWS_S3_ENDPOINT,
    process.env.AWS_ACCESS_KEY_ID,
    process.env.AWS_SECRET_ACCESS_KEY,
    process.env.AWS_BUCKET_NAME,
  );
}
