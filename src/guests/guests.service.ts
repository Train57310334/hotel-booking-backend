
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GuestsService {
  constructor(private prisma: PrismaService){}
  list(){ return this.prisma.guest.findMany({ orderBy: { id: 'desc' } }); }
  create(data:any){ return this.prisma.guest.create({ data: { firstName:data.first_name, lastName:data.last_name, email:data.email, phone:data.phone } }); }
  update(id:number,data:any){ return this.prisma.guest.update({ where:{ id }, data: { firstName:data.first_name, lastName:data.last_name, email:data.email, phone:data.phone } }); }
  delete(id:number){ return this.prisma.guest.delete({ where:{ id } }); }
}
