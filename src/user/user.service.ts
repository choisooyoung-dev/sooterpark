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
import { LoginDto } from './dto/login.dto';
import { Role } from './types/userRole.type';
import { Point } from 'src/point/entities/point.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Point) private pointRepository: Repository<Point>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입
  async register(email: string, name: string, password: string, role: Role) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('해당 이메일로 가입된 사용자가 있습니다.');
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await this.userRepository.save({
      email,
      name,
      password: hashedPassword,
      role,
    });

    await this.pointRepository.save({
      user: newUser, // User 엔터티와 관계 설정
      deposit: 0,
      withdraw: 0,
      balance: 1000000,
    });

    const payload = { email: newUser.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      success: 'true',
      message: '회원가입 성공',
      accessToken,
    };
  }

  // 로그인
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      select: ['email', 'password'],
      where: { email, deleted_at: null },
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.id };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: '로그인 성공',
      success: true,
      accessToken,
      user,
    };
  }

  // 인증 인가 체크
  checkUser(userPayload: any) {
    return `유저 정보: ${JSON.stringify(userPayload)}}`;
  }

  // 유저 이름과 포인트 조회
  async getUser(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.points', 'points')
      .select(['user.name', 'points.total'])
      .where({ id })
      .getOne();

    return {
      success: true,
      user,
    };
  }

  // 네이버 로그인
  async OAuthLogin({ req, res }) {
    let OAuthUser = await this.userRepository.findOne({
      where: { email: req.user.email },
    });

    const hashedNaverPassword = await hash(req.user.id, 10);

    if (!OAuthUser) {
      OAuthUser = await this.userRepository.save({
        email: req.user.email,
        name: req.user.name,
        password: hashedNaverPassword,
      });
      await this.pointRepository.save({
        user: OAuthUser, // User 엔터티와 관계 설정
        deposit: 0,
        withdraw: 0,
        balance: 1000000,
      });
    }
    const email = req.user.email;

    const payload = { email, sub: req.user.id };

    console.log('access_token:', this.jwtService.sign(payload));

    res.redirect('/');

    return {
      message: '로그인 성공',
      success: true,
      access_token: this.jwtService.sign(payload),
      OAuthUser,
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
