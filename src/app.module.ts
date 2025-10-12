
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { GuestsModule } from './guests/guests.module';
import { RoomsModule } from './rooms/rooms.module';
import { RatePlansModule } from './rate-plans/rate-plans.module';
import { ReservationsModule } from './reservations/reservations.module';
import { HousekeepingModule } from './housekeeping/housekeeping.module';
import { ReportsModule } from './reports/reports.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    GuestsModule,
    RoomsModule,
    RatePlansModule,
    ReservationsModule,
    HousekeepingModule,
    ReportsModule,
    InventoryModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
