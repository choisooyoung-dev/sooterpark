import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePerformanceDto {
  @IsString()
  @IsNotEmpty({ message: '공연 제목을 입력해주세요.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '공연 내용을 입력해주세요.' })
  content: string;

  @IsString()
  @IsNotEmpty({ message: '공연 시작 일시를 입력해주세요.' })
  start_at: string;

  @IsString()
  @IsNotEmpty({ message: '공연 종료 일시를 입력해주세요.' })
  end_at: string;

  @IsString()
  @IsNotEmpty({ message: '공연장 위치를 입력해주세요.' })
  location: string;
}
