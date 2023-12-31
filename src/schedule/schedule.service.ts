import { Injectable } from '@nestjs/common';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private dataSource: DataSource,
  ) {}

  // 입력받은 날짜 mysql 형식으로 변환

  async create(
    performance_id: any,
    createScheduleDto: CreateScheduleDto,
    targetDate: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log(targetDate);
      const {
        start_date,
        end_date,
        start_at,
        end_at,
        vip_seat_limit,
        royal_seat_limit,
        standard_seat_limit,
      } = createScheduleDto;

      const createdSchedule = await queryRunner.manager.save(Schedule, {
        performance: performance_id,
        start_date,
        end_date,
        start_at: `${targetDate} ${start_at}`,
        end_at: `${targetDate} ${end_at}`,
        vip_seat_limit,
        royal_seat_limit,
        standard_seat_limit,
        targetDate,
      });
      await queryRunner.commitTransaction();
      return { success: true, message: '스케줄 추가', createdSchedule };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return { status: 404, message: error.message };
    } finally {
      await queryRunner.release();
    }
  }

  // 공연 일정 수정
  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updatedSchedule = await this.scheduleRepository.update(
        id,
        updateScheduleDto,
      );
      await queryRunner.commitTransaction();
      return {
        success: true,
        message: '공연 일정 수정이 완료되었습니다.',
        updatedSchedule,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { status: 404, message: error.message };
    } finally {
      await queryRunner.release();
    }
  }
}
