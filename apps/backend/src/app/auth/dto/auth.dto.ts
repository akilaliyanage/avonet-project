import { IsEmail, IsString, MinLength, IsOptional, IsNumber, Min } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  monthlyExpenseLimit?: number;

  @IsOptional()
  currency?: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyExpenseLimit?: number;

  @IsOptional()
  @IsString()
  currency?: string;
} 