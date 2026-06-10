import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from '@org/shared-types';

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

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  total!: number;

  @Column({ nullable: true, length: 500 })
  comment!: string;

  @Column({ default: 'completed' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
