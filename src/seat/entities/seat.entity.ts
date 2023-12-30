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

@Entity({
  name: 'seat',
})
export class Seat {
  @PrimaryGeneratedColumn({ name: 'seat_id' })
  id: number;

  @Column({ type: 'int', nullable: false, unique: true })
  seat_num: number;

  @Column({ type: 'enum', enum: Grade, nullable: false })
  grade: Grade;

  // @Column({ type: 'boolean', nullable: false })
  // status: boolean;

  // @Column({ type: 'int', nullable: false })
  // price: number;

  @Column({ type: 'int', nullable: false })
  performance_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => Performance, (performance) => performance.id)
  performance: Performance;

  @ManyToOne(() => Payment, (payment) => payment.id)
  payment: Payment;

  @ManyToOne(() => Schedule, (schedule) => schedule.seats)
  schedule: Schedule;
}
