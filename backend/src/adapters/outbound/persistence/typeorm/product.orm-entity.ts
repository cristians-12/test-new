import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CategoryOrmEntity } from './category.orm-entity';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  image_url: string | null = null;

  @Column({ type: 'text', nullable: true })
  description: string | null = null;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price!: number;

  @Column()
  category_id!: number;

  @ManyToOne(() => CategoryOrmEntity, (category) => category.products, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category!: CategoryOrmEntity;

  @Column({ type: 'int', default: 0 })
  stock: number = 0;

  @Column({ type: 'boolean', default: true })
  is_active: boolean = true;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
