import { Seat } from 'src/seat/entities/seat.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../types/performanceCategory.type';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Payment } from 'src/payment/entities/payment.entity';

@Entity({
  name: 'performance',
})
export class Performance {
  @PrimaryGeneratedColumn({ name: 'performance_id' })
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'varchar', nullable: false })
  image: string;

  @Column({
    type: 'enum',
    enum: Category,
    default: Category.Musical,
    nullable: false,
  })
  category: Category;

  @Column({ type: 'int', nullable: false })
  price: number;

  // @Column({ type: 'int', nullable: false })
  // vip_seat_limit: number;

  // @Column({ type: 'int', nullable: false })
  // royal_seat_limit: number;

  // @Column({ type: 'int', nullable: false })
  // standard_seat_limit: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @OneToMany(() => Seat, (seat) => seat.performance)
  seat: Seat[];

  @OneToMany(() => Schedule, (schedule) => schedule.performance)
  schedule: Schedule[];

  @OneToMany(() => Payment, (payment) => payment.performance)
  payment: Payment[];
}
