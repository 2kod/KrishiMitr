import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Search, MapPin, RefreshCw, Filter } from 'lucide-react';

export default function MandiPrices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    fetchPrices();
  }, [selectedState]);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const url = selectedState ? `/api/mandi?state=${selectedState}` : '/api/mandi';
      const res = await axios.get(url);
      if (res.data.success) {
        setPrices(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching mandi prices:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrices = prices.filter((p) =>
    p.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.market && p.market.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 24px 100px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span className="badge badge-amber" style={{ marginBottom: 12 }}>
          🌾 National APMC e-NAM Benchmark
        </span>
        <h1 className="font-serif" style={{ fontSize: '2.8rem', color: '#064e3b', marginBottom: 12 }}>
          Live Mandi Commodity Rates
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 650, margin: '0 auto' }}>
          Real-time wholesale market prices for Indian agricultural produce, powered by PostgreSQL.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: 260, position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 42 }}
              placeholder="Search commodity (e.g. Wheat, Mustard, Cotton)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ flex: 1, minWidth: 180 }}>
            <select
              className="form-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">All States</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Bihar">Bihar</option>
              <option value="Punjab">Punjab</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>

          <button onClick={fetchPrices} className="btn btn-secondary" style={{ gap: 6 }}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="glass-card" style={{ padding: 32 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            <p>Loading market prices from PostgreSQL...</p>
          </div>
        ) : filteredPrices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
            <p>No mandi records found matching your filter criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '14px 12px' }}>Commodity</th>
                  <th style={{ padding: '14px 12px' }}>State / District</th>
                  <th style={{ padding: '14px 12px' }}>Mandi / APMC Yard</th>
                  <th style={{ padding: '14px 12px', textAlign: 'right' }}>Min Price (₹/Qtl)</th>
                  <th style={{ padding: '14px 12px', textAlign: 'right' }}>Max Price (₹/Qtl)</th>
                  <th style={{ padding: '14px 12px', textAlign: 'right' }}>Modal Price</th>
                  <th style={{ padding: '14px 12px', textAlign: 'center' }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrices.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                    <td style={{ padding: '16px 12px', fontWeight: 700, color: '#0f172a' }}>
                      {item.commodity}
                    </td>
                    <td style={{ padding: '16px 12px', color: '#475569' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={14} color="#10b981" /> {item.district}, {item.state}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px', color: '#64748b' }}>
                      {item.market || `${item.district} Central`}
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'right', color: '#64748b' }}>
                      ₹{parseFloat(item.min_price || item.modal_price * 0.95).toFixed(0)}
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'right', color: '#64748b' }}>
                      ₹{parseFloat(item.max_price || item.modal_price * 1.05).toFixed(0)}
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'right', fontWeight: 800, fontSize: '1.05rem', color: '#065f46' }}>
                      ₹{parseFloat(item.modal_price).toFixed(0)}
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                      <span className={`badge ${item.trend === 'up' ? 'badge-green' : 'badge-red'}`}>
                        {item.trend === 'up' ? '▲ Bullish' : '▼ Bearish'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
