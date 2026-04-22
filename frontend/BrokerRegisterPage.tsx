import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Page, AppState } from '../App';

interface Props {
  navigate: (page: Page, extra?: Partial<AppState>) => void;
}

const BrokerRegisterPage: React.FC<Props> = ({ navigate }) => {
  const { registerBroker } = useAuth();
  const [form, setForm] = useState({
    companyName: '', companyEmail: '', companyPhone: '',
    password: '', confirm: '', accountName: '', accountNumber: '', rdbCertificate: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const { companyName, companyEmail, companyPhone, password, confirm, accountName, accountNumber, rdbCertificate } = form;
    if (!companyName || !companyEmail || !companyPhone || !password || !confirm || !accountName || !accountNumber || !rdbCertificate) {
      setError('All fields are required.'); return;
    }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    const ok = registerBroker({ companyName, companyEmail, companyPhone, password, accountName, accountNumber, rdbCertificate });
    if (ok) {
      setSuccess('Broker account created! Redirecting to login...');
      setTimeout(() => navigate('login'), 1500);
    } else {
      setError('A broker account with this email already exists.');
    }
  };

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="auth-container" style={{ maxWidth: 520 }}>
        <div className="auth-header">
          <span className="auth-logo">BNR BondMarket</span>
          <h1 className="auth-title">Broker Registration</h1>
          <p className="auth-subtitle">Register your company to offer bonds to investors</p>
        </div>

        <div className="form-card">
          <p style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
            Company Information
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Company Full Name</label>
              <input className="form-input" placeholder="Kigali Capital Partners Ltd" value={form.companyName} onChange={set('companyName')} />
            </div>
            <div className="form-group">
              <label className="form-label">Company Email</label>
              <input className="form-input" type="email" placeholder="info@yourcompany.rw" value={form.companyEmail} onChange={set('companyEmail')} />
            </div>
            <div className="form-group">
              <label className="form-label">Company Phone Number</label>
              <input className="form-input" placeholder="+250 788 000 000" value={form.companyPhone} onChange={set('companyPhone')} />
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '1.5rem 0' }} />
            <p style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              Bank Account Details
            </p>

            <div className="form-group">
              <label className="form-label">Account Name</label>
              <input className="form-input" placeholder="Kigali Capital Partners Ltd" value={form.accountName} onChange={set('accountName')} />
            </div>
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input className="form-input" placeholder="4000-0000-0000" value={form.accountNumber} onChange={set('accountNumber')} />
            </div>
            <div className="form-group">
              <label className="form-label">RDB Certificate Number</label>
              <input className="form-input" placeholder="RDB-2024-XX-00000" value={form.rdbCertificate} onChange={set('rdbCertificate')} />
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '1.5rem 0' }} />
            <p style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              Security
            </p>

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
              Register Broker Account
            </button>
          </form>
        </div>

        <div className="auth-footer">
          Already registered? <a onClick={() => navigate('login')}>Sign In</a>
        </div>
        <div className="auth-footer" style={{ marginTop: '0.5rem' }}>
          Are you an investor? <a onClick={() => navigate('investor-register')}>Register as Investor</a>
        </div>
        <div className="auth-footer" style={{ marginTop: '0.75rem' }}>
          <a onClick={() => navigate('home')}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
};

export default BrokerRegisterPage;
