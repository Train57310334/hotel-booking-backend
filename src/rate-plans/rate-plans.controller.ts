
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RatePlansService } from './rate-plans.service';

@Controller('rate-plans')
export class RatePlansController {
  constructor(private service: RatePlansService){}
  @Get() list(){ return this.service.list(); }
  @Post() create(@Body() body:any){ return this.service.create(body); }
  @Put(':id') update(@Param('id') id:string, @Body() body:any){ return this.service.update(Number(id), body); }
  @Delete(':id') remove(@Param('id') id:string){ return this.service.delete(Number(id)); }
}
