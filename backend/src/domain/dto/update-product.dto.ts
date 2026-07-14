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

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  image_url?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsInt()
  category_id?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
