import { IsEmail, IsString, MinLength } from 'class-validator';

export interface LoginPayload {
  email: string;
  password: string;
}

export class LoginDto implements LoginPayload {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}
