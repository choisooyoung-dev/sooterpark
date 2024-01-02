import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty({ message: '공연 시작일을 입력해주세요.' })
  @IsString()
  start_date: string;

  @IsNotEmpty({ message: '공연 종료일을 입력해주세요.' })
  @IsString()
  end_date: string;

  @IsNotEmpty({ message: '공연 시작 시간을 입력해주세요.' })
  @IsString()
  start_at: string;

  @IsNotEmpty({ message: '공연 종료 시간을 입력해주세요.' })
  @IsString()
  end_at: string;

  @IsNumber()
  @IsNotEmpty({ message: 'VIP석 좌석수를 입력해주세요.' })
  vip_seat_limit: number;

  @IsNumber()
  @IsNotEmpty({ message: 'STANDARD석 좌석수를 입력해주세요.' })
  standard_seat_limit: number;

  @IsNumber()
  @IsNotEmpty({ message: 'ROYAL석 좌석수를 입력해주세요.' })
  royal_seat_limit: number;
}
