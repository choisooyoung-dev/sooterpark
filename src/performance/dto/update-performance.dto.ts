import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from '../types/performanceCategory.type';

export class UpdatePerformanceDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Category)
  category?: Category;
}
