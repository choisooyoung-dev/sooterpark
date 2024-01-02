import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateScheduleDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  start_at?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  end_at?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  vip_seat_limit?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  royal_seat_limit?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  standard_seat_limit?: number;
}
