import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class RegisterDto implements RegisterPayload {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;
}
