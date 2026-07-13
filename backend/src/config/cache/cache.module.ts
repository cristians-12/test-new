import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (config: ConfigService) => ({
        stores: [
          createKeyv(
            `redis://${config.get('REDIS_HOST', 'localhost')}:${config.get<number>('REDIS_PORT', 6379)}`,
          ),
        ],
        ttl: 60000,
      }),
    }),
  ],
})
export class CacheConfigModule {}
