import { Performance } from 'src/performance/entities/performance.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'schedule',
})
export class Schedule {
  @PrimaryGeneratedColumn({ name: 'schedule_id' })
  id: number;

  @Column({ type: 'varchar', nullable: false })
  date: string;

  @Column({ type: 'varchar', nullable: false })
  start_at: string;

  @Column({ type: 'varchar', nullable: false })
  end_at: string;

  @Column({ type: 'int', nullable: false })
  vip_seat_limit: number;

  @Column({ type: 'int', nullable: false })
  royal_seat_limit: number;

  @Column({ type: 'int', nullable: false })
  standard_seat_limit: number;

  @OneToMany(() => Seat, (seat) => seat.schedule)
  seats: Seat[];

  @ManyToOne(() => Performance, (performance) => performance.schedule, {
    onDelete: 'CASCADE',
  })
  performance: Performance;
}
