
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryQueryDto } from './dto/inventory-query.dto';
import { InventoryBulkPatchDto } from './dto/inventory-bulk.dto';
import { eachDayOfInterval } from 'date-fns';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  private parseYmd(s: string): Date {
    const d = new Date(s + 'T00:00:00Z');
    if (Number.isNaN(d.getTime())) {
      throw new BadRequestException(`Invalid date format: ${s}`);
    }
    return d;
  }

  private async getTenantIdByProperty(propertyId: number): Promise<number> {
    const prop = await this.prisma.property.findUnique({
      where: { id: propertyId },
      select: { tenantId: true },
    });
    if (!prop) throw new NotFoundException('Property not found');
    return prop.tenantId;
  }

  private async listRoomTypesAndRatePlans(propertyId: number) {
    const [roomTypes, ratePlans] = await Promise.all([
      this.prisma.roomType.findMany({
        where: { propertyId },
        select: { id: true, code: true },
        orderBy: { id: 'asc' },
      }),
      this.prisma.ratePlan.findMany({
        where: { propertyId },
        select: { id: true, code: true },
        orderBy: { id: 'asc' },
      }),
    ]);
    return { roomTypes, ratePlans };
  }

  async getInventory(q: InventoryQueryDto) {
    const propertyId = q.property_id;
    const tenantId = await this.getTenantIdByProperty(propertyId);
    const start = this.parseYmd(q.start);
    const end = this.parseYmd(q.end);
    if (start > end) throw new BadRequestException('start must be <= end');

    const daysArr = eachDayOfInterval({ start, end }).map(d => d.toISOString().slice(0, 10));
    const { roomTypes, ratePlans } = await this.listRoomTypesAndRatePlans(propertyId);

    const existing = await this.prisma.inventoryDaily.findMany({
      where: { tenantId, propertyId, date: { gte: start, lte: end } },
      select: { roomTypeId: true, ratePlanId: true, date: true, price: true, allotment: true },
    });

    const idx = new Map<string, { price: any; allotment: number | null }>();
    for (const it of existing) {
      const d = it.date.toISOString().slice(0, 10);
      idx.set(`${it.roomTypeId}-${it.ratePlanId}-${d}`, {
        price: it.price,
        allotment: it.allotment ?? null,
      });
    }

    const rows = [];
    for (const rt of roomTypes) {
      for (const rp of ratePlans) {
        const data: Record<string, any> = {};
        for (const d of daysArr) {
          const k = `${rt.id}-${rp.id}-${d}`;
          const got = idx.get(k);
          data[d] = {
            price: got?.price != null ? Number(got.price) : null,
            allotment: got?.allotment ?? null,
          };
        }
        rows.push({
          room_type_id: rt.id,
          room_type_code: rt.code ?? String(rt.id),
          rate_plan_id: rp.id,
          rate_plan_code: rp.code ?? String(rp.id),
          data,
        });
      }
    }
    return { days: daysArr, rows };
  }

  async patchInventoryBulk(body: InventoryBulkPatchDto) {
    if (!body.items?.length) return { updated: 0 };
    const propertyIds = Array.from(new Set(body.items.map(i => i.property_id)));
    const properties = await this.prisma.property.findMany({
      where: { id: { in: propertyIds } },
      select: { id: true, tenantId: true },
    });
    const propTenantMap = new Map<number, number>();
    for (const p of properties) propTenantMap.set(p.id, p.tenantId);
    for (const pid of propertyIds) {
      if (!propTenantMap.has(pid)) throw new NotFoundException(`Property not found: ${pid}`);
    }
    const tx = body.items.map(i => {
      const date = this.parseYmd(i.date);
      const tenantId = propTenantMap.get(i.property_id)!;
      return this.prisma.inventoryDaily.upsert({
        where: {
          inventory_unique_per_day: {
            tenantId,
            propertyId: i.property_id,
            roomTypeId: i.room_type_id,
            ratePlanId: i.rate_plan_id,
            date,
          },
        },
        create: {
          tenantId,
          propertyId: i.property_id,
          roomTypeId: i.room_type_id,
          ratePlanId: i.rate_plan_id,
          date,
          price: i.price ?? null,
          allotment: i.allotment ?? null,
        },
        update: {
          ...(i.price !== undefined ? { price: i.price } : {}),
          ...(i.allotment !== undefined ? { allotment: i.allotment } : {}),
        },
      });
    });
    const res = await this.prisma.$transaction(tx);
    return { updated: res.length };
  }
}
