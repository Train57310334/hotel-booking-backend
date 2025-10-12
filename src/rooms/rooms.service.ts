
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService){}
  list(){ return this.prisma.room.findMany({ orderBy: { id: 'desc' } }); }
  create(data:any){ return this.prisma.room.create({ data: {
    tenantId: data.tenant_id ?? 1, propertyId: data.property_id ?? 1,
    roomTypeId: data.room_type_id, roomNo: data.room_no, status: data.status ?? 'available'
  }}); }
  update(id:number,data:any){ return this.prisma.room.update({ where:{ id }, data: {
    tenantId: data.tenant_id ?? 1, propertyId: data.property_id ?? 1,
    roomTypeId: data.room_type_id, roomNo: data.room_no, status: data.status ?? 'available'
  }}); }
  delete(id:number){ return this.prisma.room.delete({ where:{ id } }); }
}
