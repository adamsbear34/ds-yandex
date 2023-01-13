import { OrderStatus } from '@/common/enums';
import { IsEnum, IsOptional } from 'class-validator';
import { Price } from '@/carwash/dto';
import { Transform } from 'class-transformer';
import { dateInputTransform } from '@/common/utils';

export class CreateOrderRequest {
  Id: string;
  @Transform(({ value }) => new Date(value))
  DateCreate: Date;
  CarWashId: string;
  BoxNumber: string;
  @IsEnum(OrderStatus)
  @IsOptional()
  OrderStatus?: OrderStatus;
  Sum: number;
  SumCompleted: number;
  @IsOptional()
  Description?: string;
  @IsOptional()
  BoxId?: string;
  ContractId: string;
  @IsOptional()
  SumPaidStationCompleted?: number;
}
