import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async createOrder(userId: number, dto: CreateOrderDto): Promise<Order> {
    const total = dto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = this.ordersRepository.create({
      user: { id: userId },
      restaurantId: dto.restaurantId,
      restaurantName: dto.restaurantName,
      items: dto.items,
      total: Math.round(total * 100) / 100,
      comment: dto.comment,
    });

    return this.ordersRepository.save(order);
  }

  async getOrderHistory(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
