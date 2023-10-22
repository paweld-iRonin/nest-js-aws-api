import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { EntityManager, Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, PaginationOptionsInterface } from './../paginate';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const company = new Company({
      ...createCompanyDto,
    });
    await this.entityManager.save(company);
  }

  async findAll(
    options: PaginationOptionsInterface,
  ): Promise<Pagination<Company>> {
    const [results, total] = await this.companiesRepository.findAndCount({
      take: options.limit,
      skip: options.page * options.limit,
    });

    return new Pagination<Company>({
      results,
      total,
    });
  }

  async findOne(id: number) {
    return this.companiesRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companiesRepository.findOneBy({ id });
    company.name = updateCompanyDto.name;
    company.location = updateCompanyDto.location;

    await this.entityManager.save(company);
  }

  async remove(id: number) {
    await this.companiesRepository.delete(id);
  }
}
