
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HousekeepingService {
  constructor(private prisma: PrismaService){}

  async listRooms(propertyId:number, date:string){
    const rooms = await this.prisma.room.findMany({ where: { propertyId }, orderBy: { roomNo: 'asc' } });
    const d = new Date(date + 'T00:00:00Z');
    const hks = await this.prisma.housekeepingDaily.findMany({ where: { propertyId, date: d } });
    const map = new Map(hks.map(x => [x.roomId, x]));
    return rooms.map(r => ({
      room_id: r.id, room_no: r.roomNo, room_status: r.status,
      hk_status: map.get(r.id)?.hkStatus ?? 'dirty'
    }));
  }

  async setStatus(tenantId:number, propertyId:number, roomId:number, date:string, status:string){
    const d = new Date(date + 'T00:00:00Z');
    await this.prisma.housekeepingDaily.upsert({
      where: { hk_unique_per_day: { tenantId, propertyId, roomId, date: d } },
      create: { tenantId, propertyId, roomId, date: d, hkStatus: status, roomStatus: 'available' },
      update: { hkStatus: status }
    });
    return { ok: true };
  }
}
