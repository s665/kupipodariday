import {
  IsEmail,
  IsEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @IsOptional()
  @Length(2, 200)
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  password: string;
}
