import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateScheduleDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  start_date?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  end_date?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  start_at?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  end_at?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  vip_seat_limit?: number;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  royal_seat_limit?: number;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  standard_seat_limit?: number;
}
