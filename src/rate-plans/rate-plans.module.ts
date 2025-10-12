
import { Module } from '@nestjs/common';
import { RatePlansService } from './rate-plans.service';
import { RatePlansController } from './rate-plans.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({ controllers: [RatePlansController], providers: [RatePlansService, PrismaService] })
export class RatePlansModule {}
