import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterPayload } from './dto/register.dto';
import { LoginPayload } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterPayload): Promise<UserResponseDto> {
    const existing = await this.usersService.findByEmail(payload.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const user = await this.usersService.create(
      payload.email,
      hashedPassword,
      payload.firstName,
      payload.lastName,
    );
    const { id, email, firstName, lastName, createdAt } = user;
    return { id, email, firstName, lastName, createdAt };
  }

  async login(payload: LoginPayload): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(payload.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }
}
