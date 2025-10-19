import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
@Injectable()
export class PropertyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    const propertyId =
      Number(req.query?.property_id) ||
      Number(req.body?.property_id) ||
      Number(req.params?.propertyId);
    if (!propertyId) return true;
    const prop = await this.prisma.property.findUnique({
      where: { id: propertyId },
      select: { tenantId: true },
    });
    if (!prop) return false;
    if (!user?.tenantId) return true;
    return prop.tenantId === user.tenantId;
  }
}
