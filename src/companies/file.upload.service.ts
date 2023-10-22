import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from 'uuid';
import { AssetsService } from './assets.service';

@Injectable()
export class FileUploadService {
    constructor(private readonly configService: ConfigService, private readonly assetsService: AssetsService) {}

    async uploadFile(dataBuffer: Buffer, fileName: string) {
      const s3 = new S3Client({
        region: this.configService.getOrThrow('AWS_REGION'),
        credentials: {
          accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.getOrThrow('AWS_SECRET_KEY_ID'),
        },
      });

      const fileS3Name = `${uuid()}-${fileName}`;

      const command = new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_BUCKET'),
        Key: fileS3Name,
        Body: dataBuffer,
      });

      const result = await s3.send(command);
      return this.assetsService.create({ filename: fileName, uid: fileS3Name });
    }
}
