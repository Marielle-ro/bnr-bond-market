import React from 'react';
import { User } from '../types';
import { mockBonds } from '../data/mockData';
import { Page, AppState } from '../App';

interface Props {
  navigate: (page: Page, extra?: Partial<AppState>) => void;
  user: User | null;
  logout: () => void;
}

const LandingPage: React.FC<Props> = ({ navigate, user, logout }) => {
  const activeBonds = mockBonds.filter(b => b.status === 'active');

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">BNR <span>BondMarket</span></div>
        <div className="navbar-actions">
          {user ? (
            <>
              <span style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>
                {user.role === 'investor' ? (user as any).fullName : (user as any).companyName}
              </span>
              <button className="btn btn-ghost" onClick={logout}>Sign Out</button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => navigate('login')}>Sign In</button>
              <button className="btn btn-gold" onClick={() => navigate('investor-register')}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">🇷🇼 National Bond Market Platform</div>
        <h1 className="hero-title">
          Invest in Rwanda's<br />
          <span className="gold">Future, Today</span>
        </h1>
        <p className="hero-subtitle">
          Access government-backed bonds with fixed returns. Secure, transparent, and regulated by the National Bank of Rwanda.
        </p>
        {!user && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-gold" onClick={() => navigate('investor-register')}>
              Invest Now
            </button>
            <button className="btn btn-outline" onClick={() => navigate('broker-register')}>
              Register as Broker
            </button>
          </div>
        )}
      </div>

      {/* Active Bonds */}
      <div className="section">
        <h2 className="section-title">Active Bonds</h2>
        <p className="section-sub">Select a bond to view available brokers and begin investing</p>
        <div className="bonds-grid">
          {activeBonds.map(bond => (
            <div
              key={bond.id}
              className="bond-card"
              onClick={() => navigate('bond-detail', { selectedBond: bond })}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className="bond-duration">{bond.duration}</span>
                <span className="status-active">Active</span>
              </div>
              <h3 className="bond-name">{bond.name}</h3>
              <p className="bond-desc">{bond.description}</p>
              <div className="bond-stats">
                <div className="bond-stat">
                  <label>Interest Rate</label>
                  <span>{bond.interestRate}%</span>
                </div>
                <div className="bond-stat">
                  <label>Min. Investment</label>
                  <span>RWF {bond.minInvestment.toLocaleString()}</span>
                </div>
                <div className="bond-stat">
                  <label>Brokers</label>
                  <span>{bond.brokerIds.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(201,168,76,0.1)',
        padding: '2rem 3rem',
        textAlign: 'center',
        color: 'var(--gray)',
        fontSize: '0.82rem'
      }}>
        © {new Date().getFullYear()} BNR BondMarket — Regulated by the National Bank of Rwanda
      </div>
    </div>
  );
};

export default LandingPage;
