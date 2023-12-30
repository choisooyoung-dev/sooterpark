import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Grade } from '../types/seatGrade.type';

export class CreateSeatDto {
  @IsNumber()
  @IsNotEmpty({ message: '좌석을 선택해주세요.' })
  seat_num: number;

  @IsEnum(Grade)
  @IsNotEmpty({ message: '등급을 선택해주세요.' })
  grade: Grade;
}
