import {
  IsString,
  IsNumber,
  IsObject,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WebhookTransactionData {
  @IsNumber()
  id!: number;

  @IsString()
  reference!: string;

  @IsString()
  status!: string;
}

export class WebhookEvent {
  @IsString()
  timestamp!: string;

  @IsString()
  event!: string;

  @IsObject()
  data!: { transaction: WebhookTransactionData };
}

export class WebhookDto {
  @IsString()
  signature!: {
    checksum: string;
    properties: string;
    timestamp: string;
  };

  @IsArray()
  events!: WebhookEvent[];
}
