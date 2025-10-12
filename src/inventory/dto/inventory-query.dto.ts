
import { IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class InventoryQueryDto {
  @IsInt()
  @Type(() => Number)
  property_id!: number;

  @IsDateString()
  start!: string; // YYYY-MM-DD

  @IsDateString()
  end!: string;   // YYYY-MM-DD
}
