import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';

@Entity('categories')
export class CategoryOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description: string | null = null;

  @OneToMany(() => ProductOrmEntity, (product) => product.category)
  products!: ProductOrmEntity[];

  @CreateDateColumn()
  created_at!: Date;
}
