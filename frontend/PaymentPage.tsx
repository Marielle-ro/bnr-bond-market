import React, { useState } from 'react';
import { Bond, Broker } from '../types';
import { useAuth } from '../context/AuthContext';
import { Page, AppState } from '../App';

interface Props {
  bond: Bond;
  broker: Broker;
  navigate: (page: Page, extra?: Partial<AppState>) => void;
}

const PaymentPage: React.FC<Props> = ({ bond, broker, navigate }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [investorAccount, setInvestorAccount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount)) { setError('Please enter a valid amount.'); return; }
    if (numAmount < bond.minInvestment) {
      setError(`Minimum investment is RWF ${bond.minInvestment.toLocaleString()}.`); return;
    }
    if (!investorAccount.trim()) { setError('Please enter your account number.'); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page">
        <nav className="navbar">
          <div className="navbar-logo">BNR <span>BondMarket</span></div>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 65px)', padding: '2rem' }}>
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--white)', marginBottom: '1rem' }}>
              Payment Submitted
            </h2>
            <p style={{ color: 'var(--gray)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Your investment request of <strong style={{ color: 'var(--gold)' }}>RWF {Number(amount).toLocaleString()}</strong> in the{' '}
              <strong style={{ color: 'var(--white)' }}>{bond.name}</strong> via{' '}
              <strong style={{ color: 'var(--white)' }}>{broker.companyName}</strong> has been submitted.
              You will receive a confirmation shortly.
            </p>
            <button className="btn btn-gold" onClick={() => navigate('home')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-logo">BNR <span>BondMarket</span></div>
      </nav>

      <div className="section" style={{ maxWidth: 680 }}>
        <button className="back-btn" onClick={() => navigate('bond-detail', { selectedBond: bond })}>
          ← Back to Brokers
        </button>

        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--white)', marginBottom: '0.5rem' }}>
          Complete Your Investment
        </h2>
        <p style={{ color: 'var(--gray)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {bond.name} · {bond.interestRate}% p.a. · {bond.duration}
        </p>

        {/* Broker Account (destination) */}
        <div className="payment-card">
          <p style={{ color: 'var(--gray)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '1rem' }}>
            Send Payment To
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--white)', fontWeight: 600 }}>{broker.companyName}</span>
            <span className="status-active">Verified Broker</span>
          </div>
          <div className="account-display">
            <label>Broker Account Number</label>
            <span>{broker.accountNumber}</span>
          </div>
          <div className="account-display" style={{ marginTop: '0.75rem' }}>
            <label>Account Name</label>
            <span style={{ fontSize: '1rem' }}>{broker.accountName}</span>
          </div>
        </div>

        {/* Payment form */}
        <div className="payment-card">
          <p style={{ color: 'var(--gray)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '1.25rem' }}>
            Your Payment Details
          </p>
          <form onSubmit={handlePay}>
            <div className="form-group">
              <label className="form-label">Investment Amount (RWF)</label>
              <input
                className="form-input"
                type="number"
                placeholder={`Minimum: ${bond.minInvestment.toLocaleString()}`}
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
              <p style={{ color: 'var(--gray)', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                Min. investment: RWF {bond.minInvestment.toLocaleString()}
              </p>
            </div>
            <div className="form-group">
              <label className="form-label">Your Account Number</label>
              <input
                className="form-input"
                placeholder="Enter your bank account number"
                value={investorAccount}
                onChange={e => setInvestorAccount(e.target.value)}
              />
              <p style={{ color: 'var(--gray)', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                This is the account from which the payment will be made
              </p>
            </div>

            {amount && !isNaN(Number(amount)) && Number(amount) >= bond.minInvestment && (
              <div style={{
                background: 'rgba(39,174,96,0.08)',
                border: '1px solid rgba(39,174,96,0.2)',
                borderRadius: '8px',
                padding: '1rem 1.25rem',
                marginBottom: '1rem'
              }}>
                <p style={{ color: 'var(--gray)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>Estimated Annual Return</p>
                <p style={{ color: '#2ecc71', fontSize: '1.3rem', fontWeight: 700 }}>
                  RWF {Math.round(Number(amount) * bond.interestRate / 100).toLocaleString()}
                  <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--gray)', marginLeft: '0.5rem' }}>/ year</span>
                </p>
              </div>
            )}

            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-gold btn-full" style={{ marginTop: '0.5rem' }}>
              Confirm & Submit Payment
            </button>
          </form>
        </div>

        <p style={{ color: 'var(--gray)', fontSize: '0.78rem', textAlign: 'center', lineHeight: 1.6 }}>
          By submitting, you agree to the investment terms and conditions regulated by the National Bank of Rwanda.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
