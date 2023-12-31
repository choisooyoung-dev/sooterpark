import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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

  // @IsOptional()
  // @IsNotEmpty()
  // @IsNumber()
  // vip_seat_limit?: number;

  // @IsOptional()
  // @IsNotEmpty()
  // @IsNumber()
  // royal_seat_limit?: number;

  // @IsOptional()
  // @IsNotEmpty()
  // @IsNumber()
  // standard_seat_limit?: number;
}
