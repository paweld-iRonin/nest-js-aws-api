import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  constructor(company: Partial<Company>) {
    Object.assign(this, company);
  }
}
