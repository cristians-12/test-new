import {
  IsString,
  IsEmail,
  IsNumber,
  IsPositive,
  IsInt,
  IsOptional,
  MaxLength,
  MinLength,
  Matches,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsInt()
  @IsPositive()
  product_id!: number;

  @IsInt()
  @IsPositive()
  quantity!: number;
}

export class CreatePaymentDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items!: CartItemDto[];

  @IsEmail()
  customer_email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  reference?: string;

  @IsOptional()
  @IsString()
  acceptance_token?: string;

  @IsString()
  @MinLength(13)
  @MaxLength(19)
  card_number!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(4)
  cvv!: string;

  @IsString()
  @Matches(/^(0[1-9]|1[0-2])$/)
  exp_month!: string;

  @IsString()
  @Matches(/^\d{4}$/)
  exp_year!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  card_holder!: string;
}
