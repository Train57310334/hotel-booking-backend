
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { differenceInCalendarDays, eachDayOfInterval, isBefore } from 'date-fns';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService){}

  async summary(propertyId:number, start:string, end:string){
    const s = new Date(start + 'T00:00:00Z');
    const e = new Date(end + 'T00:00:00Z');
    const days = eachDayOfInterval({ start: s, end: e }).map(d=>d.toISOString().slice(0,10));

    const roomsCount = await this.prisma.room.count({ where: { propertyId } });
    const reservations = await this.prisma.reservation.findMany({
      where: { propertyId },
      include: { stays: true }
    });

    let totalRoomsSold = 0;
    let totalRevenue = 0;
    const daily: Record<string, { adr:number; occ:number; revpar:number }> = {};
    for (const d of days) daily[d] = { adr: 0, occ: 0, revpar: 0 };

    for (const res of reservations) {
      for (const st of res.stays) {
        const checkIn = new Date(st.checkInDate);
        const checkOut = new Date(st.checkOutDate);
        let nights = differenceInCalendarDays(checkOut, checkIn);
        if (nights < 0) nights = 0;
        totalRoomsSold += nights;
        const price = Number(st.pricePerNight ?? 0) * nights;
        totalRevenue += price;
      }
    }

    const roomsAvailablePerDay = roomsCount * (days.length || 1);
    const ADR = totalRoomsSold ? +(totalRevenue / totalRoomsSold).toFixed(2) : 0;
    const Occupancy = roomsAvailablePerDay ? totalRoomsSold / roomsAvailablePerDay : 0;
    const RevPAR = roomsCount ? +(totalRevenue / (roomsCount * (days.length || 1))).toFixed(2) : 0;

    // simple daily split: evenly distribute for demo
    for (const d of days) {
      daily[d].adr = ADR;
      daily[d].occ = Occupancy;
      daily[d].revpar = RevPAR;
    }

    return {
      summary: { roomsAvailablePerDay, totalRoomsSold, totalRevenue, ADR, Occupancy, RevPAR },
      daily
    };
  }
}
