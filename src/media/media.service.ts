import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MediaService {
  private readonly s3: AWS.S3;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow<string>(
        'S3_SECRET_ACCESS_KEY',
      ),
      region: this.configService.get<string>('S3_REGION', 'ap-south-1'),
    });
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('no file is provided');
    }
    const { buffer, mimetype, originalname } = file;

    const fileKey = `uploads/${uuid()}-${originalname}`;

    return this.s3Upload(buffer, fileKey, mimetype);
  }

  private async s3Upload(
    file: Buffer,
    key: string,
    mimetype: string,
  ): Promise<{ file: AWS.S3.ManagedUpload.SendData; type: string }> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    return { file: await this.s3.upload(params).promise(), type: mimetype };
  }
}
