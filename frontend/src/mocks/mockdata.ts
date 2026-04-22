import {
  BondType, Broker, Investor, Admin, Investment,
  Receipt, BrokerBondListing, MonthlyBrokerSales, BrokerMonthlyMetrics, AuditLog,
} from "../types";

export const mockBondTypes: BondType[] = [
  { id: "bt1", name: "3-Year Government Bond",     durationYears: 3, couponRate: 8.5, minInvestment: 100000, isActive: true  },
  { id: "bt2", name: "5-Year Infrastructure Bond", durationYears: 5, couponRate: 9.2, minInvestment: 100000, isActive: true  },
  { id: "bt3", name: "2-Year Development Bond",    durationYears: 2, couponRate: 7.8, minInvestment: 100000, isActive: true  },
];

export const mockBrokers: Broker[] = [
  {
    id: "b1", companyName: "Kigali Capital Partners", email: "info@kigalicapital.rw",
    status: "APPROVED", contactPhone: "+250 788 100 200",
    collectionAccountName: "Kigali Capital Partners Ltd", collectionAccountNumber: "4001-0023-8821",
    rdbCertificateName: "rdb-certificate-kigali-capital.pdf",
  },
  {
    id: "b2", companyName: "Umutanguha Finance", email: "hello@umutanguha.rw",
    status: "APPROVED", contactPhone: "+250 722 500 600",
    collectionAccountName: "Umutanguha Finance Ltd", collectionAccountNumber: "4003-0067-1122",
    rdbCertificateName: "rdb-certificate-umutanguha.pdf",
  },
  {
    id: "b3", companyName: "Rwanda Investment Group", email: "contact@rwandainvest.rw",
    status: "PENDING", contactPhone: "+250 788 300 400",
    collectionAccountName: "Rwanda Investment Group Ltd", collectionAccountNumber: "4002-0045-9934",
    rdbCertificateName: "rdb-certificate-rwanda-invest.pdf",
  },
];

export const mockInvestors: Investor[] = [
  { id: "i1", fullName: "Jean Pierre Habimana",  email: "jp@gmail.com",        nationalId: "1199780012345678", payoutAccount: "1234567890" },
  { id: "i2", fullName: "Marie Claire Uwimana",  email: "marie.c@gmail.com",   nationalId: "1199790045678901", payoutAccount: "0987654321" },
  { id: "i3", fullName: "Alain Mugisha",          email: "alain.m@gmail.com",   nationalId: "1199800056789012", payoutAccount: "1122334455" },
  { id: "i4", fullName: "Diane Ishimwe",          email: "diane.i@gmail.com",   nationalId: "1199850067890123", payoutAccount: "5566778899" },
  { id: "i5", fullName: "Patrick Nkurunziza",     email: "patrick.n@gmail.com", nationalId: "1199750078901234", payoutAccount: "9988776655" },
];

export const mockAdmins: Admin[] = [
  { id: "a1", fullName: "Jean Baptiste Mutsinzi", email: "admin@bnrbondmarket.rw" },
];

export const mockBrokerBondListings: BrokerBondListing[] = [
  { id: "bbl1", brokerId: "b1", bondTypeId: "bt1", brokerCompanyName: "Kigali Capital Partners", bondName: "3-Year Government Bond",     durationYears: 3, couponRate: 8.5, minInvestment: 100000, brokerFee: 5000, initialQuantity: 100, quantityAvailable: 85, contactPhone: "+250 788 100 200" },
  { id: "bbl2", brokerId: "b1", bondTypeId: "bt2", brokerCompanyName: "Kigali Capital Partners", bondName: "5-Year Infrastructure Bond", durationYears: 5, couponRate: 9.2, minInvestment: 100000, brokerFee: 7000, initialQuantity: 50,  quantityAvailable: 42, contactPhone: "+250 788 100 200" },
  { id: "bbl3", brokerId: "b1", bondTypeId: "bt3", brokerCompanyName: "Kigali Capital Partners", bondName: "2-Year Development Bond",    durationYears: 2, couponRate: 7.8, minInvestment: 100000, brokerFee: 4000, initialQuantity: 80,  quantityAvailable: 72, contactPhone: "+250 788 100 200" },
  { id: "bbl4", brokerId: "b2", bondTypeId: "bt1", brokerCompanyName: "Umutanguha Finance",       bondName: "3-Year Government Bond",     durationYears: 3, couponRate: 8.5, minInvestment: 100000, brokerFee: 4500, initialQuantity: 75,  quantityAvailable: 60, contactPhone: "+250 722 500 600" },
  { id: "bbl5", brokerId: "b2", bondTypeId: "bt2", brokerCompanyName: "Umutanguha Finance",       bondName: "5-Year Infrastructure Bond", durationYears: 5, couponRate: 9.2, minInvestment: 100000, brokerFee: 6500, initialQuantity: 60,  quantityAvailable: 48, contactPhone: "+250 722 500 600" },
  { id: "bbl6", brokerId: "b2", bondTypeId: "bt3", brokerCompanyName: "Umutanguha Finance",       bondName: "2-Year Development Bond",    durationYears: 2, couponRate: 7.8, minInvestment: 100000, brokerFee: 3500, initialQuantity: 90,  quantityAvailable: 78, contactPhone: "+250 722 500 600" },
];

export const mockInvestments: Investment[] = [
  { id: "inv1",  investorId: "i1", bondName: "3-Year Government Bond",     amountInvested: 500000,  interestRate: 8.5, durationYears: 3, bondNumber: "BOND-2024-001", purchaseDate: "2024-01-15", brokerCompanyName: "Kigali Capital Partners", nextPayoutDate: "2024-07-15", expectedInterestAmount: 127500 },
  { id: "inv2",  investorId: "i1", bondName: "5-Year Infrastructure Bond", amountInvested: 1000000, interestRate: 9.2, durationYears: 5, bondNumber: "BOND-2024-002", purchaseDate: "2024-02-20", brokerCompanyName: "Kigali Capital Partners", nextPayoutDate: "2024-08-20", expectedInterestAmount: 460000 },
  { id: "inv3",  investorId: "i2", bondName: "3-Year Government Bond",     amountInvested: 300000,  interestRate: 8.5, durationYears: 3, bondNumber: "BOND-2024-003", purchaseDate: "2024-01-28", brokerCompanyName: "Umutanguha Finance",       nextPayoutDate: "2024-07-28", expectedInterestAmount: 76500  },
  { id: "inv4",  investorId: "i2", bondName: "2-Year Development Bond",    amountInvested: 250000,  interestRate: 7.8, durationYears: 2, bondNumber: "BOND-2024-004", purchaseDate: "2024-03-05", brokerCompanyName: "Kigali Capital Partners", nextPayoutDate: "2024-09-05", expectedInterestAmount: 39000  },
  { id: "inv5",  investorId: "i3", bondName: "5-Year Infrastructure Bond", amountInvested: 750000,  interestRate: 9.2, durationYears: 5, bondNumber: "BOND-2024-005", purchaseDate: "2024-02-10", brokerCompanyName: "Kigali Capital Partners", nextPayoutDate: "2024-08-10", expectedInterestAmount: 345000 },
  { id: "inv6",  investorId: "i3", bondName: "3-Year Government Bond",     amountInvested: 400000,  interestRate: 8.5, durationYears: 3, bondNumber: "BOND-2024-006", purchaseDate: "2024-03-18", brokerCompanyName: "Umutanguha Finance",       nextPayoutDate: "2024-09-18", expectedInterestAmount: 102000 },
  { id: "inv7",  investorId: "i4", bondName: "5-Year Infrastructure Bond", amountInvested: 500000,  interestRate: 9.2, durationYears: 5, bondNumber: "BOND-2024-007", purchaseDate: "2024-04-02", brokerCompanyName: "Umutanguha Finance",       nextPayoutDate: "2024-10-02", expectedInterestAmount: 230000 },
  { id: "inv8",  investorId: "i4", bondName: "2-Year Development Bond",    amountInvested: 200000,  interestRate: 7.8, durationYears: 2, bondNumber: "BOND-2024-008", purchaseDate: "2024-04-15", brokerCompanyName: "Kigali Capital Partners", nextPayoutDate: "2024-10-15", expectedInterestAmount: 31200  },
  { id: "inv9",  investorId: "i5", bondName: "3-Year Government Bond",     amountInvested: 600000,  interestRate: 8.5, durationYears: 3, bondNumber: "BOND-2024-009", purchaseDate: "2024-03-25", brokerCompanyName: "Kigali Capital Partners", nextPayoutDate: "2024-09-25", expectedInterestAmount: 153000 },
  { id: "inv10", investorId: "i5", bondName: "5-Year Infrastructure Bond", amountInvested: 800000,  interestRate: 9.2, durationYears: 5, bondNumber: "BOND-2024-010", purchaseDate: "2024-05-01", brokerCompanyName: "Umutanguha Finance",       nextPayoutDate: "2024-11-01", expectedInterestAmount: 368000 },
];

export const mockReceipts: Receipt[] = [
  { id: "r1",  investmentId: "inv1",  investorName: "Jean Pierre Habimana", brokerCompanyName: "Kigali Capital Partners", totalPaid: 505000,  date: "2024-01-15", collectionAccountName: "Kigali Capital Partners Ltd", collectionAccountNumber: "4001-0023-8821" },
  { id: "r2",  investmentId: "inv2",  investorName: "Jean Pierre Habimana", brokerCompanyName: "Kigali Capital Partners", totalPaid: 1007000, date: "2024-02-20", collectionAccountName: "Kigali Capital Partners Ltd", collectionAccountNumber: "4001-0023-8821" },
  { id: "r3",  investmentId: "inv3",  investorName: "Marie Claire Uwimana", brokerCompanyName: "Umutanguha Finance",       totalPaid: 304500,  date: "2024-01-28", collectionAccountName: "Umutanguha Finance Ltd",       collectionAccountNumber: "4003-0067-1122" },
  { id: "r4",  investmentId: "inv4",  investorName: "Marie Claire Uwimana", brokerCompanyName: "Kigali Capital Partners", totalPaid: 254000,  date: "2024-03-05", collectionAccountName: "Kigali Capital Partners Ltd", collectionAccountNumber: "4001-0023-8821" },
  { id: "r5",  investmentId: "inv5",  investorName: "Alain Mugisha",         brokerCompanyName: "Kigali Capital Partners", totalPaid: 757000,  date: "2024-02-10", collectionAccountName: "Kigali Capital Partners Ltd", collectionAccountNumber: "4001-0023-8821" },
  { id: "r6",  investmentId: "inv6",  investorName: "Alain Mugisha",         brokerCompanyName: "Umutanguha Finance",       totalPaid: 404500,  date: "2024-03-18", collectionAccountName: "Umutanguha Finance Ltd",       collectionAccountNumber: "4003-0067-1122" },
  { id: "r7",  investmentId: "inv7",  investorName: "Diane Ishimwe",         brokerCompanyName: "Umutanguha Finance",       totalPaid: 506500,  date: "2024-04-02", collectionAccountName: "Umutanguha Finance Ltd",       collectionAccountNumber: "4003-0067-1122" },
  { id: "r8",  investmentId: "inv8",  investorName: "Diane Ishimwe",         brokerCompanyName: "Kigali Capital Partners", totalPaid: 204000,  date: "2024-04-15", collectionAccountName: "Kigali Capital Partners Ltd", collectionAccountNumber: "4001-0023-8821" },
  { id: "r9",  investmentId: "inv9",  investorName: "Patrick Nkurunziza",    brokerCompanyName: "Kigali Capital Partners", totalPaid: 605000,  date: "2024-03-25", collectionAccountName: "Kigali Capital Partners Ltd", collectionAccountNumber: "4001-0023-8821" },
  { id: "r10", investmentId: "inv10", investorName: "Patrick Nkurunziza",    brokerCompanyName: "Umutanguha Finance",       totalPaid: 806500,  date: "2024-05-01", collectionAccountName: "Umutanguha Finance Ltd",       collectionAccountNumber: "4003-0067-1122" },
];

export const mockAuditLogs: AuditLog[] = [
  { id: "log-1", action: "BROKER_APPROVED", details: "Approved broker: Kigali Capital Partners", performedBy: "Jean Baptiste Mutsinzi", timestamp: "2024-01-10 09:14:22" },
  { id: "log-2", action: "BROKER_APPROVED", details: "Approved broker: Umutanguha Finance",       performedBy: "Jean Baptiste Mutsinzi", timestamp: "2024-01-12 11:30:05" },
];

// ── Broker line-chart data ────────────────────────────────────────────────────
export const brokerMonthlySales: Record<string, MonthlyBrokerSales[]> = {
  b1: [
    { month: "Jan", totalSales: 1805000, bondsSold: 3 },
    { month: "Feb", totalSales: 1757000, bondsSold: 2 },
    { month: "Mar", totalSales: 1163500, bondsSold: 2 },
    { month: "Apr", totalSales: 204000,  bondsSold: 1 },
    { month: "May", totalSales: 0,       bondsSold: 0 },
    { month: "Jun", totalSales: 0,       bondsSold: 0 },
  ],
  b2: [
    { month: "Jan", totalSales: 304500,  bondsSold: 1 },
    { month: "Feb", totalSales: 0,       bondsSold: 0 },
    { month: "Mar", totalSales: 404500,  bondsSold: 1 },
    { month: "Apr", totalSales: 506500,  bondsSold: 1 },
    { month: "May", totalSales: 806500,  bondsSold: 1 },
    { month: "Jun", totalSales: 0,       bondsSold: 0 },
  ],
  b3: [
    { month: "Jan", totalSales: 0, bondsSold: 0 },
    { month: "Feb", totalSales: 0, bondsSold: 0 },
    { month: "Mar", totalSales: 0, bondsSold: 0 },
    { month: "Apr", totalSales: 0, bondsSold: 0 },
    { month: "May", totalSales: 0, bondsSold: 0 },
    { month: "Jun", totalSales: 0, bondsSold: 0 },
  ],
};

// ── Admin bar-chart data (keyed by "Mon YYYY") ────────────────────────────────
export const adminMonthlyBrokerData: Record<string, BrokerMonthlyMetrics[]> = {
  "Jan 2024": [
    { brokerName: "Kigali Capital", totalSales: 809500,  bondsSold: 2 },
    { brokerName: "Umutanguha",     totalSales: 304500,  bondsSold: 1 },
    { brokerName: "Rwanda Invest",  totalSales: 0,       bondsSold: 0 },
  ],
  "Feb 2024": [
    { brokerName: "Kigali Capital", totalSales: 1764000, bondsSold: 2 },
    { brokerName: "Umutanguha",     totalSales: 0,       bondsSold: 0 },
    { brokerName: "Rwanda Invest",  totalSales: 0,       bondsSold: 0 },
  ],
  "Mar 2024": [
    { brokerName: "Kigali Capital", totalSales: 859000,  bondsSold: 2 },
    { brokerName: "Umutanguha",     totalSales: 404500,  bondsSold: 1 },
    { brokerName: "Rwanda Invest",  totalSales: 0,       bondsSold: 0 },
  ],
  "Apr 2024": [
    { brokerName: "Kigali Capital", totalSales: 204000,  bondsSold: 1 },
    { brokerName: "Umutanguha",     totalSales: 506500,  bondsSold: 1 },
    { brokerName: "Rwanda Invest",  totalSales: 0,       bondsSold: 0 },
  ],
  "May 2024": [
    { brokerName: "Kigali Capital", totalSales: 0,       bondsSold: 0 },
    { brokerName: "Umutanguha",     totalSales: 806500,  bondsSold: 1 },
    { brokerName: "Rwanda Invest",  totalSales: 0,       bondsSold: 0 },
  ],
  "Sep 2024": [
    { brokerName: "Kigali Capital", totalSales: 1100000, bondsSold: 3 },
    { brokerName: "Umutanguha",     totalSales: 650000,  bondsSold: 2 },
    { brokerName: "Rwanda Invest",  totalSales: 0,       bondsSold: 0 },
  ],
  "Dec 2024": [
    { brokerName: "Kigali Capital", totalSales: 950000,  bondsSold: 2 },
    { brokerName: "Umutanguha",     totalSales: 720000,  bondsSold: 2 },
    { brokerName: "Rwanda Invest",  totalSales: 0,       bondsSold: 0 },
  ],
  "Mar 2025": [
    { brokerName: "Kigali Capital", totalSales: 1350000, bondsSold: 3 },
    { brokerName: "Umutanguha",     totalSales: 480000,  bondsSold: 1 },
    { brokerName: "Rwanda Invest",  totalSales: 0,       bondsSold: 0 },
  ],
  "Jun 2025": [
    { brokerName: "Kigali Capital", totalSales: 1580000, bondsSold: 4 },
    { brokerName: "Umutanguha",     totalSales: 920000,  bondsSold: 2 },
    { brokerName: "Rwanda Invest",  totalSales: 280000,  bondsSold: 1 },
  ],
  "Sep 2025": [
    { brokerName: "Kigali Capital", totalSales: 890000,  bondsSold: 2 },
    { brokerName: "Umutanguha",     totalSales: 1100000, bondsSold: 3 },
    { brokerName: "Rwanda Invest",  totalSales: 350000,  bondsSold: 1 },
  ],
  "Dec 2025": [
    { brokerName: "Kigali Capital", totalSales: 2100000, bondsSold: 5 },
    { brokerName: "Umutanguha",     totalSales: 1400000, bondsSold: 3 },
    { brokerName: "Rwanda Invest",  totalSales: 500000,  bondsSold: 1 },
  ],
  "Jan 2026": [
    { brokerName: "Kigali Capital", totalSales: 1200000, bondsSold: 3 },
    { brokerName: "Umutanguha",     totalSales: 750000,  bondsSold: 2 },
    { brokerName: "Rwanda Invest",  totalSales: 200000,  bondsSold: 1 },
  ],
  "Feb 2026": [
    { brokerName: "Kigali Capital", totalSales: 980000,  bondsSold: 2 },
    { brokerName: "Umutanguha",     totalSales: 620000,  bondsSold: 2 },
    { brokerName: "Rwanda Invest",  totalSales: 0,       bondsSold: 0 },
  ],
  "Mar 2026": [
    { brokerName: "Kigali Capital", totalSales: 1650000, bondsSold: 4 },
    { brokerName: "Umutanguha",     totalSales: 880000,  bondsSold: 2 },
    { brokerName: "Rwanda Invest",  totalSales: 420000,  bondsSold: 1 },
  ],
  "Apr 2026": [
    { brokerName: "Kigali Capital", totalSales: 750000,  bondsSold: 2 },
    { brokerName: "Umutanguha",     totalSales: 540000,  bondsSold: 1 },
    { brokerName: "Rwanda Invest",  totalSales: 0,       bondsSold: 0 },
  ],
};
