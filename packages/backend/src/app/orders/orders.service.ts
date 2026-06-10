import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  private toDto(order: Order): OrderResponseDto {
    const {
      id,
      restaurantId,
      restaurantName,
      items,
      total,
      comment,
      status,
      createdAt,
    } = order;
    return {
      id,
      restaurantId,
      restaurantName,
      items,
      total,
      comment,
      status,
      createdAt,
    };
  }

  async createOrder(
    userId: number,
    dto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    // Prices come from the client payload (Strapi dish prices).
    // The total is always recalculated server-side to prevent client-side tampering.
    // TODO: verify each item price against Strapi before summing — once dish data is seeded,
    // fetch the canonical price from Strapi and reject the order if prices don't match.
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
      comment: dto.comment ?? null,
    });

    const saved = await this.ordersRepository.save(order);
    return this.toDto(saved);
  }

  async getOrderHistory(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.ordersRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
    return orders.map((o) => this.toDto(o));
  }
}
