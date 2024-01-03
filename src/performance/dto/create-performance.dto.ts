import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from '../types/performanceCategory.type';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePerformanceDto {
  @ApiProperty({ example: '뮤지컬 - 맘마미아' })
  @IsString()
  @IsNotEmpty({ message: '공연 제목을 입력해주세요.' })
  title: string;

  @ApiProperty({ example: '맘마미아' })
  @IsString()
  @IsNotEmpty({ message: '공연 내용을 입력해주세요.' })
  content: string;

  @ApiProperty({ example: '인천예술회관' })
  @IsString()
  @IsNotEmpty({ message: '공연 위치를 입력해주세요.' })
  location: string;

  @ApiProperty({ example: 'IMAGE URL/URL' })
  @IsString()
  @IsNotEmpty({ message: '공연 포스터 이미지를 첨부해주세요.' })
  image: string;

  @ApiProperty({ example: 0 })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @IsNotEmpty({ message: '기본 가격(STANDARD석 가격)을 입력해주세요.' })
  price: number;

  // @IsNumber()
  // @IsNotEmpty({ message: 'VIP석 좌석수를 입력해주세요.' })
  // vip_seat_limit: number;

  // @IsNumber()
  // @IsNotEmpty({ message: 'STANDARD석 좌석수를 입력해주세요.' })
  // standard_seat_limit: number;

  // @IsNumber()
  // @IsNotEmpty({ message: 'ROYAL석 좌석수를 입력해주세요.' })
  // royal_seat_limit: number;
}
