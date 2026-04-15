# BNR Payment Backend — Microservices

A Spring Boot microservices backend for BNR Bond Market payment processing.
Simulates MoMo and Bank payments, with RabbitMQ-based async communication
and automatic 6-month coupon payouts to investors.

---

## Architecture

```
bond-purchase-service (port 8081)
    │
    ├──► [payment.queue] ──► payment-service (port 8082)
    │                             ├── MoMoPaymentService  (collects from investor)
    │                             └── BankPaymentService  (collects from investor)
    │
    └──► [payout.queue]  ──► payout-service  (port 8083)
                                  ├── MoMoPayoutService   (sends to investor every 6 months)
                                  └── BankPayoutService   (sends to investor every 6 months)
```

---

## Services

| Service               | Port | Role                                      |
|-----------------------|------|-------------------------------------------|
| bond-purchase-service | 8081 | Bond purchase API + JWT auth + scheduler  |
| payment-service       | 8082 | Consumes payment.queue (MoMo / Bank)      |
| payout-service        | 8083 | Consumes payout.queue (MoMo / Bank)       |

---

## Prerequisites

- Java 17+
- Maven 3.8+
- Docker (for RabbitMQ)
- IntelliJ IDEA

---

## Step 1 — Start RabbitMQ

```bash
docker-compose up -d
```

RabbitMQ Management UI: http://localhost:15672
- Username: `guest`
- Password: `guest`

---

## Step 2 — Open in IntelliJ

1. **File → Open** → select the root `bnr-payment-backend` folder
2. IntelliJ will detect the multi-module Maven project
3. Let it import all dependencies

---

## Step 3 — Run the Services

Run each service's main class in order:

1. `BondPurchaseServiceApplication` (port 8081)
2. `PaymentServiceApplication`      (port 8082)
3. `PayoutServiceApplication`       (port 8083)

Each has its own run configuration in IntelliJ.

---

## Step 4 — Test with Postman

### Register a user
```
POST http://localhost:8081/api/auth/register
Content-Type: application/json

{
  "fullName": "Jean Bosco",
  "email": "jean@example.com",
  "password": "password123",
  "role": "INVESTOR"
}
```

### Login
```
POST http://localhost:8081/api/auth/login
Content-Type: application/json

{
  "email": "jean@example.com",
  "password": "password123"
}
```
→ Copy the `token` from the response.

### Purchase a Bond (MoMo)
```
POST http://localhost:8081/api/bonds/purchase
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "investorId": "INV-001",
  "investorPhone": "0781234567",
  "investorAccount": "1002003004",
  "paymentMethod": "MOMO",
  "amount": 500000,
  "currency": "RWF",
  "termMonths": 12,
  "interestRate": 0.075
}
```

### Purchase a Bond (Bank)
```
POST http://localhost:8081/api/bonds/purchase
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "investorId": "INV-002",
  "investorPhone": "0781234567",
  "investorAccount": "1002003004",
  "paymentMethod": "BANK",
  "amount": 1000000,
  "currency": "RWF",
  "termMonths": 24,
  "interestRate": 0.085
}
```

### View All Bonds
```
GET http://localhost:8081/api/bonds/all
Authorization: Bearer <your_token>
```

### View Payment Records
```
GET http://localhost:8082/api/payments/all
GET http://localhost:8082/api/payments/investor/INV-001
GET http://localhost:8082/api/payments/status/SUCCESS
```

### View Payout Records
```
GET http://localhost:8083/api/payouts/all
GET http://localhost:8083/api/payouts/investor/INV-001
```

### Admin Login (pre-seeded)
```
POST http://localhost:8081/api/auth/login

{
  "email": "admin@bnr.rw",
  "password": "test123"
}
```

---

## 6-Month Payout Scheduler

The `PayoutScheduler` in `bond-purchase-service` runs automatically every 6 months
(cron: `0 0 0 1 */6 *`) and sends coupon payouts to all active bond investors.

**To test immediately**, change the cron in `PayoutScheduler.java` to:
```java
@Scheduled(cron = "0 * * * * *")  // every minute
```

The semi-annual coupon formula:
```
coupon = (principal × annualRate) / 2
```

---

## Database Tables (auto-created by Hibernate)

| Table           | Service               | Description                  |
|-----------------|-----------------------|------------------------------|
| users           | bond-purchase-service | Investors and admins         |
| bond_purchases  | bond-purchase-service | All bond purchase records    |
| payment_records | payment-service       | MoMo/Bank collection records |
| payout_records  | payout-service        | 6-month coupon disbursements |

---

## Dead-Letter Queues

Failed messages are automatically routed to:
- `payment.dlq` — failed payment processing
- `payout.dlq`  — failed payout processing

Monitor them in the RabbitMQ Management UI at http://localhost:15672.

---

## Environment Variables

All config is in `application.properties` of each service.
The Supabase DB credentials and JWT secret are already set to match
the bond-purchase-service `.env` from your colleague's project.
