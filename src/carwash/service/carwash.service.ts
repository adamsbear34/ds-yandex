import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { YaOrder } from '@/carwash/entity/ya-order.entity';
import { Repository } from 'typeorm';
import { CreateOrderRequest } from '@/core/dto/req/create-order-request.dto';
import { OrderExcecutionStatus, OrderStatus, SendStatus } from '@/common/enums';

@Injectable()
export class CarwashService {
  constructor(
    @InjectRepository(YaOrder) private repository: Repository<YaOrder>,
  ) {}

  async createOrder(orderRequest: CreateOrderRequest): Promise<YaOrder> {
    const order = new YaOrder();

    order.externalId = orderRequest.Id;
    order.boxNumber = parseInt(orderRequest.BoxNumber);
    order.cmnCarWashId = parseInt(orderRequest.CarWashId);
    order.cmnDeviceId = parseInt(orderRequest.BoxId);
    order.description = orderRequest.Description;
    order.contractId = orderRequest.ContractId;
    order.orderSum = orderRequest.Sum;
    order.orderTime = new Date(orderRequest.DateCreate);
    order.status = orderRequest.Status;

    const newOrder = await this.repository.create(order);

    await this.repository.save(newOrder);

    return newOrder;
  }

  async setExecutionalError(id: number, error: string) {
    await this.repository.update(id, {
      errorExcecution: error,
      statusExecution: OrderExcecutionStatus.ERROR,
    });
  }

  async findAll() {
    return this.repository.find();
  }

  async updateOrderStatus(
    id: number,
    status: OrderStatus,
    chargeTime: Date = null,
    sendStatus: SendStatus = null,
    sendTime: Date = null,
    error: string = null,
    statusExecution: OrderExcecutionStatus = null,
  ) {
    await this.repository.update(id, {
      status: status,
      chargeTime: chargeTime,
      sendStatus: sendStatus,
      sendTime: sendTime,
      errorReason: error,
      statusExecution: statusExecution,
    });
  }
}
