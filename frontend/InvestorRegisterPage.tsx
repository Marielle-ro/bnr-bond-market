import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Page, AppState } from '../App';

interface Props {
  navigate: (page: Page, extra?: Partial<AppState>) => void;
}

const InvestorRegisterPage: React.FC<Props> = ({ navigate }) => {
  const { registerInvestor } = useAuth();
  const [form, setForm] = useState({
    fullName: '', email: '', idNumber: '', password: '', confirm: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const { fullName, email, idNumber, password, confirm } = form;
    if (!fullName || !email || !idNumber || !password || !confirm) {
      setError('All fields are required.'); return;
    }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    const ok = registerInvestor({ fullName, email, idNumber, password });
    if (ok) {
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('login'), 1500);
    } else {
      setError('An account with this email already exists.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: 520 }}>
        <div className="auth-header">
          <span className="auth-logo">BNR BondMarket</span>
          <h1 className="auth-title">Investor Registration</h1>
          <p className="auth-subtitle">Create your account to start investing in Rwanda's bonds</p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Jean Pierre Habimana" value={form.fullName} onChange={set('fullName')} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} />
            </div>
            <div className="form-group">
              <label className="form-label">National ID Number</label>
              <input className="form-input" placeholder="1199780012345678" value={form.idNumber} onChange={set('idNumber')} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" placeholder="Repeat your password" value={form.confirm} onChange={set('confirm')} />
            </div>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            <button type="submit" className="btn btn-gold btn-full" style={{ marginTop: '1rem' }}>
              Create Account
            </button>
          </form>
        </div>

        <div className="auth-footer">
          Already have an account? <a onClick={() => navigate('login')}>Sign In</a>
        </div>
        <div className="auth-footer" style={{ marginTop: '0.5rem' }}>
          Are you a broker? <a onClick={() => navigate('broker-register')}>Register as Broker</a>
        </div>
        <div className="auth-footer" style={{ marginTop: '0.75rem' }}>
          <a onClick={() => navigate('home')}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
};

export default InvestorRegisterPage;
