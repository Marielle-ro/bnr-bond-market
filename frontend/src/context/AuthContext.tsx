import React, { createContext, useContext, useState, ReactNode, FC } from "react";
import {
  Role, BondType, Broker, BrokerBondListing, Investment, Receipt,
  MonthlyBrokerSales, BrokerMonthlyMetrics, Investor, Admin, AppUser, AuditLog,
} from "../types";
import {
  mockBondTypes, mockBrokers, mockInvestors, mockAdmins,
  mockInvestments, mockReceipts, mockBrokerBondListings,
  brokerMonthlySales, adminMonthlyBrokerData, mockAuditLogs,
} from "../mocks/mockdata";

type AuthContextType = {
  user: AppUser | null;
  bondTypes: BondType[];
  brokers: Broker[];
  investors: Investor[];
  admins: Admin[];
  investments: Investment[];
  receipts: Receipt[];
  brokerBondListings: BrokerBondListing[];
  brokerMonthlySales: Record<string, MonthlyBrokerSales[]>;
  adminMonthlyBrokerData: Record<string, BrokerMonthlyMetrics[]>;
  auditLogs: AuditLog[];
  login: (email: string, password: string, role: Role) => 'ok' | 'invalid' | 'pending' | 'suspended';
  registerInvestor: (data: Omit<Investor, "id"> & { password: string }) => boolean;
  registerBroker: (data: Omit<Broker, "id" | "status"> & { password: string }) => boolean;
  logout: () => void;
  addInvestment: (investment: Omit<Investment, "id">) => Investment;
  addReceipt: (receipt: Omit<Receipt, "id">) => Receipt;
  verifyBroker: (brokerId: string) => void;
  suspendBroker: (brokerId: string, reason?: string) => void;
  getUserInvestments: (investorId: string) => Investment[];
  getUserReceipts: (investorId: string) => Receipt[];
  getBrokerListings: (brokerId: string) => BrokerBondListing[];
  getBrokerReceipts: (brokerId: string) => Receipt[];
  getBrokerInvestors: (brokerId: string) => Investor[];
  updateBrokerFee: (listingId: string, newFee: number) => void;
  addBrokerListing: (listing: Omit<BrokerBondListing, "id">) => void;
  addBondType: (bond: Omit<BondType, "id" | "isActive">) => void;
  updateBondType: (id: string, updates: Partial<Omit<BondType, "id" | "isActive">>) => void;
  toggleBondActive: (id: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const initialPasswordMap: Record<string, string> = {
  "jp@gmail.com":              "investor123",
  "marie.c@gmail.com":         "investor123",
  "alain.m@gmail.com":         "investor123",
  "diane.i@gmail.com":         "investor123",
  "patrick.n@gmail.com":       "investor123",
  "info@kigalicapital.rw":     "broker123",
  "hello@umutanguha.rw":       "broker123",
  "contact@rwandainvest.rw":   "broker123",
  "admin@bnrbondmarket.rw":    "admin123",
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [bondTypes, setBondTypes] = useState<BondType[]>(mockBondTypes);
  const [brokers, setBrokers] = useState<Broker[]>(mockBrokers);
  const [investors, setInvestors] = useState<Investor[]>(mockInvestors);
  const [admins] = useState<Admin[]>(mockAdmins);
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [brokerBondListings, setBrokerBondListings] = useState<BrokerBondListing[]>(mockBrokerBondListings);
  const [passwordMap, setPasswordMap] = useState<Record<string, string>>(initialPasswordMap);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);

  // Internal helper — only call when admin is logged in
  const pushAuditLog = (action: string, details: string, adminName: string) => {
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      details,
      performedBy: adminName,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
    };
    setAuditLogs((prev) => [...prev, log]);
  };

  const login = (email: string, password: string, role: Role): 'ok' | 'invalid' | 'pending' | 'suspended' => {
    if (passwordMap[email] !== password) return 'invalid';
    if (role === "INVESTOR") {
      const investor = investors.find((i) => i.email === email);
      if (investor) { setUser({ ...investor, role }); return 'ok'; }
    }
    if (role === "BROKER") {
      const broker = brokers.find((b) => b.email === email);
      if (broker) {
        if (broker.status === 'PENDING') return 'pending';
        if (broker.status === 'SUSPENDED') return 'suspended';
        setUser({ ...broker, role });
        return 'ok';
      }
    }
    if (role === "ADMIN") {
      const admin = admins.find((a) => a.email === email);
      if (admin) { setUser({ ...admin, role }); return 'ok'; }
    }
    return 'invalid';
  };

  const registerInvestor = (data: Omit<Investor, "id"> & { password: string }): boolean => {
    if (investors.some((i) => i.email === data.email)) return false;
    const newInvestor: Investor = { ...data, id: `i-${Date.now()}` };
    setInvestors((prev) => [...prev, newInvestor]);
    setPasswordMap((prev) => ({ ...prev, [data.email]: data.password }));
    return true;
  };

  const registerBroker = (data: Omit<Broker, "id" | "status"> & { password: string }): boolean => {
    if (brokers.some((b) => b.email === data.email)) return false;
    const { password, ...brokerData } = data;
    const newBroker: Broker = { ...brokerData, id: `b-${Date.now()}`, status: "PENDING" };
    setBrokers((prev) => [...prev, newBroker]);
    setPasswordMap((prev) => ({ ...prev, [data.email]: password }));
    return true;
  };

  const logout = () => setUser(null);

  const addInvestment = (investment: Omit<Investment, "id">): Investment => {
    const newInvestment: Investment = { ...investment, id: `inv-${Date.now()}` };
    setInvestments((prev) => [...prev, newInvestment]);
    return newInvestment;
  };

  const addReceipt = (receipt: Omit<Receipt, "id">): Receipt => {
    const newReceipt: Receipt = { ...receipt, id: `r-${Date.now()}` };
    setReceipts((prev) => [...prev, newReceipt]);
    return newReceipt;
  };

  const verifyBroker = (brokerId: string) => {
    const broker = brokers.find((b) => b.id === brokerId);
    setBrokers((prev) => prev.map((b) => b.id === brokerId ? { ...b, status: "APPROVED" } : b));
    if (user && user.role === "ADMIN") {
      pushAuditLog("BROKER_APPROVED", `Approved broker: ${broker?.companyName ?? brokerId}`, (user as any).fullName);
    }
  };

  const suspendBroker = (brokerId: string, reason?: string) => {
    const broker = brokers.find((b) => b.id === brokerId);
    const wasApproved = broker?.status === "APPROVED";
    setBrokers((prev) => prev.map((b) => b.id === brokerId ? { ...b, status: "SUSPENDED" } : b));
    if (user && user.role === "ADMIN") {
      const base = `${wasApproved ? "Suspended" : "Rejected"} broker: ${broker?.companyName ?? brokerId}`;
      pushAuditLog(
        wasApproved ? "BROKER_SUSPENDED" : "BROKER_REJECTED",
        reason ? `${base}. Reason: ${reason}` : base,
        (user as any).fullName
      );
    }
  };

  const getUserInvestments = (investorId: string) =>
    investments.filter((inv) => inv.investorId === investorId);

  const getUserReceipts = (investorId: string): Receipt[] => {
    const investor = investors.find((i) => i.id === investorId);
    if (!investor) return [];
    return receipts.filter((r) => r.investorName === investor.fullName);
  };

  const getBrokerListings = (brokerId: string) =>
    brokerBondListings
      .filter((l) => l.brokerId === brokerId)
      .sort((a, b) => b.quantityAvailable - a.quantityAvailable);

  const getBrokerReceipts = (brokerId: string): Receipt[] => {
    const broker = brokers.find((b) => b.id === brokerId);
    if (!broker) return [];
    return receipts.filter((r) => r.brokerCompanyName === broker.companyName);
  };

  const getBrokerInvestors = (brokerId: string): Investor[] => {
    const broker = brokers.find((b) => b.id === brokerId);
    if (!broker) return [];
    const ids = [...new Set(
      investments
        .filter((inv) => inv.brokerCompanyName === broker.companyName)
        .map((inv) => inv.investorId)
    )];
    return investors.filter((inv) => ids.includes(inv.id));
  };

  const updateBrokerFee = (listingId: string, newFee: number) =>
    setBrokerBondListings((prev) =>
      prev.map((l) => l.id === listingId ? { ...l, brokerFee: newFee } : l)
    );

  const addBrokerListing = (listing: Omit<BrokerBondListing, "id">) => {
    const newListing: BrokerBondListing = { ...listing, id: `bbl-${Date.now()}` };
    setBrokerBondListings((prev) => [...prev, newListing]);
  };

  const addBondType = (bond: Omit<BondType, "id" | "isActive">) => {
    const newBond: BondType = { ...bond, id: `bt-${Date.now()}`, isActive: true };
    setBondTypes((prev) => [...prev, newBond]);
    if (user && user.role === "ADMIN") {
      pushAuditLog(
        "BOND_ADDED",
        `Added bond type: "${bond.name}" (${bond.couponRate}%, ${bond.durationYears}yr, min RWF ${bond.minInvestment.toLocaleString()})`,
        (user as any).fullName
      );
    }
  };

  const updateBondType = (id: string, updates: Partial<Omit<BondType, "id" | "isActive">>) => {
    const bond = bondTypes.find((b) => b.id === id);
    setBondTypes((prev) => prev.map((b) => b.id === id ? { ...b, ...updates } : b));
    if (user && user.role === "ADMIN") {
      pushAuditLog("BOND_UPDATED", `Updated bond type: "${bond?.name ?? id}"`, (user as any).fullName);
    }
  };

  const toggleBondActive = (id: string) => {
    const bond = bondTypes.find((b) => b.id === id);
    const newActive = !bond?.isActive;
    setBondTypes((prev) => prev.map((b) => b.id === id ? { ...b, isActive: newActive } : b));
    if (user && user.role === "ADMIN") {
      pushAuditLog(
        newActive ? "BOND_ENABLED" : "BOND_DISABLED",
        `${newActive ? "Enabled" : "Disabled"} bond type: "${bond?.name ?? id}"`,
        (user as any).fullName
      );
    }
  };

  return (
    <AuthContext.Provider value={{
      user, bondTypes, brokers, investors, admins, investments, receipts,
      brokerBondListings, brokerMonthlySales, adminMonthlyBrokerData, auditLogs,
      login, registerInvestor, registerBroker, logout,
      addInvestment, addReceipt, verifyBroker, suspendBroker,
      getUserInvestments, getUserReceipts, getBrokerListings,
      getBrokerReceipts, getBrokerInvestors, updateBrokerFee, addBrokerListing,
      addBondType, updateBondType, toggleBondActive,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
