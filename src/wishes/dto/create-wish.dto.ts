import {
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Min,
  MinLength,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @IsString()
  @Length(1, 1024)
  description: string;
}
