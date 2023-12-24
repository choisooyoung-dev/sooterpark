import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, name: string, password: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('해당 이메일로 가입된 사용자가 있습니다.');
    }

    const hashedPassword = await hash(password, 10);
    await this.userRepository.save({
      email,
      name,
      password: hashedPassword,
    });

    return {
      success: 'true',
      message: '회원가입 성공',
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.id };
    return {
      message: '로그인 성공',
      success: true,
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async getUser(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return {
      success: true,
      user,
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
