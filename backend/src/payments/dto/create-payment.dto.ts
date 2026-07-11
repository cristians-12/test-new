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
} from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  product_id!: number;

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
  @MaxLength(255)
  card_holder!: string;
}
