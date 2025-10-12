
import { Module } from '@nestjs/common';
import { HousekeepingService } from './housekeeping.service';
import { HousekeepingController } from './housekeeping.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({ controllers: [HousekeepingController], providers: [HousekeepingService, PrismaService] })
export class HousekeepingModule {}
