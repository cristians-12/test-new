import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import type { IPaymentUseCase } from '../../../domain/port/input/payment.port';
import { CreatePaymentDto } from '../../../domain/dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    @Inject('IPaymentUseCase')
    private readonly paymentsService: IPaymentUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Post('refresh')
  refreshPendingPayments() {
    return this.paymentsService.refreshPendingPayments();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleWebhook(
    @Body() body: { signature: string; events: any[] },
  ) {
    return this.paymentsService.handleWebhook(body.signature, body.events);
  }
}
