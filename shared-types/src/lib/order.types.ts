export interface OrderItem {
  dishId: string;
  dishName: string;
  price: number;
  quantity: number;
  side?: string;
  changes?: string[];
}

export interface Order {
  id: number;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  total: number;
  comment?: string;
  status: string;
  createdAt: string;
}

export interface CreateOrderPayload {
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  comment?: string;
}
