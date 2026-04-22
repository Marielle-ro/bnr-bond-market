export type UserRole = 'investor' | 'broker';

export interface Investor {
  id: string;
  fullName: string;
  email: string;
  idNumber: string;
  password: string;
  role: 'investor';
}

export interface Broker {
  id: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  password: string;
  accountName: string;
  accountNumber: string;
  rdbCertificate: string;
  role: 'broker';
}

export type User = Investor | Broker;

export interface Bond {
  id: string;
  name: string;
  duration: string;
  interestRate: number;
  minInvestment: number;
  description: string;
  status: 'active' | 'inactive';
  brokerIds: string[];
}

export interface Payment {
  id: string;
  investorId: string;
  brokerId: string;
  bondId: string;
  amount: number;
  investorAccountNumber: string;
  status: 'pending' | 'completed';
  createdAt: string;
}
