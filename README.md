
# Bond Payment Microservice — Technical Documentation

## Table of Contents
1. Overview
2. Architecture & Technology Stack
3. Backend
   - Core Features
   - Service Structure
   - Security
   - API Endpoints
   - Third-Party Integrations (planned/required)
   - Messaging (RabbitMQ)
   - Database
   - Testing
   - Limitations & Future Enhancements
4. Frontend
   - Core Features
   - Structure
   - State Management
   - API Integration
   - Testing
   - Limitations & Future Enhancements
5. Deployment & Environment
6. Onboarding & Contribution Guide

---

## 1. Overview

This project is a modular bond market platform for Rwanda, supporting the full lifecycle of government bond sales, broker management, investor onboarding, and payment processing. It is designed for extensibility, security, and integration with real-world financial and identity systems.

---

## 2. Architecture & Technology Stack

- **Backend:** Java (Spring Boot), PostgreSQL, RabbitMQ, JWT Security
- **Frontend:** React (TypeScript), Vite, Tailwind CSS
- **Messaging:** RabbitMQ (for async operations, e.g., payment events)
- **Database:** PostgreSQL (hosted on Supabase)
- **Containerization:** Docker, Docker Compose
- **Planned Integrations:** MTN Mobile Money, Flutterwave, Bank APIs, NIDA (ID verification), RDB (company verification)

---

## 3. Backend

### Core Features

- **Admin Management:** Admins can approve/reject brokers, view audit logs, manage bond types, and oversee all transactions.
- **Broker Management:** Brokers register, submit RDB certificates, and list bonds for sale. Approval is required by admin.
- **Investor Management:** Investors register, are verified, and can purchase bonds.
- **Bond Management:** Admins create/manage bond types, brokers list bonds, investors purchase bonds.
- **Payment Processing:** (Planned) Integration with real payment APIs (MTN, Flutterwave, banks).
- **Audit Logging:** All critical actions are logged for traceability.
- **Security:** JWT-based authentication, role-based access control, CORS configuration.

### Service Structure

- **Microservices:** Each core domain (purchase, payment, payout) is a separate Spring Boot service.
- **Controllers:** RESTful endpoints for each domain (admin, auth, broker, investor, bond, purchase, payment, payout).
- **Services:** Business logic for each domain, including validation, persistence, and event publishing.
- **Repositories:** JPA repositories for database access.
- **Security:** Centralized configuration with JWT filters and role-based endpoint protection.

### Security

- **JWT Authentication:** Stateless, secure, and scalable.
- **Role-Based Access:** Admin, Broker, Investor roles with fine-grained endpoint access.
- **CORS:** Configured for local development and production.

### API Endpoints

#### Auth
- `POST /api/auth/admin/login` — Admin login
- `POST /api/auth/investor/register` — Investor registration
- `POST /api/auth/investor/login` — Investor login
- `POST /api/auth/broker/register` — Broker registration
- `POST /api/auth/broker/login` — Broker login

#### Admin
- `GET /api/admin/brokers` — List all brokers (with status)
- `PUT /api/admin/brokers/{brokerId}/approve` — Approve broker
- `PUT /api/admin/brokers/{brokerId}/reject` — Reject broker
- `PUT /api/admin/brokers/{brokerId}/suspend` — Suspend broker
- `GET /api/admin/investors` — List all investors
- `GET /api/admin/bonds` — List all bond types
- `POST /api/admin/bonds` — Create bond type
- `PUT /api/admin/bonds/{bondTypeId}` — Update bond type
- `PUT /api/admin/bonds/{bondTypeId}/toggle` — Enable/disable bond type
- `GET /api/admin/audit-logs` — View audit logs

#### Broker
- `GET /api/auth/brokers` — List all approved brokers (public)
- `GET /api/broker/bonds` — List broker’s bond listings
- `POST /api/broker/bonds` — Add bond listing

#### Investor
- `GET /api/auth/investors` — List all investors (admin)
- `GET /api/purchases/my-bonds` — Investor’s bond portfolio

#### Payment & Payout
- `POST /api/payments` — Initiate payment (to be integrated with real APIs)
- `GET /api/payouts` — List payouts

### Third-Party Integrations (Planned)

- **MTN Mobile Money, Flutterwave, Bank APIs:** Replace current stubs/RabbitMQ events with real API calls for payment initiation and status updates.
- **NIDA (National ID Agency):** Integrate with NIDA API to verify investor identities during registration.
- **RDB (Rwanda Development Board):** Integrate with RDB API to validate broker company registration numbers during broker onboarding.

**How to Integrate:**
- Replace RabbitMQ event publishing in payment and verification services with direct API calls to the respective third-party.
- Update response structures to match real API responses.
- Add error handling and reconciliation logic for asynchronous payment/verification callbacks.

### Messaging (RabbitMQ)

- Used for decoupling payment and payout events.
- Replace with direct API calls as real integrations become available.

### Database

- **PostgreSQL:** All user, bond, transaction, and audit data is persisted.
- **Seeding:** Admin user is seeded from .env on first run. If you change credentials, rebuild/restart the backend.

### Testing

- **Unit & Integration Tests:** (Spring Boot test framework)
- **Feature Tests:** See FEATURE_TEST_RESULTS.md and TEST_RESULTS.md for endpoint coverage and workflow validation.
- **Manual Test Cases:** Admin login, broker registration/approval, investor registration, bond purchase, payment initiation, payout processing.

### Limitations & Future Enhancements

- **Current Limitations:**
  - Payment and verification integrations are mocked/stubbed (RabbitMQ).
  - No real-time notifications (can be added via WebSockets or polling).
  - Error handling is basic; needs improvement for production.
  - No multi-language or accessibility support in frontend.
  - No advanced reporting or analytics yet.

- **Future Enhancements:**
  - Integrate real MTN, Flutterwave, bank APIs for payments.
  - Integrate NIDA and RDB APIs for identity and company verification.
  - Add real-time notifications for status updates.
  - Improve audit logging and reporting.
  - Enhance security (rate limiting, 2FA, etc.).
  - Add admin UI for system configuration and monitoring.
  - Refactor for microservice deployment if scaling is needed.

---

## 4. Frontend

### Core Features

- **Admin Dashboard:** Approve/reject brokers, view investors, manage bonds, view audit logs.
- **Broker Dashboard:** Register, submit RDB certificate, list bonds, view sales.
- **Investor Dashboard:** Register, view/purchase bonds, see receipts.
- **Authentication:** Role-based login and registration flows.
- **Responsive UI:** Built with Tailwind CSS for modern look and feel.

### Structure

- **Pages:** Each dashboard and workflow is a separate page/component.
- **Context:** AuthContext manages user state, brokers, investors, and admin data.
- **Services:** API service centralizes all backend communication.
- **Mock Data:** Used for development; replaced by real API calls in production.

### State Management

- **React Context:** Used for authentication and global state.
- **Hooks:** Custom hooks for data fetching and actions.

### API Integration

- **Centralized API Service:** Handles all HTTP requests, token management, and error handling.
- **Manual Refresh:** Admin dashboard includes a refresh button to reload brokers/investors.

### Testing

- **Manual Testing:** All workflows tested via UI.
- **Automated Testing:** (To be added) — recommend using React Testing Library and Cypress for end-to-end tests.

### Limitations & Future Enhancements

- **Current Limitations:**
  - No real-time updates (requires manual refresh).
  - Error messages can be improved for clarity.
  - No advanced filtering/search for large datasets.
  - Accessibility and mobile optimization can be improved.

- **Future Enhancements:**
  - Add real-time updates (WebSockets or polling).
  - Integrate with real payment and verification APIs.
  - Add advanced filtering, search, and reporting.
  - Improve accessibility and mobile responsiveness.

---

## 5. Deployment & Environment

- **Docker Compose:** Used for local and production deployment.
- **.env Files:** Store all secrets and configuration (DB, JWT, admin credentials).
- **Rebuilding:** After changing .env, always rebuild/restart containers.

---

## 6. Onboarding & Contribution Guide

- **Setup:** Clone repo, configure .env, run `docker-compose up --build`.
- **Development:** Use feature branches, submit PRs for review.
- **Testing:** Run backend and frontend tests before merging.
- **Extending:** Follow existing service/component structure for new features.
- **Integrating Real APIs:** Replace RabbitMQ stubs with real API calls, update response handling, and test thoroughly.

---

## Summary

This project is a robust foundation for a digital bond market platform, designed for extensibility and real-world integration. The codebase is modular, well-structured, and ready for production enhancements. New contributors should read this document, review the code for specific logic, and follow the contribution guide for smooth onboarding.


