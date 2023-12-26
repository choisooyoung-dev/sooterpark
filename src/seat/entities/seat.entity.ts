import { Performance } from 'src/performance/entities/performance.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'seat',
})
export class Seat {
  @PrimaryGeneratedColumn({ name: 'seat_id' })
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  seat_num: string;

  @Column({ type: 'boolean', nullable: false })
  status: boolean;

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

  @OneToOne(() => Ticket, (ticket) => ticket.id)
  ticket: Ticket;
}
