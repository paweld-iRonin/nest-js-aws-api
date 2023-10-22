import { Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { EntityManager, Repository } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetsRepository: Repository<Asset>,
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  async create(createAssetDto: CreateAssetDto) {
    const asset = new Asset({
      ...createAssetDto,
    });
    await this.entityManager.save(asset);
  }

  async findOne(id: number) {
    const asset = await this.assetsRepository.findOne({
      where: { id },
    });

    const s3 = new S3Client({
      region: this.configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_KEY_ID'),
      },
    });

    const bucketName = this.configService.getOrThrow('AWS_BUCKET');
    const objectKey = asset.uid;
    const expirationInSeconds = 3600;

    // Generate the pre-signed URL
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: expirationInSeconds });

    return { url, filename: asset.filename };
  }
}
