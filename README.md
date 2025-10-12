
# Hotel Booking Backend (NestJS + Prisma) — Full API

## Quick Start
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run start:dev
# API at http://localhost:3000
```

### Default account
- email: admin@example.com
- password: admin123

## Endpoints
- POST /auth/register { email, full_name, password }
- POST /auth/login { email, password } -> { token }

- GET /guests
- POST /guests
- PUT /guests/:id
- DELETE /guests/:id

- GET /rooms
- POST /rooms
- PUT /rooms/:id
- DELETE /rooms/:id

- GET /rate-plans
- POST /rate-plans
- PUT /rate-plans/:id
- DELETE /rate-plans/:id

- GET /reservations/:propertyId
- POST /reservations { tenant_id, property_id, guest_id, room_type_id, rate_plan_id, check_in_date, check_out_date }

- GET /housekeeping/rooms?property_id=1&date=YYYY-MM-DD
- POST /housekeeping/status { tenant_id, property_id, room_id, date, status }

- GET /reports/summary?property_id=1&start=YYYY-MM-DD&end=YYYY-MM-DD

- GET /inventory?property_id=1&start=YYYY-MM-DD&end=YYYY-MM-DD
- PATCH /inventory/bulk { items: [{ property_id, room_type_id, rate_plan_id, date, price?, allotment? }] }

> Database: SQLite (prisma/dev.db). Adjust in prisma/schema.prisma if needed.
