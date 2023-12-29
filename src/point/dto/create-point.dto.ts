import { BeforeInsert, Column, PrimaryGeneratedColumn } from 'typeorm';

export class CreatePointDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seat_id: number;

  @Column()
  deposit: number;

  @Column()
  withdraw: number;

  @Column({ default: 1000000 }) // 기본값 설정
  balance: number;

  @BeforeInsert()
  setDefaultValues() {
    if (this.balance === undefined) {
      this.balance = 1000000;
    }
  }
}
