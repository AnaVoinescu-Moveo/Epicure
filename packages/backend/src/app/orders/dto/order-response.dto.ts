import { OrderItem } from '@org/shared-types';
import { OrderStatus } from '../order-status.enum';

export class OrderResponseDto {
  id!: number;
  restaurantId!: string;
  restaurantName!: string;
  items!: OrderItem[];
  total!: number;
  comment!: string | null;
  status!: OrderStatus;
  createdAt!: Date;
}
