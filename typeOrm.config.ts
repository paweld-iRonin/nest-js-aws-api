import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Company } from './src/companies/entities/company.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('DATABASE_HOST'),
  port: configService.getOrThrow('DATABASE_PORT'),
  database: configService.getOrThrow('DATABASE_NAME'),
  username: configService.getOrThrow('DATABASE_USER'),
  password: configService.getOrThrow('DATABASE_PASSWORD'),
  migrations: ['migrations/**'],
  entities: [Company],
});
