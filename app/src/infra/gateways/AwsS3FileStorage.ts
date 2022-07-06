import { FileEntity } from "../../interfaces/entities/FileEntity";
import { FileStorage } from "../../interfaces/infra/FileStorage";
import { S3 } from "aws-sdk";
import { ReadStream } from "s3-streams";
import { Readable } from "stream";

export default class AwsS3FileStorage implements FileStorage {
  private static instance?: AwsS3FileStorage;
  private s3Instance: S3;
  private bucketName: string;

  private constructor() {}

  static getInstance(): AwsS3FileStorage {
    if (AwsS3FileStorage.instance === undefined)
      AwsS3FileStorage.instance = new AwsS3FileStorage();
    return AwsS3FileStorage.instance;
  }

  async initialize(
    awsBucketEndpoint: string,
    awsAccessKeyId: string,
    awsSecretAccessKey: string,
    bucketName: string,
  ) {
    this.bucketName = bucketName;

    this.s3Instance = new S3({
      endpoint: awsBucketEndpoint,
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
      s3ForcePathStyle: true,
    });

    await this.findOrCreateBucket();
  }

  async findOrCreateBucket() {
    const buckets = await this.s3Instance.listBuckets().promise();
    const hasBucket = buckets.Buckets.find(
      (bucket) => bucket.Name === this.bucketName,
    );
    if (!hasBucket) {
      await this.s3Instance
        .createBucket({
          Bucket: this.bucketName,
        })
        .promise();
    }
  }

  async upload(input: FileEntity): Promise<void> {
    await this.s3Instance
      .upload({
        Bucket: this.bucketName,
        Key: input.filename,
        Body: input.file,
      })
      .promise();
  }

  async getFileReadable(filename: string): Promise<Readable> {
    const s3Stream = new ReadStream(this.s3Instance, {
      Bucket: this.bucketName,
      Key: filename,
    });

    return s3Stream;
  }

  async deleteFile(filename: string): Promise<void> {
    await this.s3Instance
      .deleteObject({
        Bucket: this.bucketName,
        Key: filename,
      })
      .promise();
  }
}
