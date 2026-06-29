import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

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
  @Matches(/(?=.*[A-Z])(?=.*[^A-Za-z0-9])/, {
    message:
      'password must contain at least one uppercase letter and one special character',
  })
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;
}
