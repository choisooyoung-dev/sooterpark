import {
  Controller,
  Body,
  Patch,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
// import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('SCHEDULE API')
@Controller('performance/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({ summary: '공연 스케줄 추가' })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('create/:performance_id')
  create(
    @Param('performance_id') performance_id: string,
    @Body() createScheduleDto: CreateScheduleDto,
    @Body('targetDate') targetDate: string,
  ) {
    return this.scheduleService.create(
      +performance_id,
      createScheduleDto,
      targetDate,
    );
  }

  @ApiOperation({ summary: '공연 스케줄 수정' })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch('/:performance_id/:id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(+id, updateScheduleDto);
  }
}
