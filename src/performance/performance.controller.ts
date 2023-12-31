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
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('performance')
@ApiTags('PERFORMANCE API')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  // 공연 전체 조회
  @ApiOperation({ summary: '공연 전체 조회' })
  @ApiResponse({ status: 200, description: '공연 전체 조회 성공' })
  @ApiResponse({ status: 500, description: '에러' })
  @Get()
  getAll() {
    return this.performanceService.getAll();
  }

  // 공연 남은 좌석 검색
  @ApiOperation({ summary: '남은 좌석 검색' })
  @ApiResponse({ status: 200, description: '남은 좌석 조회 성공' })
  @Get('/:performance_id/:schedule_id')
  getSeatsInfo(
    @Param('performance_id') performance_id: string,
    @Param('schedule_id') schedule_id: string,
  ) {
    return this.performanceService.getSeatInfo(+performance_id, +schedule_id);
  }

  // 공연 검색
  @ApiOperation({ summary: '공연 검색' })
  @ApiQuery({ example: '렌트' })
  @ApiResponse({ status: 200, description: '검색 성공' })
  @Get('search')
  searchPerformances(@Query('keyword') keyword: string) {
    return this.performanceService.search(keyword);
  }

  // 특정 공연 조회
  @ApiOperation({ summary: '특정 공연 조회' })
  @ApiParam({ name: 'performance_id', type: 'number' })
  @Get(':performance_id')
  getOne(@Param('performance_id') performance_id: string) {
    return this.performanceService.getOne(+performance_id);
  }

  // 공연 등록 - Admin
  @ApiOperation({ summary: '공연 등록 - Admin' })
  @ApiResponse({ status: 200, type: CreatePerformanceDto })
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
  @ApiOperation({ summary: '공연 수정 - Admin' })
  @ApiResponse({ status: 200, type: UpdatePerformanceDto })
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
  @ApiOperation({ summary: '공연 삭제 - Admin' })
  @ApiResponse({ status: 200, description: '공연 삭제 성공' })
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
