import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  uid: string;

  constructor(asset: Partial<Asset>) {
    Object.assign(this, asset);
  }
}
