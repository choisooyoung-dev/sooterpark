import { IsNotEmpty, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty({ message: '공연 기간을 입력해주세요.' })
  @IsString()
  date: string;

  @IsNotEmpty({ message: '공연 시작 시간을 입력해주세요.' })
  @IsString()
  start_at: string;

  @IsNotEmpty({ message: '공연 종료 시간을 입력해주세요.' })
  @IsString()
  end_at: string;
}
