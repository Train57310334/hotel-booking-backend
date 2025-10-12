
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private service: ReservationsService){}
  @Get(':propertyId') list(@Param('propertyId') propertyId:string){ return this.service.listByProperty(Number(propertyId)); }
  @Post() create(@Body() body:any){ return this.service.create(body); }
}
