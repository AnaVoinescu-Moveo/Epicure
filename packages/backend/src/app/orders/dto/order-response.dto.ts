import { OrderItem } from '@org/shared-types';

export class OrderResponseDto {
  id!: number;
  restaurantId!: string;
  restaurantName!: string;
  items!: OrderItem[];
  total!: number;
  comment!: string | null;
  status!: string;
  createdAt!: Date;
}
