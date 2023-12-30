import { IsBoolean, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsBoolean()
  status: boolean;

  @IsNumber()
  total_price: number;
}
