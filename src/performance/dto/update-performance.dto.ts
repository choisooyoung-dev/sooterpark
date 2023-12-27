import { IsOptional, IsString } from 'class-validator';

export class UpdatePerformanceDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  start_at?: string;

  @IsString()
  @IsOptional()
  end_at?: string;

  @IsString()
  @IsOptional()
  location?: string;
}
