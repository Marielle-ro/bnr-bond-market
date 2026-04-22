import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Investor, Broker } from '../types';
import { mockBrokers, mockInvestors } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  investors: Investor[];
  brokers: Broker[];
  login: (email: string, password: string) => boolean;
  registerInvestor: (data: Omit<Investor, 'id' | 'role'>) => boolean;
  registerBroker: (data: Omit<Broker, 'id' | 'role'>) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [investors, setInvestors] = useState<Investor[]>(mockInvestors);
  const [brokers, setBrokers] = useState<Broker[]>(mockBrokers);

  const login = (email: string, password: string): boolean => {
    const investor = investors.find(i => i.email === email && i.password === password);
    if (investor) { setUser(investor); return true; }
    const broker = brokers.find(b => b.companyEmail === email && b.password === password);
    if (broker) { setUser(broker); return true; }
    return false;
  };

  const registerInvestor = (data: Omit<Investor, 'id' | 'role'>): boolean => {
    if (investors.find(i => i.email === data.email)) return false;
    const newInvestor: Investor = { ...data, id: `i${Date.now()}`, role: 'investor' };
    setInvestors(prev => [...prev, newInvestor]);
    return true;
  };

  const registerBroker = (data: Omit<Broker, 'id' | 'role'>): boolean => {
    if (brokers.find(b => b.companyEmail === data.companyEmail)) return false;
    const newBroker: Broker = { ...data, id: `b${Date.now()}`, role: 'broker' };
    setBrokers(prev => [...prev, newBroker]);
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, investors, brokers, login, registerInvestor, registerBroker, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
