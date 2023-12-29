import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateSeatDto {
  @IsDate()
  @IsNotEmpty({ message: '공연 날짜를 입력해주세요.' })
  date: Date;
}
