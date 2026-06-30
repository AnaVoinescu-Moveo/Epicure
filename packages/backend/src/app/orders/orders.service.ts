import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

const RETENTION_LIMIT = 15;
const RETENTION_DAYS = 365;

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

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

    // Best-effort cleanup — the order is already saved, so a transient
    // failure here (e.g. a DB blip) must not turn an otherwise-successful
    // order into an error response, which could prompt the client to retry
    // and create a duplicate order.
    try {
      await this.pruneOldOrders(userId);
    } catch (err) {
      this.logger.error(
        `Failed to prune old orders for user ${userId}`,
        err instanceof Error ? err.stack : err,
      );
    }

    return this.toDto(saved);
  }

  // Keeps at most RETENTION_LIMIT orders, and never anything older than
  // RETENTION_DAYS — an order survives only if it satisfies both. Run
  // synchronously after each order is created since there's no
  // scheduler/cron infrastructure in this app to do it as a background job.
  private async pruneOldOrders(userId: number): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

    const orders = await this.ordersRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      select: { id: true, createdAt: true },
    });

    const idsToDelete = orders
      .filter(
        (order, index) => index >= RETENTION_LIMIT || order.createdAt < cutoff,
      )
      .map((order) => order.id);

    if (idsToDelete.length > 0) {
      await this.ordersRepository.delete(idsToDelete);
    }
  }

  async getOrderHistory(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.ordersRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
    return orders.map((o) => this.toDto(o));
  }
}
