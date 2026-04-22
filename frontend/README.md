# BNR BondMarket — Setup Guide

## Quick Start

```bash
# 1. Navigate into the project
cd bonds-app

# 2. Install dependencies
npm install

# 3. Start the app
npm start
```

App runs at http://localhost:3000

---

## Project Structure

```
bonds-app/
├── src/
│   ├── types/index.ts          # TypeScript types (User, Bond, Broker, etc.)
│   ├── data/mockData.ts        # Sample bonds and brokers
│   ├── context/AuthContext.tsx # Auth state (login, register, logout)
│   ├── pages/
│   │   ├── LandingPage.tsx     # Home — shows active bonds
│   │   ├── LoginPage.tsx       # Shared login for investors & brokers
│   │   ├── InvestorRegisterPage.tsx
│   │   ├── BrokerRegisterPage.tsx
│   │   ├── BondDetailPage.tsx  # Bond info + broker list
│   │   └── PaymentPage.tsx     # Payment flow
│   ├── App.tsx                 # Routing / navigation
│   └── index.css               # Global styles (navy & gold theme)
```

## Test Accounts

**Investor:**
- Email: jp@gmail.com
- Password: password123

**Brokers:**
- Email: info@kigalicapital.rw / password123
- Email: contact@rwandainvest.rw / password123
- Email: hello@umutanguha.rw / password123

## User Flow

1. **Landing page** → view all active bonds
2. **Click a bond** → see bond details + list of brokers
3. **Select a broker** → go to payment page (must be logged in)
4. **Payment page** → see broker account number, enter your account + amount
5. **Submit** → confirmation screen

## Pages & Features

| Page | Route/State | Description |
|------|-------------|-------------|
| Home | `home` | Active bonds grid |
| Login | `login` | Email + password (shared) |
| Investor Register | `investor-register` | Full name, email, ID, password |
| Broker Register | `broker-register` | Company info, bank details, RDB cert |
| Bond Detail | `bond-detail` | Bond info + broker list |
| Payment | `payment` | Broker account shown, investor enters their account + amount |
