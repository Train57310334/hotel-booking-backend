
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private service: RoomsService){}
  @Get() list(){ return this.service.list(); }
  @Post() create(@Body() body:any){ return this.service.create(body); }
  @Put(':id') update(@Param('id') id:string, @Body() body:any){ return this.service.update(Number(id), body); }
  @Delete(':id') remove(@Param('id') id:string){ return this.service.delete(Number(id)); }
}
