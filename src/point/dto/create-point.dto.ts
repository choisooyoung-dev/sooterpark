import { BeforeInsert, Column, PrimaryGeneratedColumn } from 'typeorm';

export class CreatePointDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seat_id: number;

  @Column()
  income: number;

  @Column()
  outcome: number;

  @Column({ default: 1000000 }) // 기본값 설정
  total: number;

  @BeforeInsert()
  setDefaultValues() {
    if (this.total === undefined) {
      this.total = 1000000;
    }
  }
}
