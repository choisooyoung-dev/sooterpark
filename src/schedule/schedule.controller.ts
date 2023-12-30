import {
  Controller,
  Get,
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

@Controller('performance/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('create/:performance_id')
  create(
    @Param('performance_id') performance_id: string,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return this.scheduleService.create(+performance_id, createScheduleDto);
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch('/:performance_id/:id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(+id, updateScheduleDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.scheduleService.remove(+id);
  // }
}
