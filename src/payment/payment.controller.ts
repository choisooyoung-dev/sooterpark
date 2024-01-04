import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { CreateSeatDto } from 'src/seat/dto/create-seat.dto';
import { User } from 'src/user/entities/user.entity';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@Controller('payment')
@ApiTags('PAYMENT API')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // 예매 전체 조회
  @ApiOperation({ summary: '예매 목록 전체 조회' })
  @ApiResponse({ status: 200, description: '예매 목록 전체 조회 성공' })
  @Get('/all/:user_id')
  findAll(@UserInfo() user: User, @Param('user_id') user_id: string) {
    return this.paymentService.findAll(user, +user_id);
  }

  // 공연 예매
  @ApiOperation({ summary: '공연 예매' })
  @ApiResponse({ status: 200, type: CreateSeatDto })
  @ApiParam({ name: 'performance_id', type: 'number' })
  @Post('create/:performance_id')
  create(
    @UserInfo() user: User,
    @Param('performance_id') performance_id: string,
    @Body('schedule_id') schedule_id: number,

    @Body() createSeatDto: CreateSeatDto,
  ) {
    return this.paymentService.create(
      user,
      schedule_id,
      +performance_id,
      createSeatDto,
    );
  }

  // 예매 특정 조회

  @ApiOperation({ summary: '예매 특정 조회' })
  @ApiResponse({ status: 200, description: '예매 조회 성공' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  // 예매 취소
  @ApiOperation({ summary: '예매 취소' })
  @ApiResponse({ status: 200, description: '예매 취소 성공' })
  @Delete(':paymentId')
  remove(@UserInfo() user: User, @Param('paymentId') paymentId: string) {
    return this.paymentService.remove(user, +paymentId);
  }
}
