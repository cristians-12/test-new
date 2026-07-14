import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductOrmEntity } from '../../adapters/outbound/persistence/typeorm/product.orm-entity';
import { CategoryOrmEntity } from '../../adapters/outbound/persistence/typeorm/category.orm-entity';
import { PaymentOrmEntity } from '../../adapters/outbound/persistence/typeorm/payment.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER', 'root'),
        password: config.get('DB_PASSWORD', 'root_secret'),
        database: config.get('DB_NAME', 'test_db'),
        entities: [ProductOrmEntity, CategoryOrmEntity, PaymentOrmEntity],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
