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
  async create(performance_id: any, createScheduleDto: CreateScheduleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // const matchSchedule = await this.scheduleRepository.find({
      //   where: { performance: performance_id },
      // });

      // console.log('matchSchedule: ', matchSchedule);
      const { date, start_at, end_at } = createScheduleDto;
      const createdSchedule = await this.scheduleRepository.save({
        performance: performance_id,
        date,
        start_at,
        end_at,
      });
      await queryRunner.commitTransaction();
      return { success: true, message: '스케줄 추가', createdSchedule };
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all schedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
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
    } finally {
      await queryRunner.release();
    }
  }

  // async remove(id: number) {
  //   return `This action removes a #${id} schedule`;
  // }
}
