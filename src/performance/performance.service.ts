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

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
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
    for (let i = 0; i < performance.schedule.length; i++) {
      let remainingVipSeats =
        performance.schedule[i].vip_seat_limit -
        performance.schedule[i].seats.filter((s) => s.grade === 'V').length;

      let remainingRoyalSeats =
        performance.schedule[i].royal_seat_limit -
        performance.schedule[i].seats.filter((s) => s.grade === 'R').length;

      let remainingStandardSeats =
        performance.schedule[i].standard_seat_limit -
        performance.schedule[i].seats.filter((s) => s.grade === 'S').length;

      // 스케줄별 남은 자리가 0일 때 예매 불가
      if (
        remainingVipSeats === 0 &&
        remainingRoyalSeats === 0 &&
        remainingStandardSeats === 0
      ) {
        throw new Error('매진되었습니다.');
      }

      return { remainingVipSeats, remainingRoyalSeats, remainingStandardSeats };
    }

    if (!performance) {
      throw new NotFoundException('찾을 수 없는 공연 ID 입니다.');
    }

    return performance;
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
    } finally {
      await queryRunner.release();
    }
  }
}
