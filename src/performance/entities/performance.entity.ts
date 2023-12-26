import { Payment } from 'src/payment/entities/payment.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @OneToMany(() => Payment, (payment) => payment.performance_id)
  payments: Payment[];

  @OneToMany(() => Seat, (seat) => seat.id)
  seat: Seat[];

  @OneToMany(() => Ticket, (ticket) => ticket.id)
  ticket: Ticket[];
}
