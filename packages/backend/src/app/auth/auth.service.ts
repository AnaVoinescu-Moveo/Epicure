import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { QueryFailedError } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RegisterPayload } from './dto/register.dto';
import { LoginPayload } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

interface TokenSubject {
  id: string;
  email: string;
  firstName: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private signToken(user: TokenSubject): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
    });
  }

  async register(payload: RegisterPayload): Promise<AuthResponseDto> {
    const existing = await this.usersService.findByEmail(payload.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    try {
      const user = await this.usersService.create(
        payload.email,
        hashedPassword,
        payload.firstName,
        payload.lastName,
      );
      const { id, email, firstName, lastName, createdAt } = user;
      return {
        user: { id, email, firstName, lastName, createdAt },
        access_token: this.signToken({ id, email, firstName }),
      };
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        (err as { code?: string }).code === '23505'
      ) {
        throw new ConflictException('Email already in use');
      }
      throw err;
    }
  }

  async login(payload: LoginPayload): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmailWithPassword(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(payload.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { access_token: this.signToken(user) };
  }
}
