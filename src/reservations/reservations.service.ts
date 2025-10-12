
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService){}
  listByProperty(propertyId:number){
    return this.prisma.reservation.findMany({
      where: { propertyId },
      include: { guest: true, stays: true },
      orderBy: { id: 'desc' }
    });
  }
  async create(data:any){
    const res = await this.prisma.reservation.create({
      data: {
        tenantId: data.tenant_id ?? 1,
        propertyId: data.property_id,
        guestId: data.guest_id,
        status: 'booked',
        totalAmount: 0
      }
    });
    await this.prisma.stay.create({
      data: {
        reservationId: res.id,
        roomId: data.room_id ?? (await this.prisma.room.findFirst({ where: { propertyId: data.property_id } }))!.id,
        checkInDate: new Date(data.check_in_date + 'T00:00:00Z'),
        checkOutDate: new Date(data.check_out_date + 'T00:00:00Z'),
        ratePlanId: data.rate_plan_id,
        pricePerNight: 0
      }
    });
    return this.prisma.reservation.findUnique({ where: { id: res.id }, include: { guest:true, stays:true } });
  }
}
