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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.userService.register(
      registerDto.email,
      registerDto.name,
      registerDto.password,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto);
  }

  @Get('/check')
  checkUser(@Req() req: any) {
    const userPayload = req.user;
    return this.userService.checkUser(userPayload);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('email')
  getEmail(@UserInfo() user: User) {
    return { email: user.email };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.userService.getUser(+id);
  }

  @UseGuards(AuthGuard('naver'))
  @Get('/naver/login')
  async loginNaver(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      return await this.userService.OAuthLogin({ req, res });
    } catch (error) {
      console.error('Error in loginNaver:', error);
      // 클라이언트에게 적절한 에러 응답을 보내거나 로깅 등 추가 조치를 취하세요.
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
