import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from '../types/performanceCategory.type';

export class CreatePerformanceDto {
  @IsString()
  @IsNotEmpty({ message: '공연 제목을 입력해주세요.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '공연 내용을 입력해주세요.' })
  content: string;

  @IsString()
  @IsNotEmpty({ message: '공연 위치를 입력해주세요.' })
  location: string;

  @IsString()
  @IsNotEmpty({ message: '공연 포스터 이미지를 첨부해주세요.' })
  image: string;

  @IsEnum(Category)
  category: Category;

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
