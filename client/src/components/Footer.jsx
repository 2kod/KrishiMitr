import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="logo" style={{ color: '#ffffff', marginBottom: 14 }}>
              <Sprout size={24} color="#10b981" />
              कृषिMitra<span>.</span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 16 }}>
              Empowering Indian farmers with real-time AI disease diagnostics, live Mandi APMC prices, precision weather advisory, and certified fertilizer delivery.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1e293b', padding: '8px 16px', borderRadius: 8, color: '#38bdf8', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} />
              <span>Full PERN Stack (PostgreSQL + Express + React + Node)</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Solutions</h4>
            <ul className="footer-links">
              <li><Link to="/scan">AI Leaf Doctor (YOLO)</Link></li>
              <li><Link to="/mandi">Live Mandi Prices</Link></li>
              <li><Link to="/dashboard">Farmer Advisory</Link></li>
              <li><Link to="/store">Certified Fertilizers</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/login">Farmer Portal</Link></li>
              <li><Link to="/signup">New Registration</Link></li>
              <li><a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer">PM-Kisan Portal</a></li>
              <li><a href="https://enam.gov.in" target="_blank" rel="noreferrer">e-NAM Mandi</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Kisan Helpline</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f59e0b', fontSize: '1.2rem', fontWeight: 700, margin: '10px 0' }}>
              <Phone size={20} />
              <span>1800-180-1551</span>
            </div>
            <p style={{ fontSize: '0.85rem' }}>Toll-Free National Kisan Call Center (6:00 AM - 10:00 PM)</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} कृषिMitra. Built with <Heart size={14} style={{ display: 'inline', color: '#ef4444' }} /> for Indian Agriculture. Zero Firebase dependencies.</p>
        </div>
      </div>
    </footer>
  );
}
