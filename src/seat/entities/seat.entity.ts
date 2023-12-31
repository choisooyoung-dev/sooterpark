import { Payment } from 'src/payment/entities/payment.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Grade } from '../types/seatGrade.type';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({
  name: 'seat',
})
export class Seat {
  @PrimaryGeneratedColumn({ name: 'seat_id' })
  id: number;

  @Column({ type: 'int', nullable: false })
  seat_num: number;

  @Column({ type: 'enum', enum: Grade })
  grade: Grade;

  @Column({ type: 'int', nullable: false })
  seat_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => Performance, (performance) => performance.seat, {
    nullable: false,
  })
  performance: Performance;

  @ManyToOne(() => Payment, (payment) => payment.id, {
    nullable: false,
  })
  payment: Payment;

  @ManyToOne(() => Schedule, (schedule) => schedule.seats, {
    nullable: false,
  })
  schedule: Schedule;

  @ManyToOne(() => User, (user) => user.seat, {
    nullable: false,
  })
  user: User;
}
