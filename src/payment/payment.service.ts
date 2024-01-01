import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from 'src/seat/entities/seat.entity';
import { DataSource, Repository } from 'typeorm';
import { Performance } from 'src/performance/entities/performance.entity';
import { CreateSeatDto } from './../seat/dto/create-seat.dto';
import { Payment } from './entities/payment.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Point } from 'src/point/entities/point.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    private dataSource: DataSource,
  ) {}
  async create(
    user: any,
    schedule_id: any,
    performance_id: any,
    createPaymentDto: CreatePaymentDto,
    createSeatDto: CreateSeatDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    // 동시성 처리
    await queryRunner.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    await queryRunner.startTransaction();
    try {
      const { seats } = createSeatDto;

      // 유저가 선택한 공연
      const targetPerformance = await this.performanceRepository.findOne({
        where: { id: +performance_id },
      });

      // 유저가 선택한 공연 스케줄
      const targetSchedule = await this.scheduleRepository.find({
        where: { performance: { id: +performance_id } },
      });

      const getSheduleWithId = await this.scheduleRepository.find({
        where: { id: schedule_id },
      });

      // 스케쥴 아이디에 따른 좌석들, 좌석 카운트용
      const getSeatCountWithScheduleId = await this.seatRepository.find({
        where: { schedule: { id: +schedule_id } },
      });

      if (!targetPerformance) {
        // targetPerformance가 null인 경우 예외 처리
        throw new Error('해당하는 공연이 없습니다.');
      }

      // 결제 생성
      const newPayment = await queryRunner.manager.save(Payment, {
        performance: { id: +performance_id },
        user_id: user.id,
      });

      // 등급별 좌석 금액
      let totalSeatPrice = 0;
      for (let i = 0; i < seats.length; i++) {
        const newGrade = seats[i].grade;
        const newSeatNum = seats[i].seat_num;

        let seatPriceWithGrade: number = 0;
        if (
          newGrade === 'V' &&
          getSeatCountWithScheduleId.length < getSheduleWithId[0].vip_seat_limit
        ) {
          seatPriceWithGrade = targetPerformance.price * 1.75;
        } else if (
          newGrade === 'R' &&
          getSeatCountWithScheduleId.length <
            getSheduleWithId[0].royal_seat_limit
        ) {
          seatPriceWithGrade = targetPerformance.price * 1.25;
        } else if (
          newGrade === 'S' &&
          getSeatCountWithScheduleId.length <
            getSheduleWithId[0].standard_seat_limit
        ) {
          seatPriceWithGrade = targetPerformance.price;
        }

        // 좌석이 예매됐는지 확인
        // 됐으면 payment도 x
        const reservedSeat = await queryRunner.manager.findOne(Seat, {
          where: { grade: newGrade, seat_num: newSeatNum },
        });

        if (reservedSeat !== null) {
          throw new Error();
          // return { success: false, message: '이미 예약된 좌석입니다.' };
        }

        // 좌석 예매
        const newSeat = await queryRunner.manager.save(Seat, {
          payment: { id: newPayment.id },
          schedule: schedule_id,
          grade: newGrade,
          seat_num: newSeatNum,
          performance: { id: targetPerformance.id },
          seat_price: seatPriceWithGrade, // seat_price 값을 targetPerformance.price로 설정
          user: { id: user.id },
        });
        totalSeatPrice += seatPriceWithGrade;
        console.log(newSeat);
      }

      // 포인트 차감
      // 가장 최신의 포인트 상태 가져오기
      const lastPoint = await queryRunner.manager.find(Point, {
        where: { user: { id: user.id } },
        order: { id: 'DESC' },
        take: 1,
      });

      // 차감
      await queryRunner.manager.save(Point, {
        user: { id: user.id },
        payment: { id: newPayment.id },
        deposit: 0,
        withdraw: totalSeatPrice,
        balance: lastPoint[0].balance - totalSeatPrice,
      });

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();
      return { success: true, message: '결제 성공' };
    } catch (error) {
      // 롤백 시에 실행할 코드 (예: 로깅)
      console.error('Error during reservation:', error);
      await queryRunner.rollbackTransaction();
    } finally {
      // 사용이 끝난 후에는 항상 queryRunner를 해제
      await queryRunner.release();
    }
  }

  // 예매 목록 확인
  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  // 예매 취소
  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
