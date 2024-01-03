import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../types/userRole.type';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'email', example: 'example01@gmail.com' })
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @ApiProperty({ description: 'password', example: 'example01' })
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  @ApiProperty({ description: 'name', example: 'exam01' })
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;

  @ApiProperty({
    description: 'Enum type, Role.User, Role.Admin',
    example: 0,
  })
  @IsEnum(Role)
  role: Role;
}
