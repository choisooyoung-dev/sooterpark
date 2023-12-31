import { IsArray, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Grade } from '../types/seatGrade.type';

export class CreateSeatDto {
  // @IsNotEmpty({ message: '좌석 금ㅇ를 입력해주세요.' })
  // @IsNumber()
  // seat_price: number;

  @IsNotEmpty({ message: '좌석 정보를 입력해주세요.' })
  @IsArray()
  seats: { grade: Grade; seat_num: number }[];

  // @IsNumber()
  // seat_num: number;

  // @IsEnum(Grade)
  // grade: Grade;
}
