import React from 'react';
import { Link } from 'react-router-dom';
import { Scan, TrendingUp, CloudSun, ShoppingBag, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, Cpu } from 'lucide-react';

export default function Landing() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%)',
        padding: '80px 0 60px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 900 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 30,
            background: '#d1fae5',
            color: '#065f46',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: 20
          }}>
            <Sparkles size={16} /> 100% Independent PERN Architecture • No Firebase
          </div>

          <h1 className="font-serif" style={{ fontSize: '3.6rem', color: '#064e3b', lineHeight: 1.15, marginBottom: 20 }}>
            Smart AI Companion for Every Indian Farmer 🌾
          </h1>

          <p style={{ fontSize: '1.25rem', color: '#475569', lineHeight: 1.6, marginBottom: 35, maxWidth: 750, margin: '0 auto 35px' }}>
            Instant YOLO leaf disease detection, live APMC mandi prices from your district, precision weather alerts, and verified fertilizer supplies directly at farm gate.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/scan" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              <Scan size={20} /> Launch AI Leaf Doctor
            </Link>
            <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              Farmer Dashboard <ArrowRight size={18} />
            </Link>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
            marginTop: 60,
            textAlign: 'left'
          }}>
            {[
              { title: 'YOLOv8 AI Engine', desc: 'Instant Leaf Pathogen Scanning', icon: <Cpu color="#10b981" /> },
              { title: 'PostgreSQL Relational DB', desc: 'Secure Farmer Profiles & Scans', icon: <ShieldCheck color="#10b981" /> },
              { title: 'Live Mandi Ticker', desc: 'Updated APMC Rates for 10+ States', icon: <TrendingUp color="#10b981" /> },
              { title: 'Precision Advisory', desc: 'State-Tailored Crop Guidance', icon: <CloudSun color="#10b981" /> },
            ].map((stat, i) => (
              <div key={i} className="glass-card" style={{ padding: 20 }}>
                <div style={{ marginBottom: 10 }}>{stat.icon}</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{stat.title}</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Solutions Bento Grid */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 className="font-serif" style={{ fontSize: '2.5rem', color: '#064e3b', marginBottom: 12 }}>
              Everything Your Farm Needs in One Portal
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
              Engineered with modern full-stack technologies to deliver lightning-fast response times.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 30
          }}>
            {/* Card 1: AI Scanner */}
            <div className="glass-card" style={{ padding: 32 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Scan size={26} color="#059669" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12 }}>AI Leaf Disease Doctor</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: 20 }}>
                Upload or snap photos of affected leaves. Our trained computer vision model detects Sigatoka, Anthracnose, Blight, and Powdery Mildew with actionable chemical & bio-remedies.
              </p>
              <Link to="/scan" className="btn btn-primary" style={{ width: '100%' }}>
                Test Leaf Scanner
              </Link>
            </div>

            {/* Card 2: Mandi Rates */}
            <div className="glass-card" style={{ padding: 32 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <TrendingUp size={26} color="#d97706" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12 }}>Live Mandi APMC Prices</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: 20 }}>
                Access verified market rates for Wheat, Mustard, Paddy, Cotton, Soybean, and Gram across Indian grain mandis so you sell at peak prices.
              </p>
              <Link to="/mandi" className="btn btn-secondary" style={{ width: '100%' }}>
                Explore Mandi Prices
              </Link>
            </div>

            {/* Card 3: Fertilizer Store */}
            <div className="glass-card" style={{ padding: 32 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <ShoppingBag size={26} color="#0284c7" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12 }}>Certified Agro Supplies</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: 20 }}>
                Direct booking for Neem Coated Urea, IFFCO DAP, Muriate of Potash, Organic Vermicompost, and bio-nutrients delivered to your village depot.
              </p>
              <Link to="/store" className="btn btn-secondary" style={{ width: '100%' }}>
                Browse Supplies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Call to Action */}
      <section style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
        color: '#ffffff',
        padding: '70px 0',
        borderRadius: 24,
        margin: '0 24px 60px'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 800 }}>
          <h2 className="font-serif" style={{ fontSize: '2.8rem', marginBottom: 16 }}>
            Ready to Empower Your Crop Yield?
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#a7f3d0', marginBottom: 32, lineHeight: 1.6 }}>
            Join thousands of progressive farmers using KrishiMitra daily. Free registration, zero subscriptions, and complete data privacy.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-accent" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              Create Free Farmer Account
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1.05rem', background: 'transparent', color: '#ffffff', borderColor: '#ffffff' }}>
              Farmer Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
