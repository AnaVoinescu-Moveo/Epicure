import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './app/users/user.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: parseInt(process.env['DB_PORT'] ?? '5432', 10),
  username: process.env['DB_USER'] ?? 'postgres',
  password: process.env['DB_PASSWORD'] ?? '',
  database: process.env['DB_NAME'] ?? 'epicure',
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
