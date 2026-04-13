# Hawai Airline Management System

A full-stack airline management system built with TypeScript, PostgreSQL (via Prisma), React, and Express. Covers flight search, seat selection, booking, payment processing, and cancellations — structured around OOP principles, design patterns, and a layered architecture.

---

## Tech Stack

**Backend** — Node.js, Express, TypeScript, Prisma, PostgreSQL (production) / SQLite (development), JWT, Bcrypt, Zod

**Frontend** — React 19, TypeScript, Vite, Tailwind CSS, React Router

**Tools** — Prisma Studio, TSX

---

## Architecture

The system follows a strict layered architecture where each layer has a single responsibility and depends only on the layer below it.

```
Frontend (React pages + service calls)
        |
REST API (Express routes)
        |
Services (business logic — Singletons)
        |
Domain Models (Flight, Booking, Seat, Payment, Passenger)
        |
Prisma ORM → PostgreSQL / SQLite
```

---

## Project Structure

```
Hawai/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── models/         # Domain classes (Flight, Booking, Seat, etc.)
│       ├── services/       # Business logic — Singleton pattern
│       ├── routes/         # API route handlers
│       └── middleware/     # Auth (JWT verification)
├── frontend/
│   └── src/
│       ├── pages/          # Home, Flights, Booking, Payment, My Bookings
│       ├── components/
│       └── services/       # API call wrappers
├── diagram/                # Class, Sequence, ER, and Use Case diagrams
└── README.md
```

---

## Features

- Authentication — signup and login with JWT
- Flight search by source, destination, and date
- Seat browsing and selection with real-time availability
- Booking with atomic transactions (payment confirmed before seat reserved)
- Payment processing via Strategy pattern (UPI, Card)
- View and cancel existing bookings

---

## OOP Design

**Encapsulation** — model classes (Flight, Booking, Seat) keep fields private and expose them through getters, hiding internal state from the service layer.

**Abstraction** — services expose clean method signatures (e.g. `bookFlight`, `cancelBooking`) and hide all Prisma query details behind them.

**Polymorphism** — the `PaymentStrategy` interface is implemented by `UPIPayment` and `CardPayment`. The payment service works against the interface, not the concrete class.

**Composition over inheritance** — `Booking` holds references to `Flight`, `Seat`, `Passenger`, and `Payment` rather than extending any of them.

---

## Design Patterns

**Singleton** — every service class (`FlightService`, `BookingService`, `PaymentService`, `PassengerService`) has a private constructor, a static `instance` field, and a `getInstance()` method. This ensures one shared instance per service across the application lifetime and avoids redundant database connection overhead.

**Strategy** — `PaymentStrategy` defines a `processPayment(amount)` interface. `UPIPayment` and `CardPayment` are concrete implementations. Adding a new payment method (e.g. net banking) requires only a new class — no changes to existing code.

**Repository** — services act as repositories, handling all CRUD operations and mapping between Prisma database records and domain model instances. The rest of the application never writes a raw query.

---

## SOLID Principles

**Single Responsibility** — `BookingService` manages bookings only. `PaymentService` manages payments only. No service crosses domain boundaries.

**Open/Closed** — new payment methods are added by implementing `PaymentStrategy`, not by modifying `PaymentService`.

**Liskov Substitution** — any `PaymentStrategy` implementation can replace another without the calling code needing to change.

**Interface Segregation** — interfaces are kept focused. Services expose only the methods relevant to their domain.

**Dependency Inversion** — routes depend on service interfaces and domain models, not on Prisma internals or raw SQL.

---

## Database Design

Models and their relationships:

```
Passenger ──< Booking >── Flight
                |
               Seat (reserved per booking, locked via SELECT FOR UPDATE)
                |
             Payment (confirmed before seat is reserved)

Flight ──< Seat
Flight >── Aircraft
```

Key design decisions:
- `(seat_number, flight_id)` is a composite primary key on the Seat table — the same seat number can exist across different flights
- Payment is processed and confirmed before a seat reservation is written — if payment fails, no seat row is touched
- Seat reservation uses row-level locking to handle concurrent booking attempts safely

---

## API Endpoints

| Method | Endpoint | Auth required |
|--------|----------|---------------|
| POST | `/api/auth/signup` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/flights` | No |
| GET | `/api/flights/:id/seats` | No |
| POST | `/api/bookings` | Yes |
| GET | `/api/bookings` | Yes |
| DELETE | `/api/bookings/:id` | Yes |
| POST | `/api/payments` | Yes |

---

## Setup

**Prerequisites** — Node.js 20 or higher, PostgreSQL (optional for local dev — SQLite works out of the box)

**Backend**

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"   # SQLite for local dev
# DATABASE_URL="postgresql://user:password@localhost:5432/hawai_db"  # PostgreSQL for prod
JWT_SECRET="your_secret_here"
```

```bash
npx prisma generate
npx prisma migrate dev
npm run dev                    # runs on port 3000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev                    # runs on port 5173
```

---

## Testing

Type checking:

```bash
npm run typecheck
```

API tests — import `backend/api-tests.http` into VS Code REST Client or Postman and run the request collection against the running backend.

---

## Diagrams

All system diagrams are in the `/diagram` folder:

- Class diagram — full domain model with relationships and method signatures
- Sequence diagram — booking flow (search, payment-first seat reservation, confirmation, cancellation)
- ER diagram — database schema with keys and cardinality
- Use case diagram — actor interactions (Passenger, Admin, Payment Processor)

---

## Planned Improvements

- Stripe payment gateway integration
- Docker and docker-compose setup for one-command deployment
- Expanded test coverage (unit tests for services, integration tests for booking flow)
- Admin dashboard for managing flights and monitoring bookings
