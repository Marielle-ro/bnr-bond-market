import { Bond, Broker, Investor } from '../types';

export const mockBrokers: Broker[] = [
  {
    id: 'b1',
    companyName: 'Kigali Capital Partners',
    companyEmail: 'info@kigalicapital.rw',
    companyPhone: '+250 788 100 200',
    password: 'password123',
    accountName: 'Kigali Capital Partners Ltd',
    accountNumber: '4001-0023-8821',
    rdbCertificate: 'RDB-2021-KC-00123',
    role: 'broker',
  },
  {
    id: 'b2',
    companyName: 'Rwanda Investment Group',
    companyEmail: 'contact@rwandainvest.rw',
    companyPhone: '+250 788 300 400',
    password: 'password123',
    accountName: 'Rwanda Investment Group PLC',
    accountNumber: '4002-0045-9934',
    rdbCertificate: 'RDB-2020-RI-00456',
    role: 'broker',
  },
  {
    id: 'b3',
    companyName: 'Umutanguha Finance',
    companyEmail: 'hello@umutanguha.rw',
    companyPhone: '+250 722 500 600',
    password: 'password123',
    accountName: 'Umutanguha Finance Co.',
    accountNumber: '4003-0067-1122',
    rdbCertificate: 'RDB-2019-UF-00789',
    role: 'broker',
  },
];

export const mockInvestors: Investor[] = [
  {
    id: 'i1',
    fullName: 'Jean Pierre Habimana',
    email: 'jp@gmail.com',
    idNumber: '1199780012345678',
    password: 'password123',
    role: 'investor',
  },
];

export const mockBonds: Bond[] = [
  {
    id: 'bond1',
    name: '3-Year Government Bond',
    duration: '3 Years',
    interestRate: 8.5,
    minInvestment: 100000,
    description: 'Secure 3-year treasury bond backed by the Government of Rwanda. Fixed annual returns paid quarterly.',
    status: 'active',
    brokerIds: ['b1', 'b2', 'b3'],
  },
  {
    id: 'bond2',
    name: '5-Year Infrastructure Bond',
    duration: '5 Years',
    interestRate: 10.2,
    minInvestment: 250000,
    description: 'Long-term infrastructure development bond supporting major national projects with premium returns.',
    status: 'active',
    brokerIds: ['b1', 'b3'],
  },
  {
    id: 'bond3',
    name: '2-Year Treasury Note',
    duration: '2 Years',
    interestRate: 6.8,
    minInvestment: 50000,
    description: 'Short-term treasury note ideal for conservative investors seeking stable, low-risk returns.',
    status: 'active',
    brokerIds: ['b2', 'b3'],
  },
  {
    id: 'bond4',
    name: '7-Year Development Bond',
    duration: '7 Years',
    interestRate: 12.0,
    minInvestment: 500000,
    description: 'Premium development bond for long-term investors, financing Rwanda\'s Vision 2050 projects.',
    status: 'active',
    brokerIds: ['b1', 'b2'],
  },
];
