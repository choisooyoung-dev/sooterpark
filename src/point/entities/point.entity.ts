import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'point',
})
export class Point {
  @PrimaryGeneratedColumn({ name: 'point_id' })
  id: number;

  @Column({ type: 'int', nullable: false })
  income: number;

  @Column({ type: 'int', nullable: false })
  outcome: number;

  @Column({ type: 'int', nullable: false, default: 1000000 })
  total: number;

  // @ManyToOne(() => Seat, (seat) => seat.id)
  // @JoinColumn({ name: 'seat_id' })
  // seat: Seat;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
