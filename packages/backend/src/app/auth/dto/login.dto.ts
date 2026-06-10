import { IsEmail, IsString } from 'class-validator';

export interface LoginPayload {
  email: string;
  password: string;
}

export class LoginDto implements LoginPayload {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
