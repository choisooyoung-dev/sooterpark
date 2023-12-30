import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateScheduleDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  date?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  start_at?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  end_at?: string;
}
