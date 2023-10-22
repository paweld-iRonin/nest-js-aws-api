import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Asset } from './entities/asset.entity';
import { FileUploadService } from './file.upload.service';
import { AssetsService } from './assets.service';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Asset])],
  controllers: [CompaniesController],
  providers: [CompaniesService, FileUploadService, AssetsService, EmailService],
})
export class CompaniesModule {}
