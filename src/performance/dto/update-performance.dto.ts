import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from '../types/performanceCategory.type';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePerformanceDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  content?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  location?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  image?: string;

  @ApiProperty({ example: 0 })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Category)
  category?: Category;
}
