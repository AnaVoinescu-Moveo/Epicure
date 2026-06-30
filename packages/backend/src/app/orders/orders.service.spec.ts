import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

const mockDate = new Date('2024-01-01');

const mockSavedOrder = (overrides: Partial<Order> = {}): Order =>
  ({
    id: 1,
    restaurantId: 'rest-1',
    restaurantName: 'The Blue Door',
    items: [
      { dishId: 'd1', dishName: 'Truffle Pasta', price: 28.5, quantity: 2 },
    ],
    total: 57,
    comment: null,
    status: 'completed',
    createdAt: mockDate,
    user: { id: 1 } as never,
    ...overrides,
  }) as Order;

describe('OrdersService', () => {
  let service: OrdersService;
  let repo: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: repo },
      ],
    }).compile();

    service = module.get(OrdersService);
  });

  describe('createOrder', () => {
    const dto: CreateOrderDto = {
      restaurantId: 'rest-1',
      restaurantName: 'The Blue Door',
      items: [
        { dishId: 'd1', dishName: 'Truffle Pasta', price: 28.5, quantity: 2 },
      ],
    } as CreateOrderDto;

    it('calculates total from items and returns OrderResponseDto', async () => {
      repo.create.mockReturnValue(mockSavedOrder());
      repo.save.mockResolvedValue(mockSavedOrder());

      const result = await service.createOrder(1, dto);

      expect(result.total).toBe(57);
      expect(result).not.toHaveProperty('user');
      expect(result).toMatchObject({
        id: 1,
        restaurantId: 'rest-1',
        restaurantName: 'The Blue Door',
        status: 'completed',
        comment: null,
      });
    });

    it('rounds total to 2 decimal places', async () => {
      const dtoWithFloats: CreateOrderDto = {
        restaurantId: 'rest-1',
        restaurantName: 'The Blue Door',
        items: [{ dishId: 'd1', dishName: 'Item', price: 10.005, quantity: 3 }],
      } as CreateOrderDto;

      const saved = mockSavedOrder({ total: 30.02 });
      repo.create.mockReturnValue(saved);
      repo.save.mockResolvedValue(saved);

      await service.createOrder(1, dtoWithFloats);

      const passedToCreate = repo.create.mock.calls[0][0];
      expect(passedToCreate.total).toBe(Math.round(10.005 * 3 * 100) / 100);
    });

    it('sets comment to null when not provided', async () => {
      repo.create.mockReturnValue(mockSavedOrder());
      repo.save.mockResolvedValue(mockSavedOrder());

      await service.createOrder(1, dto);

      const passedToCreate = repo.create.mock.calls[0][0];
      expect(passedToCreate.comment).toBeNull();
    });

    it('includes comment when provided', async () => {
      const dtoWithComment = { ...dto, comment: 'No garlic please' };
      const saved = mockSavedOrder({ comment: 'No garlic please' });
      repo.create.mockReturnValue(saved);
      repo.save.mockResolvedValue(saved);

      const result = await service.createOrder(1, dtoWithComment);

      expect(result.comment).toBe('No garlic please');
    });

    it('never exposes user relation in the response', async () => {
      repo.create.mockReturnValue(mockSavedOrder());
      repo.save.mockResolvedValue(mockSavedOrder());

      const result = await service.createOrder(1, dto);

      expect(result).not.toHaveProperty('user');
    });
  });

  describe('createOrder retention pruning', () => {
    const dto: CreateOrderDto = {
      restaurantId: 'rest-1',
      restaurantName: 'The Blue Door',
      items: [
        { dishId: 'd1', dishName: 'Truffle Pasta', price: 28.5, quantity: 2 },
      ],
    } as CreateOrderDto;

    const orderAt = (id: number, daysAgo: number): Order => {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      return mockSavedOrder({ id, createdAt });
    };

    beforeEach(() => {
      repo.create.mockReturnValue(mockSavedOrder());
      repo.save.mockResolvedValue(mockSavedOrder());
    });

    it('does nothing when the user has 15 or fewer recent orders', async () => {
      repo.find.mockResolvedValue(
        Array.from({ length: 15 }, (_, i) => orderAt(i + 1, i)),
      );

      await service.createOrder(1, dto);

      expect(repo.delete).not.toHaveBeenCalled();
    });

    it('deletes orders beyond the 15 most recent', async () => {
      repo.find.mockResolvedValue(
        Array.from({ length: 17 }, (_, i) => orderAt(i + 1, i)),
      );

      await service.createOrder(1, dto);

      expect(repo.delete).toHaveBeenCalledWith([16, 17]);
    });

    it('deletes orders older than a year even if under the 15 cap', async () => {
      repo.find.mockResolvedValue([
        orderAt(1, 10),
        orderAt(2, 400),
        orderAt(3, 366),
      ]);

      await service.createOrder(1, dto);

      expect(repo.delete).toHaveBeenCalledWith([2, 3]);
    });

    it('still returns the saved order even if pruning fails', async () => {
      repo.find.mockRejectedValue(new Error('connection blip'));

      const result = await service.createOrder(1, dto);

      expect(result.id).toBe(mockSavedOrder().id);
    });
  });

  describe('getOrderHistory', () => {
    it('returns mapped OrderResponseDto array', async () => {
      repo.find.mockResolvedValue([
        mockSavedOrder({ id: 1 }),
        mockSavedOrder({ id: 2, comment: 'Extra spicy' }),
      ]);

      const result = await service.getOrderHistory(1);

      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('user');
      expect(result[1].comment).toBe('Extra spicy');
    });

    it('returns empty array when user has no orders', async () => {
      repo.find.mockResolvedValue([]);

      const result = await service.getOrderHistory(1);

      expect(result).toEqual([]);
    });

    it('queries by userId', async () => {
      repo.find.mockResolvedValue([]);

      await service.getOrderHistory(42);

      expect(repo.find).toHaveBeenCalledWith({
        where: { user: { id: 42 } },
        order: { createdAt: 'DESC' },
      });
    });
  });
});
