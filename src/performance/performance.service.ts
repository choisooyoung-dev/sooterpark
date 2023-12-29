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

  async getOne(id: number) {
    if (_.isNaN(id)) {
      throw new BadRequestException('공연 ID가 잘못되었습니다.');
    }
    const performance = await this.performanceRepository.findOne({
      where: { id, deleted_at: null },
    });

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
      const { times, date, start_at, end_at } = createScheduleDto;
      const newPerformance =
        await this.performanceRepository.save(createPerformanceDto);
      const id: any = newPerformance.id;
      // console.log('id => ', id);
      const newSchedule = await this.scheduleRepository.save({
        performance: id,
        times,
        date,
        start_at,
        end_at,
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
    const existingPerformance = await this.performanceRepository.findOne({
      where: { id, deleted_at: null },
    });

    if (!existingPerformance) {
      throw new NotFoundException('해당하는 공연을 찾을 수 없습니다.');
    }

    const updatedPerformance = await this.performanceRepository.update(
      id,
      updatePerformanceDto,
    );

    return {
      success: true,
      message: '공연 수정 완료',
      updatedPerformance,
    };
  }

  async remove(id: number) {
    const existingPerformance = await this.performanceRepository.findOne({
      where: { id, deleted_at: null },
    });

    if (!existingPerformance) {
      throw new NotFoundException('해당하는 공연을 찾을 수 없습니다.');
    }

    await this.performanceRepository.softDelete(id);

    return { success: true, message: '삭제 완료되었습니다.' };
  }
}
