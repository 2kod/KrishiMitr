import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('km_token') || null);
  const [loading, setLoading] = useState(true);

  // Set default axios Authorization header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('km_token', token);
      fetchCurrentUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('km_token');
      localStorage.removeItem('km_user');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data.success) {
        setUser(res.data.farmer);
        localStorage.setItem('km_user', JSON.stringify(res.data.farmer));
      }
    } catch (err) {
      console.warn('Could not fetch /api/auth/me, checking cached user:', err.message);
      const cached = localStorage.getItem('km_user');
      if (cached) setUser(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.farmer);
      localStorage.setItem('km_user', JSON.stringify(res.data.farmer));
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await axios.post('/api/auth/register', formData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.farmer);
      localStorage.setItem('km_user', JSON.stringify(res.data.farmer));
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const loginAsDemo = () => {
    const demoFarmer = {
      id: 999,
      full_name: 'Kisan Ramesh Kumar',
      email: 'ramesh.farmer@krishimitr.in',
      phone: '+91 98765 43210',
      state: 'Rajasthan',
      district: 'Jaipur',
      pincode: '302001',
      farm_size: '5.00',
      isDemo: true
    };
    setUser(demoFarmer);
    localStorage.setItem('km_user', JSON.stringify(demoFarmer));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('km_token');
    localStorage.removeItem('km_user');
  };

  const updateProfile = async (data) => {
    if (user?.isDemo) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('km_user', JSON.stringify(updated));
      return { success: true, farmer: updated };
    }
    const res = await axios.put('/api/auth/profile', data);
    if (res.data.success) {
      setUser(res.data.farmer);
      localStorage.setItem('km_user', JSON.stringify(res.data.farmer));
      return res.data;
    }
    throw new Error(res.data.message || 'Failed to update profile');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginAsDemo,
        logout,
        updateProfile,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
