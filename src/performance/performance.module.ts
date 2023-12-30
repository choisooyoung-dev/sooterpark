import { Module } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Performance } from './entities/performance.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { Seat } from 'src/seat/entities/seat.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Performance, Schedule, Seat, User]),
    ScheduleModule,
  ],
  controllers: [PerformanceController],
  providers: [PerformanceService],
})
export class PerformanceModule {}
