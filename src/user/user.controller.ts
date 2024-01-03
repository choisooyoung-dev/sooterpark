import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from './entities/user.entity';
import { Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('USER API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.userService.register(
      registerDto.email,
      registerDto.name,
      registerDto.password,
      registerDto.role,
    );
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto);
  }

  @ApiOperation({ summary: '사용자 인증 체크' })
  @Get('/check')
  checkUser(@Req() req: any) {
    const userPayload = req.user;
    return this.userService.checkUser(userPayload);
  }

  @ApiOperation({ summary: '현재 로그인 유저 이메일' })
  @UseGuards(AuthGuard('jwt'))
  @Get('email')
  getEmail(@UserInfo() user: User) {
    return { email: user.email };
  }

  @ApiOperation({ summary: '유저 이름, 포인트 조회' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.userService.getUser(+id);
  }

  @ApiOperation({ summary: '네이버 로그인' })
  @UseGuards(AuthGuard('naver'))
  @Get('/naver/login')
  async loginNaver(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      return await this.userService.OAuthLogin({ req, res });
    } catch (error) {
      console.error('Error in loginNaver:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
