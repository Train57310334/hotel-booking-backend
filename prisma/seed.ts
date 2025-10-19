import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.create({
    data: { name: "Demo Hotel Group" },
  });

  const property = await prisma.property.create({
    data: { name: "Demo Hotel Bangkok", tenantId: tenant.id },
  });

  const adminPass = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      fullName: "Admin",
      password: adminPass,
      tenantId: tenant.id,
      role: "ADMIN",
    },
  });

  const rt1 = await prisma.roomType.create({
    data: {
      tenantId: tenant.id,
      propertyId: property.id,
      code: "STD",
      name: "Standard",
      basePrice: 1500,
    },
  });
  const rt2 = await prisma.roomType.create({
    data: {
      tenantId: tenant.id,
      propertyId: property.id,
      code: "DLX",
      name: "Deluxe",
      basePrice: 2500,
    },
  });

  for (let i = 1; i <= 10; i++) {
    await prisma.room.create({
      data: {
        tenantId: tenant.id,
        propertyId: property.id,
        roomTypeId: i <= 6 ? rt1.id : rt2.id,
        roomNo: String(100 + i),
        status: "available",
      },
    });
  }

  const rp1 = await prisma.ratePlan.create({
    data: {
      tenantId: tenant.id,
      propertyId: property.id,
      code: "BAR",
      name: "Best Available",
    },
  });
  const rp2 = await prisma.ratePlan.create({
    data: {
      tenantId: tenant.id,
      propertyId: property.id,
      code: "NRF",
      name: "Non-Refundable",
    },
  });

  const g1 = await prisma.guest.create({
    data: {
      firstName: "Somchai",
      lastName: "Jaidee",
      email: "somchai@example.com",
    },
  });
  const g2 = await prisma.guest.create({
    data: { firstName: "Suda", lastName: "Srisuk", email: "suda@example.com" },
  });

  // sample reservation with 1-night stay
  const room = await prisma.room.findFirst({
    where: { propertyId: property.id },
  });
  if (room) {
    const res = await prisma.reservation.create({
      data: {
        tenantId: tenant.id,
        propertyId: property.id,
        guestId: g1.id,
        status: "booked",
        totalAmount: 1500,
      },
    });
    await prisma.stay.create({
      data: {
        reservationId: res.id,
        roomId: room.id,
        checkInDate: new Date().toISOString().slice(0, 10) + "T00:00:00.000Z",
        checkOutDate:
          new Date(Date.now() + 86400000).toISOString().slice(0, 10) +
          "T00:00:00.000Z",
        ratePlanId: rp1.id,
        pricePerNight: 1500,
      },
    });
  }

  console.log("Seed complete");
}

main().finally(() => prisma.$disconnect());
