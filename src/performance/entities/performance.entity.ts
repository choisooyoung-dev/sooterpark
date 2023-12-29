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

  @Column({ type: 'enum', enum: Category, default: Category.Musical })
  category: Category;

  @Column({ type: 'int', nullable: false })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @OneToMany(() => Seat, (seat) => seat.id)
  seat: Seat[];

  @OneToMany(() => Schedule, (schedule) => schedule.performance)
  schedule: Schedule[];
}
