import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { FileUploadService } from './file.upload.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Pagination } from './../paginate';
import { Company } from './entities/company.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssetsService } from './assets.service';
import { EmailService } from './email.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService,
    private readonly fileUploadService: FileUploadService,
    private readonly assetsService: AssetsService,
    private readonly emailService: EmailService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  findAll(@Request() request): Promise<Pagination<Company>> {
    return this.companiesService.findAll({
      limit: request.query.hasOwnProperty('limit') ? request.query.limit : 10,
      page: request.query.hasOwnProperty('page') ? request.query.page : 0,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }

  @Post('upload_asset')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileUploadService.uploadFile(file.buffer, file.originalname);
  }

  @Get('assets/:id')
  findOneAsset(@Param('id') id: string) {
    return this.assetsService.findOne(+id);
  }

  @Get('send_email/:email')
  sendEmail(@Param('email') email: string) {
    return this.emailService.send(email);
  }
}
