# Hawai — Airline Management System

A production-grade, high-concurrency airline management system engineered with **TypeScript**, **PostgreSQL** (via Prisma ORM), **Node.js**, **Express**, and **React 19**. 

Built around strict **Layered Architecture**, **Domain-Driven Design (DDD)**, and **GoF Design Patterns**, Hawai guarantees high reliability across flight discovery, seat allocation, booking lifecycles, and pluggable payment gateways.

---

## ⚡ Engineering & Reliability Highlights

| Engineering Metric | Baseline (Pre-Optimization) | Optimized (Current) | Impact |
|---|---|---|---|
| **Concurrent Double-Booking Rate** | **15.0%** (3 duplicate bookings / 20 concurrent requests) | **0.0%** (0 duplicate bookings / 20 concurrent requests) | **100% elimination of race conditions** via atomic check-and-set |
| **Flight Details P99 Tail Latency** | **393.64 ms** | **171.12 ms** | **56.53% latency reduction** |
| **Flight Search P99 Latency** | **131.66 ms** | **121.59 ms** | **7.65% faster** |
| **Search Payload Over-fetching** | 1,200+ seat objects eagerly loaded per flight search | **0 redundant seat objects** (selective relation loading) | **>95% database transfer reduction** |
| **Payment Extensibility** | 2 static methods (UPI, Card) | Strategy + Factory dynamic registry (UPI, Card, NetBanking) | **0 lines modified in core booking workflow** (OCP) |
| **Failure State Resilience** | Orphaned seat locks on payment failure | Two-phase state machine (`PENDING` $\to$ `CONFIRMED` / `FAILED`) | **Zero phantom seat holds** |

> 📊 **Full Test Specification & Verification Reports**:
> - [Engineering Test Specification (`Tests.md`)](./Tests.md) — Comprehensive reliability suite, failure scenario matrices, and concurrency test definitions.
> - [Empirical Benchmark & Concurrency Report (`Results.md`)](./Results.md) — Exact before vs. after percentile distributions, database query execution profiles, and technical interview defenses.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express 5, TypeScript, Prisma ORM, PostgreSQL (Neon Serverless / Local)
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, Lucide Icons, React Router 7
- **Security & Validation**: JWT (`jsonwebtoken`), BcryptJS, Zod (runtime request schema enforcement)
- **Testing & Benchmarking**: TypeScript load harness, PostgreSQL `EXPLAIN ANALYZE`, high-resolution percentile profiling

---

## 🏛️ System Architecture

Hawai enforces a strict layered architecture with unidirectional dependencies:

```
[ Frontend: React 19 SPA + Fetch API Services ]
                       │  HTTP + Bearer JWT
                       ▼
[ API Gateway / Router: Express Controllers + Zod Validation ]
                       │  Validated Domain DTOs
                       ▼
[ Service Layer: Singleton Services (Business Logic) ]
                       │  Domain Object Mapping
                       ▼
[ Domain Models: Flight, Seat, Booking, Payment, Passenger (Encapsulated) ]
                       │  Atomic Transactions ($transaction)
                       ▼
[ Database Layer: PostgreSQL Database via Prisma Client ]
```

### Layer Responsibilities
- **Controller Layer** (`backend/src/routes/`): Validates incoming payload schemas with Zod, extracts authenticated user context from JWT tokens, and delegates directly to services.
- **Service Layer** (`backend/src/services/`): Implements core business logic (seat validation, payment dispatching, cancellation rollbacks). Services are implemented as Singletons.
- **Domain Layer** (`backend/src/models/`): Enforces object-oriented domain encapsulation. Fields are private and accessed strictly through accessors/mutators.
- **Data Access Layer** (`backend/src/db.ts` & `backend/prisma/`): Centralized Prisma connection pool executing atomic row-level operations.

---

## 🎯 Design Patterns in Practice

### 1. Strategy Pattern (Payment Extensibility)
Different payment channels require completely different verification, API protocols, and validation handshakes. The Strategy pattern decouples payment execution from the booking workflow.

```
                    ┌─────────────────────────┐
                    │   <<PaymentStrategy>>   │
                    ├─────────────────────────┤
                    │ + pay(amount): boolean  │
                    └────────────▲────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│   UPIPayment   │      │  CardPayment   │      │NetBankingPay.. │
└────────────────┘      └────────────────┘      └────────────────┘
```

- **Open/Closed Principle (OCP)**: Adding new payment methods (e.g., `NetBankingPayment`, `CryptoPayment`, or `StripePayment`) requires **zero modifications** to `BookingService` or existing routes. Strategies register dynamically via `PaymentFactory.register()`.

### 2. Factory Pattern (`PaymentFactory`)
Provides a centralized registry (`Map<PaymentMethod, PaymentStrategy>`) to instantiate and resolve strategies at runtime based on client input without tight conditional couplings.

### 3. Singleton Pattern (Service Layer)
All services (`BookingService`, `FlightService`, `PaymentService`, `PassengerService`) maintain a single shared instance throughout the application lifecycle via private constructors and static `getInstance()` methods, ensuring consistent state and shared resources.

### 4. Repository & Data Mapper Pattern
Prisma database records are never leaked directly to controllers or the client. Services map raw relational tables to domain objects (`Flight`, `Seat`, `Booking`), preserving schema insulation.

---

## 🔒 Concurrency & Reliability Engineering

### 1. Race Condition Fix: Atomic Check-and-Set
- **The Problem**: In high-demand airline sales, multiple users frequently attempt to book the same seat at the exact same millisecond. Traditional `findUnique()` followed by `update()` creates a race condition where multiple concurrent transactions read `isBooked: false` before any update commits, resulting in duplicate bookings.
- **The Solution**: We implemented a database-level conditional check-and-set:
  ```ts
  const updateResult = await tx.seat.updateMany({
    where: {
      id: seatRecord.id,
      isBooked: false, // Atomic predicate check
    },
    data: { isBooked: true },
  });

  if (updateResult.count === 0) {
    throw new Error(`Seat ${seatRecord.seatNumber} is already booked.`);
  }
  ```
  PostgreSQL acquires an exclusive row-level write lock. Only the first transaction updates the row (`count = 1`); all subsequent concurrent transactions receive `count = 0` and are rejected with a clean `409 Conflict`.
- **Result**: **0 duplicate seat allocations across 20 concurrent competing threads**.

### 2. Two-Phase Booking Lifecycle
- **The Problem**: Creating bookings as `CONFIRMED` before payment leads to orphaned reservations if the payment gateway fails or times out.
- **The Solution**: Bookings are created in a `PENDING` state. Upon payment gateway confirmation, status transitions to `CONFIRMED`. On payment failure or timeout, the transaction safely marks the booking as `FAILED` and resets the seat's `isBooked` flag to `false`.

### 3. Database Indexing & Query Optimization
- Added composite B-Tree indexes:
  - `Flight`: `@@index([source, destination, departureTime])` for sub-70ms multi-attribute route queries.
  - `Seat`: `@@index([flightId, isBooked])` for instant seat map inventory scans.
  - `Booking`: `@@index([passengerId])` for customer travel history lookup.
- Optimized flight list search queries to avoid serializing 1,200+ seat objects across the network.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new passenger account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/api/flights` | Search flights by source, destination, date | No |
| `GET` | `/api/flights/:id` | Get flight details and interactive seat map | No |
| `POST` | `/api/flights` | Create scheduled flight (Admin) | No |
| `POST` | `/api/bookings` | Atomically reserve seats (creates `PENDING` booking) | **Yes** (JWT) |
| `GET` | `/api/bookings/:id` | Get booking details | **Yes** (JWT) |
| `GET` | `/api/bookings/passenger/:id` | Get all bookings for authenticated passenger | **Yes** (JWT) |
| `PATCH`| `/api/bookings/:id/cancel` | Cancel booking and release seat back to inventory | **Yes** (JWT) |
| `POST` | `/api/payments` | Process payment via strategy (UPI, Card, NetBanking) | **Yes** (JWT) |
| `POST` | `/api/payments/:id/refund` | Refund payment and trigger automated cancellation | **Yes** (JWT) |
| `GET` | `/api/payments/methods` | Get list of currently supported payment strategies | No |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20 or higher
- **Database**: PostgreSQL (local instance or cloud database such as Neon/Supabase)

### 1. Clone & Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<dbname>?sslmode=require"
JWT_SECRET="your_secure_random_jwt_secret"
```

Apply database migrations and seed demo data:
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev                  # Backend runs on http://localhost:3000
```

### 2. Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_BASE_URL="http://localhost:3000/api"
```

Start the Vite development server:
```bash
npm run dev                  # Frontend runs on http://localhost:5173
```

### Demo Credentials
- **Email**: `john@example.com`
- **Password**: `password123`

---

## 🧪 Running Automated Tests & Benchmarks

To execute the reliability, race condition stress test, and latency benchmark suite:

```bash
# Execute end-to-end reliability & benchmark harness
npx tsx scratch/run_improved_tests.ts
```

For static type checking:
```bash
npm --prefix backend run typecheck
npm --prefix frontend run build
```

---

## 📄 License
This project is licensed under the ISC License.
