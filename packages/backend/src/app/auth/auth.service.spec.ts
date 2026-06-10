import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { QueryFailedError } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt');

const mockUser = {
  id: 'uuid-1234',
  email: 'test@test.com',
  password: 'hashed',
  firstName: 'Test',
  lastName: 'User',
  createdAt: new Date('2024-01-01'),
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findByEmailWithPassword: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mock-token') },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    const payload = {
      email: 'test@test.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('returns UserResponseDto without password on success', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser as never);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const result = await authService.register(payload);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        createdAt: mockUser.createdAt,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('throws ConflictException when email is already in use', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as never);

      await expect(authService.register(payload)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws ConflictException on DB unique violation race condition', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const dbError = Object.assign(new QueryFailedError('', [], new Error()), {
        code: '23505',
      });
      usersService.create.mockRejectedValue(dbError);

      await expect(authService.register(payload)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const payload = { email: 'test@test.com', password: 'password123' };

    it('returns access_token on valid credentials', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue(mockUser as never);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(payload);

      expect(result).toEqual({ access_token: 'mock-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });

    it('throws UnauthorizedException when user is not found', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(authService.login(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue(mockUser as never);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
