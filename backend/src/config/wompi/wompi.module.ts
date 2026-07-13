import { Module } from '@nestjs/common';
import { WompiApiGateway } from '../../adapters/outbound/external/wompi/wompi.gateway';

@Module({
  providers: [
    {
      provide: 'IWompiGateway',
      useClass: WompiApiGateway,
    },
  ],
  exports: ['IWompiGateway'],
})
export class WompiModule {}
