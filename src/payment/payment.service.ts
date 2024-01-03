import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from 'src/seat/entities/seat.entity';
import { DataSource, Repository } from 'typeorm';
import { Performance } from 'src/performance/entities/performance.entity';
import { CreateSeatDto } from './../seat/dto/create-seat.dto';
import { Payment } from './entities/payment.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Point } from 'src/point/entities/point.entity';
import { paymentStatus } from './types/paymentStatus.types';

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
    // 동시성 처리 - 격리 수준 READ COMMITTED
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      const { seats } = createSeatDto;

      // 유저가 선택한 공연
      const targetPerformance = await this.performanceRepository.findOne({
        where: { id: +performance_id },
      });

      const getSheduleWithId = await this.scheduleRepository.find({
        where: { id: schedule_id },
      });

      console.log('getSheduleWithId: ', getSheduleWithId);

      // 스케쥴 아이디에 따른 좌석들, 좌석 카운트용
      const getSeatCountWithScheduleId = await this.seatRepository.find({
        where: { schedule: { id: +schedule_id } },
      });

      console.log('getSheduleWithId: ', getSheduleWithId);

      if (!targetPerformance) {
        // targetPerformance가 null인 경우 예외 처리
        throw new Error('해당하는 공연이 없습니다.');
      }

      // 스케줄 시간
      const scheduleStartAt = getSheduleWithId[0].start_at;
      // 현재 시간
      const nowDate = new Date();

      const timeDifference = scheduleStartAt - nowDate;
      console.log('timeDifference: ', timeDifference);
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      console.log('hoursDifference: ', hoursDifference);

      if (hoursDifference <= 0) {
        throw new Error('공연 시작 시간 이후로는 예매 불가');
      }

      // 결제 생성
      const newPayment = await queryRunner.manager.save(Payment, {
        performance: { id: +performance_id },
        user_id: user.id,
        status: paymentStatus.SUCCESS,
      });

      // 등급별 좌석 금액
      let totalSeatPrice = 0;
      for (let i = 0; i < seats.length; i++) {
        const newGrade = seats[i].grade;
        const newSeatNum = seats[i].seat_num;

        let seatPriceWithGrade: number = 0;

        if (
          newSeatNum > getSheduleWithId[0].vip_seat_limit ||
          newSeatNum > getSheduleWithId[0].royal_seat_limit ||
          newSeatNum > getSheduleWithId[0].standard_seat_limit
        )
          throw new Error('예약할 수 없는 좌석 번호 입니다.');

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
          throw new Error('이미 예약된 좌석');
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
        order: { created_at: 'DESC' },
        take: 1,
      });

      // 잔액 없을때 차감 불가
      if (lastPoint[0].balance < totalSeatPrice)
        throw new Error('잔액이 부족합니다.');

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
      return { status: 404, message: error.message };
    } finally {
      // 사용이 끝난 후에는 항상 queryRunner를 해제
      await queryRunner.release();
    }
  }

  // 예매 목록 확인
  async findAll(user: any, user_id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    // 동시성 처리 - 격리 수준 READ COMMITTED
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      const allPayment = await queryRunner.manager.find(Payment, {
        where: {
          user: { id: user_id },
        },
        order: { created_at: 'DESC' },
        relations: ['performance'],
      });

      //console.log('allPayment ======> ', allPayment);
      await queryRunner.commitTransaction();
      return { allPayment };
    } catch (error) {
      // 롤백 시에 실행할 코드 (예: 로깅)
      console.error('Error during reservation:', error);
      await queryRunner.rollbackTransaction();
      return { status: 404, message: error.message };
    } finally {
      // 사용이 끝난 후에는 항상 queryRunner를 해제
      await queryRunner.release();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  // 예매 취소
  async remove(user: any, paymentId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    // 동시성 처리 - 격리 수준 READ COMMITTED
    await queryRunner.startTransaction('READ COMMITTED');

    const userId = user.id;

    try {
      // 공연 3시간 전?
      // 스케줄 가져오기
      const targetPayment = await queryRunner.manager.find(Seat, {
        where: { payment: { id: paymentId } },
        relations: ['schedule', 'user'],
      });

      const paymentUser = targetPayment[0].user.id;

      // 유저 확인
      if (paymentUser !== user.id) {
        throw new Error('권한이 없습니다.');
      }

      console.log('targetPayment: ', targetPayment);
      // 스케줄 시간
      const scheduleStartAt = targetPayment[0].schedule.start_at;
      // 현재 시간
      const nowDate = new Date();

      const timeDifference = scheduleStartAt - nowDate;
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      if (hoursDifference <= 3) {
        throw new Error('공연 시간 3시간 전 예매 취소 불가');
      }

      //  좌석 삭제
      await queryRunner.manager.delete(Seat, {
        user: { id: userId },
        payment: { id: paymentId },
      });

      // 결제 내역 상태 변경
      await queryRunner.manager.update(
        Payment,
        { id: paymentId },
        { status: paymentStatus.CANCLE },
      );

      const targetPaymentStatus = await queryRunner.manager.findOne(Payment, {
        where: {
          id: paymentId,
        },
        select: ['status'],
      });
      console.log(targetPaymentStatus);

      if (targetPaymentStatus.status !== 'CANCLE') {
        throw new Error('결제 상태 CANCLE 아님');
      } else {
        const currentPoint = await queryRunner.manager.find(Point, {
          where: { user: { id: user.id } },
          order: { created_at: 'DESC' },
          take: 1,
        });

        // 현재 잔액
        const currentBalance = currentPoint[0].balance;

        const refundedPoint = await queryRunner.manager.findOne(Point, {
          where: { payment: { id: paymentId } },
        });

        // 환불 받을 금액
        const refundedPointValue = refundedPoint.withdraw;

        // 환불
        await queryRunner.manager.save(Point, {
          user: { id: user.id },
          payment: { id: paymentId },
          deposit: refundedPointValue,
          withdraw: 0,
          balance: currentBalance + refundedPointValue,
        });
      }

      await queryRunner.commitTransaction();
      return { success: true, message: '결제 취소 완료' };
    } catch (error) {
      // 롤백 시에 실행할 코드 (예: 로깅)
      console.error('Error during reservation:', error);
      await queryRunner.rollbackTransaction();
      return { status: 404, message: error.message };
    } finally {
      // 사용이 끝난 후에는 항상 queryRunner를 해제
      await queryRunner.release();
    }
  }
}
