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
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Entity({
  name: 'payment',
})
export class Payment {
  @PrimaryGeneratedColumn({ name: 'payment_id' })
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @ManyToOne(() => Performance, (performance) => performance.id)
  performance: Performance;

  @Column({ type: 'int', nullable: false })
  performance_id: number;

  @OneToMany(() => Ticket, (ticket) => ticket.id)
  ticket: Ticket[];

  @Column({ type: 'boolean', nullable: false })
  status: string;

  @Column({ type: 'int', nullable: false })
  total_price: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
