import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, ArrowRight, Zap, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 24px', minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ maxWidth: 460, width: '100%', padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', padding: 12, borderRadius: '50%', background: '#ecfdf5', marginBottom: 12 }}>
            <Sprout size={32} color="#10b981" />
          </div>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#064e3b' }}>Farmer Login</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: 4 }}>
            Welcome back to your KrishiMitra farm portal
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: 12,
            fontSize: '0.88rem',
            marginBottom: 20
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: 42 }}
                placeholder="kisan@village.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: 42 }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Authenticating with PostgreSQL...' : 'Login to Dashboard'}
          </button>
        </form>

        <div style={{ margin: '24px 0', textAlign: 'center', position: 'relative' }}>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
          <span style={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ffffff',
            padding: '0 12px',
            color: '#94a3b8',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            OR INSTANT TESTING
          </span>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="btn btn-secondary"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            borderColor: '#10b981',
            color: '#065f46',
            background: '#ecfdf5'
          }}
        >
          <Zap size={18} color="#10b981" />
          ⚡ Instant Demo Farmer Login (No Password)
        </button>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.92rem', color: '#64748b' }}>
          New to KrishiMitra?{' '}
          <Link to="/signup" style={{ color: '#10b981', fontWeight: 700 }}>
            Create free account
          </Link>
        </p>
      </div>
    </div>
  );
}
