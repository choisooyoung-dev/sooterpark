import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { User } from 'src/user/entities/user.entity';
import { Point } from 'src/point/entities/point.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Performance,
      Schedule,
      Seat,
      User,
      Point,
      Schedule,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
