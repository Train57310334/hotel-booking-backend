
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HousekeepingService } from './housekeeping.service';

@Controller('housekeeping')
export class HousekeepingController {
  constructor(private service: HousekeepingService){}

  @Get('rooms')
  rooms(@Query('property_id') propertyId:string, @Query('date') date:string){
    return this.service.listRooms(Number(propertyId), date);
  }

  @Post('status')
  status(@Body() body:any){
    return this.service.setStatus(body.tenant_id ?? 1, body.property_id, body.room_id, body.date, body.status);
  }
}
