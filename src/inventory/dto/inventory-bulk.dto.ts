
import { IsArray, IsDateString, IsInt, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class InventoryBulkItemDto {
  @IsInt()
  @Type(() => Number)
  property_id!: number;

  @IsInt()
  @Type(() => Number)
  room_type_id!: number;

  @IsInt()
  @Type(() => Number)
  rate_plan_id!: number;

  @IsDateString()
  date!: string; // YYYY-MM-DD

  @IsOptional()
  @IsNumber({}, { message: 'price must be a number if provided' })
  @Type(() => Number)
  price?: number | null;

  @IsOptional()
  @IsInt({ message: 'allotment must be an integer if provided' })
  @Type(() => Number)
  allotment?: number | null;
}

export class InventoryBulkPatchDto {
  @IsArray()
  items!: InventoryBulkItemDto[];
}
