# Hawai — Engineering Test Specification & Reliability Suite

## 1. System Overview & Test Philosophy

**Hawai** is an enterprise-grade airline management system engineered to support mission-critical flight discovery, real-time inventory management, transactional seat reservation, and resilient multi-channel payment processing.

In an airline reservation system, data consistency and concurrency guarantees are non-negotiable. Booking errors such as phantom seat holds, double bookings under high contention, or inconsistent state transitions during payment failure lead to inventory corruption and business losses.

This document outlines the **Engineering Test Specification & Reliability Assurance Plan** used to audit, stress-test, and benchmark the Hawai core workflows.

### Technology Stack Under Test
- **Backend**: Node.js, Express 5, TypeScript
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Validation & Auth**: Zod, JSON Web Tokens (JWT), BcryptJS
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS

### Core Workflows Under Test
1. **Flight Search & Filtering**: Multi-parameter search across routes, schedules, and pricing.
2. **Real-Time Seat Inventory & Allocation**: Dynamic seat map retrieval and seat reservation.
3. **Two-Phase Booking Lifecycle**: Booking initiation (`PENDING`) with transactional confirmation (`CONFIRMED`).
4. **Strategy-Based Payment Processing**: Pluggable payment strategies (UPI, Card, NetBanking).
5. **Atomic Cancellation & Inventory Reclamation**: Status transition with immediate seat release.

---

## 2. Test Objectives & SDE Evaluation Criteria

This test suite is designed to evaluate system reliability, design patterns, and concurrency correctness according to product-based Software Development Engineer (SDE) standards:

1. **Design Pattern Integrity**: Validate that the Strategy and Factory patterns provide genuine decoupling and OCP compliance without leaking gateway logic into booking services.
2. **Concurrency Safety**: Empirically stress-test simultaneous competing seat reservations to verify race condition immunity and eliminate duplicate seat allocations.
3. **Transactional Resilience**: Verify that booking and payment state machines preserve ACID guarantees during payment failures, network timeouts, and unexpected disconnections.
4. **Idempotency & Duplicate Protection**: Ensure repeated or replayed client requests do not cause duplicate reservations or multiple charges.
5. **Empirical Performance Benchmarking**: Establish baseline and optimized latency distributions (P50, P95, P99) and query execution metrics over reproducible sample sets.

---

## 3. Test Specification: Architecture & Request Lifecycle

Verify the separation of concerns across the request pipeline:

$$\text{Client / Browser} \xrightarrow{\text{JWT Auth}} \text{API Gateway / Express Router} \xrightarrow{\text{Zod Schema}} \text{Service Layer (Singletons)} \xrightarrow{\text{Prisma \$transaction}} \text{PostgreSQL}$$

### Inspection Criteria
- **Controller Decoupling**: Route handlers must only parse input and invoke service abstractions—never executing direct database queries.
- **Service Isolation**: Each service must maintain single responsibility (`FlightService`, `BookingService`, `PaymentService`, `PassengerService`).
- **Domain Modeling**: Domain objects must enforce encapsulation, keeping properties private and accessible only via defined accessors and mutators.

---

## 4. Test Specification: Strategy Pattern Extensibility

The payment system must isolate gateway-specific execution logic from the booking workflow via the `PaymentStrategy` interface.

### Extensibility Verification Protocol
1. **Common Abstraction**: Verify that `PaymentStrategy` exposes a uniform method contract:
   ```ts
   export interface PaymentStrategy {
     pay(amount: number): boolean;
   }
   ```
2. **Strategy Registry**: Validate that `PaymentFactory` manages strategy registration dynamically using an internal map without requiring switch-case statements.
3. **Zero-Touch Booking Workflow**: Simulate introducing a new payment method (e.g., `NetBankingPayment`). Measure:
   - Number of existing files modified.
   - Number of new files required.
   - Whether any line of `BookingService` or booking controllers required alteration.
   - Regression status of existing payment strategies.

---

## 5. Test Specification: Booking & Payment Failure Modes

### Scenario A: Happy Path (End-to-End Booking & Payment)
- **Input**: Valid user, available seat, valid payment payload.
- **Verification**:
  - Booking is created in `PENDING` state and advances to `CONFIRMED` upon payment completion.
  - Payment record status transitions to `COMPLETED`.
  - Seat `isBooked` flag is set to `true`.
  - Seat is immediately rendered unavailable to other queries.

### Scenario B: Payment Rejection / Failure
- **Input**: User initiates seat reservation; payment is rejected by gateway or submitted with invalid credentials.
- **Verification**:
  - The booking must **not** remain confirmed.
  - The reserved seat must be released (`isBooked: false`) back into inventory immediately.
  - No orphaned phantom locks should persist in the database.

### Scenario C: Payment Timeout & Network Disconnection
- **Input**: Simulate a gateway execution exceeding the timeout threshold.
- **Verification**:
  - Database operations inside `prisma.$transaction` must roll back completely.
  - Re-submitting the payment must check existing booking state to prevent double charges.

### Scenario D: Replay Attacks & Duplicate Submissions
- **Input**: Dispatch 3+ identical booking creation payloads simultaneously with identical flight, passenger, and seat parameters.
- **Verification**:
  - System must reject duplicate reservations without crashing or throwing unhandled 500 errors.
  - Response must return structured `409 Conflict`.

### Scenario E: High-Contention Concurrent Seat Reservations (Race Condition Stress Test)
- **Input**: Simulate 20 concurrent virtual customers attempting to reserve the **exact same seat** at the exact same millisecond.
- **Verification**:
  - **Exactly one** customer must secure the reservation (HTTP 201).
  - All **19 competing requests** must be rejected (HTTP 409 Conflict).
  - Under no circumstances may 2 or more bookings reference the same `(flightId, seatNumber)` combination.
  - Double-booking incident rate must equal **0%**.

### Scenario F: Booking Cancellation & Inventory Reclamation
- **Input**: Execute `PATCH /api/bookings/:id/cancel` on an existing confirmed booking.
- **Verification**:
  - Booking status transitions to `CANCELED`.
  - Associated seat is immediately marked `isBooked = false`.
  - The seat re-appears as available on the flight seat map in real time.

---

## 6. Test Specification: Database Consistency & Indexing

Inspect the PostgreSQL database layer for relational integrity:

1. **Foreign Key Constraints**: Cascade rules and relation integrity between `Aircraft`, `Flight`, `Seat`, `Booking`, `Payment`, and `Passenger`.
2. **Uniqueness Guarantees**: `@@unique([flightId, seatNumber])` constraint to prevent schema-level duplicate seat definitions.
3. **Indexing Coverage**:
   - `Flight`: Composite index on `[source, destination, departureTime]` to accelerate multi-attribute route searches.
   - `Seat`: Index on `[flightId, isBooked]` for real-time inventory scans.
   - `Booking`: Index on `[passengerId]` and `[flightId]` for customer itinerary and manifest lookups.
4. **Query Efficiency**: Verification that search listings do not eagerly load redundant relational sub-trees (e.g. omitting 1,000+ seat objects during high-level flight browsing).

---

## 7. Performance Benchmarking Methodology

To ensure statistically valid, reproducible measurements, latency testing follows these specifications:

- **Sample Size**: Minimum 50 consecutive requests per evaluated endpoint.
- **Measurement Tool**: High-resolution timer (`performance.now()`) with Node.js HTTP client harness.
- **Reported Percentiles**:
  - **P50**: Median user experience.
  - **P95**: Latency boundary for 95% of traffic.
  - **P99**: Tail latency under load spikes.
  - **Average, Min, Max**: Overall distribution metrics.
- **Metric Formulae**:
  - Latency Reduction:
    $$\Delta L = \left(\frac{\text{Baseline} - \text{Optimized}}{\text{Baseline}}\right) \times 100$$
  - Double-Booking Rate:
    $$\text{Error Rate} = \left(\frac{\text{Duplicate Allocations}}{\text{Total Concurrent Attempts}}\right) \times 100$$

---

## 8. Test Execution Command

To execute the test suite against the local or remote environment:

```bash
# Execute end-to-end reliability and benchmark test harness
npx tsx scratch/run_improved_tests.ts
```

All test outcomes, baseline measurements, optimization comparisons, and interview defense analyses are archived in **`Results.md`**.
