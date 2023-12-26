import { Payment } from 'src/payment/entities/payment.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'ticket',
})
export class Ticket {
  @PrimaryGeneratedColumn({ name: 'ticket_id' })
  id: number;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'boolean', nullable: false })
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @OneToOne(() => Seat, (seat) => seat.id)
  @JoinColumn()
  seat: Seat;

  @ManyToOne(() => Performance, (performance) => performance.id)
  performance: Performance;

  @ManyToOne(() => Payment, (payment) => payment.id)
  payment: Payment;
}
