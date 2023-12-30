import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from 'src/seat/entities/seat.entity';
import { Repository } from 'typeorm';
import { Performance } from 'src/performance/entities/performance.entity';
import { CreateSeatDto } from 'src/seat/dto/create-seat.dto';
import { CreateSeatDto } from './../seat/dto/create-seat.dto';
import { Grade } from 'src/seat/types/seatGrade.type';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
  ) {}
  async create(
    user: any,
    performance_id: number,
    createPaymentDto: CreatePaymentDto,
    createSeatDto: CreateSeatDto,
  ) {
    let { status, total_price } = createPaymentDto;
    const { grade, seat_num } = createSeatDto;

    const performance = await this.performanceRepository.findOne({
      where: { id: performance_id },
    });

    const existingSeat = await this.seatRepository.find({
      where: { seat_num },
    });

    if (existingSeat) {
      return {
        succsee: false,
        message: '이미 선택된 자석입니다.',
      };
    }

    if (grade === Grade.VIP) {
      total_price = performance.price * 1.75;
    } else if (grade === Grade.R) {
      total_price = performance.price * 1.25;
    } else {
      total_price = performance.price;
    }

    status = true;
    const newPayment = await this.performanceRepository.save({
      status,
      total_price,
    });

    // return user;
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
