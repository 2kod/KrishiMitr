import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, User, LogOut, Scan, TrendingUp, ShoppingBag, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <Sprout size={28} color="#10b981" />
          कृषिMitra<span>.</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <LayoutDashboard size={16} /> Dashboard
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/scan" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Scan size={16} /> AI Leaf Doctor
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/mandi" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <TrendingUp size={16} /> Mandi Rates
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/store" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ShoppingBag size={16} /> Fertilizers
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link
                to="/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 20,
                  background: '#ecfdf5',
                  color: '#065f46',
                  fontWeight: 600,
                  fontSize: '0.88rem'
                }}
              >
                <User size={16} />
                <span>{user?.full_name?.split(' ')[0] || 'Farmer'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ backgroundColor: '#e74c3c', border: 'none', color: 'white', cursor: 'pointer', padding: '8px 20px', borderRadius: '50px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                title="Logout"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ backgroundColor: '#e74c3c', border: 'none', color: 'white', cursor: 'pointer', padding: '8px 20px', borderRadius: '50px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                title="Logout"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
