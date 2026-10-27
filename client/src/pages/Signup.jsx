import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, User, Mail, Phone, Lock, MapPin, AlertCircle } from 'lucide-react';

const STATE_DISTRICTS = {
  Rajasthan: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Alwar', 'Sikar'],
  Bihar: ['Patna', 'Gaya', 'Muzaffarpur', 'Darbhanga', 'Bhagalpur', 'Purnia', 'Samastipur'],
  Punjab: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Hoshiarpur', 'Mohali'],
  Maharashtra: ['Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati'],
  Haryana: ['Hisar', 'Karnal', 'Ambala', 'Panipat', 'Rohtak', 'Gurugram', 'Sirsa'],
  'Uttar Pradesh': ['Lucknow', 'Varanasi', 'Kanpur', 'Prayagraj', 'Agra', 'Meerut', 'Gorakhpur'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Junagadh'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar']
};

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    state: 'Rajasthan',
    district: 'Jaipur',
    farmSize: '5'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const defaultDistrict = STATE_DISTRICTS[selectedState]?.[0] || '';
    setFormData({ ...formData, state: selectedState, district: defaultDistrict });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 24px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ maxWidth: 540, width: '100%', padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', padding: 12, borderRadius: '50%', background: '#ecfdf5', marginBottom: 12 }}>
            <Sprout size={32} color="#10b981" />
          </div>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#064e3b' }}>Join KrishiMitra</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: 4 }}>
            Register your farm plot to access localized AI advisory
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ramesh Kumar"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone (+91)</label>
              <input
                type="tel"
                className="form-input"
                placeholder="98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="kisan@krishimitr.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">State</label>
              <select className="form-select" value={formData.state} onChange={handleStateChange}>
                {Object.keys(STATE_DISTRICTS).map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">District</label>
              <select
                className="form-select"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              >
                {(STATE_DISTRICTS[formData.state] || []).map((dst) => (
                  <option key={dst} value={dst}>{dst}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Total Farm Size (in Acres)</label>
            <input
              type="number"
              step="0.5"
              className="form-input"
              placeholder="e.g. 4.5"
              value={formData.farmSize}
              onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Creating Account in PostgreSQL...' : 'Create Account & Enter Dashboard'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.92rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#10b981', fontWeight: 700 }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
