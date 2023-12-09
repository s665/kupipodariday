import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate } from 'class-validator';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @CreateDateColumn()
  @IsDate()
  updatedAt: Date;
}
