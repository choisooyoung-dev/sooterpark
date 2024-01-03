import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
import { Performance } from './entities/performance.entity';
import _ from 'lodash';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { CreateScheduleDto } from 'src/schedule/dto/create-schedule.dto';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Seat } from 'src/seat/entities/seat.entity';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    private dataSource: DataSource,
  ) {}

  async getAll() {
    return this.performanceRepository.find({
      where: { deleted_at: null },
    });
  }

  async getOne(performance_id: number) {
    if (_.isNaN(performance_id)) {
      throw new BadRequestException('공연 ID가 잘못되었습니다.');
    }
    const performance = await this.performanceRepository
      .createQueryBuilder('performance')
      .leftJoinAndSelect('performance.schedule', 'schedule')
      .leftJoinAndSelect('schedule.seats', 'seats')
      .where({ id: performance_id })
      .getOne();

    console.log('performance: ', performance);

    if (!performance) {
      throw new NotFoundException('찾을 수 없는 공연 ID 입니다.');
    }

    return performance;
  }

  // 좌석 정보
  async getSeatInfo(performance_id: number, schedule_id: number) {
    const reservedSeatInfo = await this.seatRepository.find({
      where: { schedule: { id: schedule_id } },
    });

    const defaultPrice = await this.performanceRepository.findOne({
      where: { id: performance_id },
      select: ['price'],
    });

    const vipReservedSeats = reservedSeatInfo.filter(
      (seat) => seat.grade === 'V',
    );
    //  console.log('vipReservedSeats: ', vipReservedSeats);

    const royalReservedSeats = reservedSeatInfo.filter(
      (seat) => seat.grade === 'R',
    );
    // console.log('royalReservedSeats: ', royalReservedSeats);

    const standardReservedSeats = reservedSeatInfo.filter(
      (seat) => seat.grade === 'S',
    );
    // console.log('standardReservedSeats: ', standardReservedSeats);

    const scheduleSeatLimitInfo = await this.scheduleRepository.find({
      where: { id: schedule_id },
    });

    const vipLimit = scheduleSeatLimitInfo[0].vip_seat_limit;
    const royalLimit = scheduleSeatLimitInfo[0].royal_seat_limit;
    const standardLimit = scheduleSeatLimitInfo[0].standard_seat_limit;

    class SeatObject {
      seat_num: number;
      grade: string;
      price: number;

      constructor(seat_num: number, grade: string, price: number) {
        this.seat_num = seat_num;
        this.grade = grade;
        this.price = price;
      }
    }

    // 등급별 예약된 좌석 번호
    const bookedVipSeatNum = [];
    const bookedRoyalSeatNum = [];
    const bookedStandardSeatNum = [];

    vipReservedSeats.map((vipSeatNum) => {
      bookedVipSeatNum.push(vipSeatNum.seat_num);
    });
    royalReservedSeats.map((royalSeatNum) => {
      bookedRoyalSeatNum.push(royalSeatNum.seat_num);
    });
    standardReservedSeats.map((standardSeatNum) => {
      bookedStandardSeatNum.push(standardSeatNum.seat_num);
    });
    // const seatObjectResult = new SeatObject(1, 'V', 30000);
    // -----> seatobject ===>  SeatObject { seat_num: 1, grade: 'V', price: 30000 }

    console.log('기본가', defaultPrice.price);
    console.log('VIP 예약된 좌석 번호: ', bookedVipSeatNum);
    console.log('R 예약된 좌석 번호: ', bookedRoyalSeatNum);
    console.log('S 예약된 좌석 번호: ', bookedStandardSeatNum);

    // 등급별 남은 좌석 번호
    const reamainVipSeatNum = [];

    for (let i = 1; i <= vipLimit; i++) {
      // console.log(bookedVipSeatNum.some((num) => num === i));
      if (!bookedVipSeatNum.some((num) => num === i)) {
        reamainVipSeatNum.push(
          new SeatObject(i, 'VIP', defaultPrice.price * 1.75),
        );
      }
    }

    // ROYAL
    const reamainRoyalSeatNum = [];
    for (let i = 1; i <= royalLimit; i++) {
      // console.log(bookedVipSeatNum.some((num) => num === i));
      if (!bookedRoyalSeatNum.some((num) => num === i)) {
        reamainRoyalSeatNum.push(
          new SeatObject(i, 'ROYAL', defaultPrice.price * 1.25),
        );
      }
    }

    // STANDARD
    const reamainStandardSeatNum = [];
    for (let i = 1; i <= standardLimit; i++) {
      // console.log(bookedVipSeatNum.some((num) => num === i));
      if (!bookedStandardSeatNum.some((num) => num === i)) {
        reamainStandardSeatNum.push(
          new SeatObject(i, 'STANDARD', defaultPrice.price),
        );
      }
    }
    const remainingVipSeats = vipLimit - vipReservedSeats.length;
    const remainingRoyalSeats = royalLimit - royalReservedSeats.length;
    const remainingStandardSeats = standardLimit - standardReservedSeats.length;

    console.log('VIP 남은 좌석 수: ', remainingVipSeats);
    console.log('VIP 남은 좌석 번호: ', reamainVipSeatNum);
    console.log('ROYAL 남은 좌석 수: ', remainingRoyalSeats);
    console.log('ROYAL 남은 좌석 번호: ', reamainRoyalSeatNum);
    console.log('STANDARD 남은 좌석 수: ', remainingStandardSeats);
    console.log('STANDARD 남은 좌석 번호: ', reamainStandardSeatNum);

    // 스케줄별 남은 자리가 0일 때 예매 불가
    if (
      remainingVipSeats === 0 &&
      remainingRoyalSeats === 0 &&
      remainingStandardSeats === 0
    ) {
      throw new Error('매진되었습니다.');
    }

    return {
      message: '예매 가능',
      remainingVipSeats,
      reamainVipSeatNum,
      remainingRoyalSeats,
      reamainRoyalSeatNum,
      remainingStandardSeats,
      reamainStandardSeatNum,
    };
  }

  async search(keyword: string) {
    const searchValue = await this.performanceRepository.find({
      where: {
        title: Like(`%${keyword}%`),
      },
    });
    return searchValue;
  }

  async create(
    createPerformanceDto: CreatePerformanceDto,
    createScheduleDto: CreateScheduleDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        start_date,
        end_date,
        start_at,
        end_at,
        vip_seat_limit,
        royal_seat_limit,
        standard_seat_limit,
      } = createScheduleDto;
      const newPerformance =
        await this.performanceRepository.save(createPerformanceDto);
      const id: any = newPerformance.id;
      // console.log('id => ', id);
      const newSchedule = await this.scheduleRepository.save({
        performance: id,
        start_date,
        end_date,
        start_at: `${start_date} ${start_at}`,
        end_at: `${start_date} ${end_at}`,
        vip_seat_limit,
        royal_seat_limit,
        standard_seat_limit,
      });

      await queryRunner.commitTransaction();
      return {
        success: 'true',
        message: '공연 등록 성공',
        newPerformance,
        newSchedule,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { status: 404, message: error.message };
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updatePerformanceDto: UpdatePerformanceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existingPerformance = await this.performanceRepository.findOne({
        where: { id, deleted_at: null },
      });

      if (!existingPerformance) {
        throw new NotFoundException('해당하는 공연을 찾을 수 없습니다.');
      }

      await this.performanceRepository.update(id, updatePerformanceDto);
      await queryRunner.commitTransaction();
      return {
        success: true,
        message: '공연 정보 수정 완료',
      };
    } catch (error) {
      // console.log(error);
      await queryRunner.rollbackTransaction();
      return { status: 404, message: error.message };
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existingPerformance = await this.performanceRepository.findOne({
        where: { id, deleted_at: null },
      });

      if (!existingPerformance) {
        throw new NotFoundException('해당하는 공연을 찾을 수 없습니다.');
      }

      await this.performanceRepository.softDelete(id);
      await queryRunner.commitTransaction();
      return { success: true, message: '삭제 완료되었습니다.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { status: 404, message: error.message };
    } finally {
      await queryRunner.release();
    }
  }
}
