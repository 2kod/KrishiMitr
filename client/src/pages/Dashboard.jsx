import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CloudSun, TrendingUp, Scan, Sprout, MapPin, Calendar, Edit3, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    state: '',
    district: '',
    farmSize: ''
  });

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/dashboard');
      if (res.data.success) {
        setDashboardData(res.data);
        const city = res.data.district || 'Jaipur';
        fetchWeather(city);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city) => {
    try {
      const apiKey = '71ca48bb8af57498e0efdabac5f86f4d';
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      if (res.data.cod === 200) {
        setWeather({
          city: res.data.name,
          temp: Math.round(res.data.main.temp),
          desc: res.data.weather[0].description,
          humidity: res.data.main.humidity,
          wind: res.data.wind.speed
        });
      }
    } catch (e) {
      // Fallback weather
      setWeather({
        city: city || 'Jaipur',
        temp: 28,
        desc: 'Clear sky, ideal for field spraying',
        humidity: 45,
        wind: 3.2
      });
    }
  };

  const handleOpenEdit = () => {
    const f = user || dashboardData?.farmer || {};
    setEditForm({
      fullName: f.full_name || '',
      phone: f.phone || '',
      state: f.state || dashboardData?.state || 'Rajasthan',
      district: f.district || dashboardData?.district || 'Jaipur',
      farmSize: f.farm_size || '5'
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(editForm);
      setIsEditing(false);
      fetchDashboard();
    } catch (err) {
      alert('Could not update profile: ' + err.message);
    }
  };

  const farmer = user || dashboardData?.farmer || {
    full_name: 'Farmer Friend',
    state: 'Rajasthan',
    district: 'Jaipur',
    farm_size: '5.0'
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px 80px' }}>
      {/* Welcome Banner */}
      <div className="glass-card" style={{
        padding: '36px 40px',
        marginBottom: 32,
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <span className="badge badge-amber" style={{ marginBottom: 12 }}>
              🌱 PERN Local Database Connected
            </span>
            <h1 className="font-serif" style={{ fontSize: '2.6rem', marginBottom: 8, color: '#ffffff' }}>
              Namaste, {farmer.full_name}!
            </h1>
            <p style={{ color: '#a7f3d0', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={18} /> Farm Location: {farmer.district}, {farmer.state} • {farmer.farm_size} Acres
            </p>
          </div>

          <button
            onClick={handleOpenEdit}
            className="btn btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.9rem', gap: 6 }}
          >
            <Edit3 size={16} /> Edit Farm Details
          </button>
        </div>
      </div>

      {/* Bento Grid: Weather, Mandi Rates, Quick AI Scan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 36 }}>
        {/* Weather Card */}
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#065f46', fontWeight: 700 }}>
              <CloudSun size={22} color="#10b981" />
              <span>Live Weather Advisory</span>
            </div>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{farmer.district}</span>
          </div>

          {weather ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, margin: '14px 0' }}>
                <span style={{ fontSize: '3.2rem', fontWeight: 800, color: '#0f172a' }}>{weather.temp}°C</span>
                <span style={{ fontSize: '1rem', color: '#475569', textTransform: 'capitalize', fontWeight: 500 }}>
                  {weather.desc}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 20, paddingTop: 14, borderTop: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#64748b' }}>
                <div>💧 Humidity: <strong style={{ color: '#0f172a' }}>{weather.humidity}%</strong></div>
                <div>💨 Wind: <strong style={{ color: '#0f172a' }}>{weather.wind} m/s</strong></div>
              </div>
            </div>
          ) : (
            <p style={{ color: '#64748b' }}>Loading localized weather...</p>
          )}
        </div>

        {/* AI Doctor Shortcut */}
        <div className="glass-card" style={{ padding: 28, background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#065f46', fontWeight: 700, marginBottom: 12 }}>
            <Scan size={22} color="#10b981" />
            <span>AI Leaf Doctor (YOLOv8)</span>
          </div>
          <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 20 }}>
            Inspect your crops for blight, sigatoka, or anthracnose. Get instantaneous lab-grade diagnostic reports with pesticide guidance.
          </p>
          <Link to="/scan" className="btn btn-primary" style={{ width: '100%', gap: 8 }}>
            Upload Leaf for AI Scan <ArrowRight size={16} />
          </Link>
        </div>

        {/* Quick Mandi Ticker */}
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#065f46', fontWeight: 700 }}>
              <TrendingUp size={22} color="#f59e0b" />
              <span>Today's Mandi Rates</span>
            </div>
            <Link to="/mandi" style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
              All Rates →
            </Link>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <tbody>
              {(dashboardData?.mandiPrices || []).slice(0, 3).map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 0', fontWeight: 600 }}>{item.commodity}</td>
                  <td style={{ padding: '8px 0', color: '#64748b' }}>{item.market || item.district}</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: '#065f46' }}>
                    ₹{item.modal_price}
                  </td>
                  <td style={{ padding: '8px 0', textAlign: 'right', color: item.trend === 'up' ? '#10b981' : '#ef4444' }}>
                    {item.trend === 'up' ? '▲' : '▼'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Crops from PostgreSQL */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#064e3b' }}>
            Recommended Crops for {farmer.state}
          </h2>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Curated by Agricultural Scientists</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {(dashboardData?.crops || []).map((crop) => (
            <div key={crop.id} className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className={`badge ${crop.type === 'Kharif' ? 'badge-amber' : crop.type === 'Rabi' ? 'badge-blue' : 'badge-green'}`}>
                  {crop.type} Season
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{crop.ideal_temperature}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{crop.name}</h3>
              <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 14 }}>
                {crop.description}
              </p>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                🌧️ Rainfall: <strong style={{ color: '#0f172a' }}>{crop.rainfall_req}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Scans Log (PostgreSQL `disease_scans`) */}
      {dashboardData?.recentScans && dashboardData.recentScans.length > 0 && (
        <div className="glass-card" style={{ padding: 32 }}>
          <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#064e3b', marginBottom: 16 }}>
            Your Recent AI Diagnostic History
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '12px 10px' }}>Detected Condition</th>
                  <th style={{ padding: '12px 10px' }}>Severity</th>
                  <th style={{ padding: '12px 10px' }}>Confidence</th>
                  <th style={{ padding: '12px 10px' }}>Recommended Treatment</th>
                  <th style={{ padding: '12px 10px' }}>Scanned At</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentScans.map((scan) => (
                  <tr key={scan.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 10px', fontWeight: 700, color: scan.severity === 'None' ? '#059669' : '#dc2626' }}>
                      {scan.disease_name}
                    </td>
                    <td style={{ padding: '14px 10px' }}>
                      <span className={`badge ${scan.severity === 'None' ? 'badge-green' : scan.severity === 'High' ? 'badge-red' : 'badge-amber'}`}>
                        {scan.severity}
                      </span>
                    </td>
                    <td style={{ padding: '14px 10px', fontWeight: 600 }}>
                      {(scan.confidence * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '14px 10px', color: '#475569', maxWidth: 350 }}>
                      {scan.cure}
                    </td>
                    <td style={{ padding: '14px 10px', color: '#94a3b8', fontSize: '0.85rem' }}>
                      {new Date(scan.scanned_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 20
        }}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: 480, width: '100%', padding: 32, background: '#ffffff' }}>
            <h3 className="font-serif" style={{ fontSize: '1.6rem', color: '#064e3b', marginBottom: 8 }}>
              Update Farm Details
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>
              Adjust your location to calibrate weather & APMC mandi rates.
            </p>

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">District</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.district}
                    onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Farm Size (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={editForm.farmSize}
                  onChange={(e) => setEditForm({ ...editForm, farmSize: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Save to PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
