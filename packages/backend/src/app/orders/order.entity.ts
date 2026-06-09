import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from '@my-monorepo/shared-types';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  restaurantId!: string;

  @Column()
  restaurantName!: string;

  @Column('json')
  items!: OrderItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  @Column({ nullable: true, length: 500 })
  comment!: string;

  @Column({ default: 'completed' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
