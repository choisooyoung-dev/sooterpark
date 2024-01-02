import { Payment } from 'src/payment/entities/payment.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
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
  deposit: number;

  @Column({ type: 'int', nullable: false })
  withdraw: number;

  @Column({ type: 'int', nullable: false, default: 1000000 })
  balance: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Payment, (payment) => payment.id)
  payment: Payment;
}
