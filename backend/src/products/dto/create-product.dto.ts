import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsPositive,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsString()
  category!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
