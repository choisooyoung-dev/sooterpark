import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateScheduleDto } from 'src/schedule/dto/create-schedule.dto';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  // 공연 전체 조회
  @Get()
  getAll() {
    return this.performanceService.getAll();
  }

  // 공연 검색
  @Get('search')
  searchPerformances(@Query('keyword') keyword: string) {
    return this.performanceService.search(keyword);
  }

  // 특정 공연 조회
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.performanceService.getOne(+id);
  }

  // 공연 등록 - Admin
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('create')
  async create(
    @Body() createPerformanceDto: CreatePerformanceDto,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return await this.performanceService.create(
      createPerformanceDto,
      createScheduleDto,
    );
  }

  //  공연 수정 - Admin
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id')
    id: string,
    @Body() updatePerformanceDto: UpdatePerformanceDto,
  ) {
    return await this.performanceService.update(+id, updatePerformanceDto);
  }

  // 공연 삭제 - Admin
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async remove(
    @Param('id')
    id: string,
  ) {
    return await this.performanceService.remove(+id);
  }
}
