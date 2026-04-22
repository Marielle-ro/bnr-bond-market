import React from 'react';
import { Bond } from '../types';
import { mockBrokers } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Page, AppState } from '../App';

interface Props {
  bond: Bond;
  navigate: (page: Page, extra?: Partial<AppState>) => void;
}

const BondDetailPage: React.FC<Props> = ({ bond, navigate }) => {
  const { brokers, user } = useAuth();
  const bondBrokers = brokers.filter(b => bond.brokerIds.includes(b.id));

  const handleSelectBroker = (brokerId: string) => {
    const broker = brokers.find(b => b.id === brokerId);
    if (!broker) return;
    if (!user) {
      navigate('login');
      return;
    }
    navigate('payment', { selectedBond: bond, selectedBroker: broker });
  };

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">BNR <span>BondMarket</span></div>
        {user && (
          <span style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>
            {user.role === 'investor' ? (user as any).fullName : (user as any).companyName}
          </span>
        )}
      </nav>

      <div className="section" style={{ maxWidth: 800 }}>
        <button className="back-btn" onClick={() => navigate('home')}>
          ← Back to All Bonds
        </button>

        {/* Bond summary */}
        <div className="payment-card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="bond-duration">{bond.duration}</span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var(--white)', margin: '0.5rem 0 0.75rem' }}>
                {bond.name}
              </h2>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 480 }}>{bond.description}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 180 }}>
              <div className="account-display">
                <label>Annual Return</label>
                <span style={{ color: 'var(--gold)' }}>{bond.interestRate}%</span>
              </div>
              <div className="account-display">
                <label>Minimum Investment</label>
                <span style={{ fontSize: '1rem' }}>RWF {bond.minInvestment.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brokers list */}
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--white)', marginBottom: '0.5rem' }}>
          Available Brokers
        </h3>
        <p style={{ color: 'var(--gray)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Select a broker to proceed with your investment
        </p>

        <div className="brokers-list">
          {bondBrokers.map(broker => (
            <div key={broker.id} className="broker-card" onClick={() => handleSelectBroker(broker.id)}>
              <div className="broker-info">
                <h3>{broker.companyName}</h3>
                <p>{broker.companyEmail} · {broker.companyPhone}</p>
                <p style={{ marginTop: '0.3rem', fontSize: '0.78rem', color: 'var(--gold)' }}>
                  RDB: {broker.rdbCertificate}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <span className="status-active">Verified</span>
                <span style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600 }}>
                  Invest →
                </span>
              </div>
            </div>
          ))}
        </div>

        {!user && (
          <div style={{
            marginTop: '2rem',
            padding: '1.25rem',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '8px',
            textAlign: 'center',
            color: 'var(--gray)',
            fontSize: '0.9rem'
          }}>
            You need to <span style={{ color: 'var(--gold)', cursor: 'pointer' }} onClick={() => navigate('login')}>sign in</span> to proceed with an investment.
          </div>
        )}
      </div>
    </div>
  );
};

export default BondDetailPage;
