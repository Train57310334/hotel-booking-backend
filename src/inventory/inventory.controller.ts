
import { Body, Controller, Get, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryQueryDto } from './dto/inventory-query.dto';
import { InventoryBulkPatchDto } from './dto/inventory-bulk.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getInventory(@Query() q: InventoryQueryDto) {
    return this.service.getInventory(q);
  }

  @Patch('bulk')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  patchBulk(@Body() body: InventoryBulkPatchDto) {
    return this.service.patchInventoryBulk(body);
  }
}
