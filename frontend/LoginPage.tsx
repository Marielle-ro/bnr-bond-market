import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Page, AppState } from '../App';

interface Props {
  navigate: (page: Page, extra?: Partial<AppState>) => void;
}

const LoginPage: React.FC<Props> = ({ navigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    const ok = login(email, password);
    if (ok) {
      navigate('home');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <span className="auth-logo">BNR BondMarket</span>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account — investors and brokers use the same login</p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-gold btn-full" style={{ marginTop: '1.25rem' }}>
              Sign In
            </button>
          </form>
        </div>

        <div className="auth-footer">
          Not registered?{' '}
          <a onClick={() => navigate('investor-register')}>Register as Investor</a>
          {' · '}
          <a onClick={() => navigate('broker-register')}>Register as Broker</a>
        </div>
        <div className="auth-footer" style={{ marginTop: '0.75rem' }}>
          <a onClick={() => navigate('home')}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
