
import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private service: ReportsService){}
  @Get('summary')
  summary(@Query('property_id') propertyId:string, @Query('start') start:string, @Query('end') end:string){
    return this.service.summary(Number(propertyId), start, end);
  }
}
