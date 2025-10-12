
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatePlansService {
  constructor(private prisma: PrismaService){}
  list(){ return this.prisma.ratePlan.findMany({ orderBy: { id: 'desc' } }); }
  create(data:any){ return this.prisma.ratePlan.create({ data: {
    tenantId: data.tenant_id ?? 1, propertyId: data.property_id ?? 1, code: data.code, name: data.name
  }}); }
  update(id:number,data:any){ return this.prisma.ratePlan.update({ where:{ id }, data: {
    tenantId: data.tenant_id ?? 1, propertyId: data.property_id ?? 1, code: data.code, name: data.name
  }}); }
  delete(id:number){ return this.prisma.ratePlan.delete({ where:{ id } }); }
}
