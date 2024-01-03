import { IsArray, IsNotEmpty } from 'class-validator';
import { Grade } from '../types/seatGrade.type';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSeatDto {
  @ApiProperty({
    example: [
      {
        grade: 'V',
        seat_num: 1,
      },
    ],
  })
  @IsNotEmpty({ message: '좌석 정보를 입력해주세요.' })
  @IsArray()
  seats: { grade: Grade; seat_num: number }[];
}
