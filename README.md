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

### Encapsulation

Model classes keep their fields private and expose them only through getters. The service layer never touches raw fields directly.

```
Flight
──────────────────────────────────────
- flightId: String        (private)
- source: String          (private)
- destination: String     (private)
- departureTime: DateTime (private)
- arrivalTime: DateTime   (private)
- status: FlightStatus    (private)
- seats: List<Seat>       (private)
──────────────────────────────────────
+ getFlightId()
+ getSource()
+ getDestination()
+ getDepartureTime()
+ getArrivalTime()
+ getStatus()
+ getSeats()
```

Same pattern applies to `Booking`, `Seat`, `Passenger`, and `Payment` — fields are never accessed directly from outside the class.

---

### Abstraction

Services hide all database and business logic complexity behind clean method signatures. The caller only needs to know *what* a method does, not *how*.

```
FlightService
──────────────────────────────────────────────────────────
+ searchFlights(source, destination, date) → List<Flight>
+ getFlightDetails(flightId) → Flight
  │
  └── internally: Prisma queries, filtering, mapping

BookingService
──────────────────────────────────────────────────────────
+ createBooking(flightId, passenger, seatId) → Booking
+ cancelBooking(bookingId) → void
  │
  └── internally: seat availability check, payment trigger,
      seat reservation, status updates
```

---

### Polymorphism

`PaymentStrategy` is an interface. `PaymentService` calls `pay(amount)` on whichever strategy is passed in — it does not know or care whether it is UPI or Card.

```
<<interface>> PaymentStrategy
──────────────────────────────
+ pay(amount: double): boolean
        ▲                ▲
        │                │
  UPIPayment         CardPayment
  ─────────────      ─────────────
  + pay(amount)      + pay(amount)
    → calls UPI        → calls card
      gateway            gateway

PaymentService.processPayment(bookingId, strategy)
  └── strategy.pay(amount)   ← works for both
```

Adding a new method (e.g. `NetBankingPayment`) requires only a new class implementing the interface. `PaymentService` needs zero changes.

---

### Composition over Inheritance

`Booking` is built by holding references to other domain objects — it does not extend any of them. This keeps each class independent and replaceable.

```
Booking
──────────────────────────────────
- bookingId: String    (PK)
- flightId: String     (FK → Flight)
- passengerId: String  (FK → Passenger)
- seatId: String       (FK → Seat)
- status: BookingStatus
──────────────────────────────────

Booking HAS-A Flight       (not extends Flight)
Booking HAS-A Passenger    (not extends Passenger)
Booking HAS-A Seat         (not extends Seat)
Booking HAS-A Payment      (not extends Payment)
```

---

## Design Patterns

### Singleton

Every service class follows the same pattern — one shared instance for the entire application lifetime. This prevents multiple database connection pools being created and ensures consistent state.

```
BookingService <<Singleton>>
────────────────────────────────────────────────────────────────
- instance: BookingService (static, private)

+ getInstance(): BookingService
    └── if (instance == null) instance = new BookingService()
        return instance 

+ createBooking(flightId, passenger, seatId): Booking
+ cancelBooking(bookingId): void
────────────────────────────────────────────────────────────────

Same pattern in:
  FlightService    → getInstance()
  PaymentService   → getInstance()
```

---

### Strategy

The payment method is selected at runtime and passed into `PaymentService`. The service does not contain any `if (method === "UPI")` logic — it delegates entirely to the strategy object.

```
                    PaymentService
                    ─────────────────────────────────────────
                    + processPayment(bookingId, strategy)
                           │
                           └── strategy.pay(amount)
                                    │
              ┌────────────────────┴────────────────────┐
              │                                         │
        UPIPayment                               CardPayment
        ─────────────                            ─────────────
        + pay(amount)                            + pay(amount)
          → UPI gateway                           → card gateway

PaymentMethod enum: UPI | CARD
```

To add net banking tomorrow: create `NetBankingPayment` implementing `PaymentStrategy`.

---

### Repository

Services act as the only point of contact with the database. Route handlers never write Prisma queries — they call service methods and receive domain objects back.

```
Route handler                 BookingService               Prisma / DB
─────────────                 ────────────────             ───────────
POST /api/bookings
  │
  └── bookingService
        .createBooking(...)  →  prisma.booking.create()  →  INSERT INTO booking
                             ←  maps DB row to Booking   ←  row returned
        ← returns Booking
  ← sends JSON response
```

---

## SOLID Principles

### Single Responsibility

Each service class owns exactly one domain. No service reaches into another service's domain directly.

```
FlightService    → flights only    (search, details, status update)
BookingService   → bookings only   (create, cancel, confirm)
PaymentService   → payments only   (process, refund)
PassengerService → passengers only (create, update, lookup)
```

### Open / Closed

The system is open for extension but closed for modification. New payment methods extend the system without touching existing code.

```
BEFORE (bad — closed for extension):
  if (method === "UPI")  { ... }
  if (method === "CARD") { ... }   ← must edit this file to add new method

AFTER (correct — open for extension):
  strategy.pay(amount)             ← add new class, never edit this line
```

### Liskov Substitution

Any `PaymentStrategy` implementation can be swapped for another. The calling code behaves identically regardless of which concrete class is used.

```
PaymentService.processPayment(bookingId, new UPIPayment())
PaymentService.processPayment(bookingId, new CardPayment())
  ↑ both calls work identically — same method signature, same return type
```

### Interface Segregation

Interfaces are narrow and focused. `PaymentStrategy` defines only one method — `pay(amount)`. Implementations are not forced to define methods they do not use.

```
<<interface>> PaymentStrategy
──────────────────────────────
+ pay(amount: double): boolean   ← one method, one responsibility
```

### Dependency Inversion

Route handlers depend on service abstractions, not on Prisma or database internals. The database layer can be swapped (e.g. switching from SQLite to PostgreSQL) without touching a single route file.

```
Route handler
  └── depends on → BookingService (abstraction)
                       └── depends on → Prisma (detail)

                   ← Route never imports Prisma directly
```

---

## API Endpoints

| Method | Endpoint | Auth required |
|--------|----------|---------------|
| POST | `/api/auth/signup` | No |
| POST | `/api/auth/login` | No |
| POST | `/api/passengers` | Yes |
| PUT | `/api/passengers/:id` | Yes |
| POST | `/api/aircrafts` | No |
| PUT | `/api/aircrafts/:id` | No |
| POST | `/api/flights` | No |
| PATCH | `/api/flights/:id/status` | No |
| POST | `/api/bookings` | Yes |
| PATCH | `/api/bookings/:id/cancel` | Yes |
| POST | `/api/payments` | Yes |
| POST | `/api/payments/:id/refund` | Yes |

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
