import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsPositive,
  IsInt,
  ValidateNested,
  ArrayMinSize,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  dishId!: string;

  @IsString()
  @IsNotEmpty()
  dishName!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @IsInt()
  @IsPositive()
  quantity!: number;

  @IsOptional()
  @IsString()
  side?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  changes?: string[];
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  restaurantId!: string;

  @IsString()
  @IsNotEmpty()
  restaurantName!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}
