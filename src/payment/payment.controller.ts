import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { CreateSeatDto } from 'src/seat/dto/create-seat.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // 공연 예매
  @Post('create/:performance_id')
  create(
    @UserInfo() user: any,
    @Param('performance_id') performance_id: string,
    @Body('schedule_id') schedule_id: number,
    @Body() createPaymentDto: CreatePaymentDto,
    @Body() createSeatDto: CreateSeatDto,
  ) {
    return this.paymentService.create(
      user,
      schedule_id,
      +performance_id,
      createPaymentDto,
      createSeatDto,
    );
  }

  // 예매 전체 조회
  @Get(':/user_id')
  findAll() {
    return this.paymentService.findAll();
  }

  // 예매 특정 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  // 예매 취소
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
