import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsPositive,
  IsInt,
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

  @IsInt()
  category_id!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
