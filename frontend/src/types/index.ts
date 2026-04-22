export type Role = 'ADMIN' | 'BROKER' | 'INVESTOR';
export interface AuthResponse { token: string; role: Role; }

export interface BondType {
  id: string;
  name: string;
  durationYears: number;
  couponRate: number;
  minInvestment: number;
  isActive: boolean;
}

export interface Broker {
  id: string;
  companyName: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  contactPhone: string;
  collectionAccountName: string;
  collectionAccountNumber: string;
  rdbCertificateName?: string;
}

export interface BrokerBondListing {
  id: string;
  brokerId: string;
  bondTypeId: string;
  brokerCompanyName: string;
  bondName: string;
  durationYears: number;
  couponRate: number;
  minInvestment: number;
  brokerFee: number;
  initialQuantity: number;
  quantityAvailable: number;
  contactPhone: string;
}

export interface Investment {
  id: string;
  investorId: string; // internal — used for filtering per investor
  bondName: string;
  amountInvested: number;
  interestRate: number;
  durationYears: number;
  bondNumber: string;
  purchaseDate: string;
  brokerCompanyName: string;
  nextPayoutDate: string;
  expectedInterestAmount: number;
}

export interface Receipt {
  id: string;
  investmentId: string;
  investorName: string;
  brokerCompanyName: string;
  totalPaid: number;
  date: string;
  collectionAccountName?: string;
  collectionAccountNumber?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

// Analytics
export interface MonthlyBrokerSales { month: string; totalSales: number; bondsSold: number; }
export interface BrokerMonthlyMetrics { brokerName: string; totalSales: number; bondsSold: number; }

// User models
export interface Investor { id: string; fullName: string; email: string; nationalId: string; payoutAccount: string; }
export interface BrokerUser extends Broker {}
export interface Admin { id: string; fullName: string; email: string; }
export type AppUser = { role: Role } & (Investor | BrokerUser | Admin);
