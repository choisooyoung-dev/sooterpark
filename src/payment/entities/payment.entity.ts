import { User } from 'src/user/entities/user.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Seat } from 'src/seat/entities/seat.entity';
import { Point } from 'src/point/entities/point.entity';
import { paymentStatus } from '../types/paymentStatus.types';

@Entity({
  name: 'payment',
})
export class Payment {
  @PrimaryGeneratedColumn({ name: 'payment_id' })
  id: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'enum', enum: paymentStatus, nullable: false })
  status: paymentStatus;

  @ManyToOne(() => Performance, (performance) => performance.payment)
  performance: Performance;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @OneToMany(() => Seat, (seat) => seat.id, { cascade: true })
  seat: Seat[];

  @OneToMany(() => Point, (point) => point.user)
  point: Point[];
}
