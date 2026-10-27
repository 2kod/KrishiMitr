import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, CheckCircle, Package, Truck, ShieldCheck, Tag } from 'lucide-react';

export default function FertilizerStore() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = category ? `/api/store/products?category=${category}` : '/api/store/products';
      const res = await axios.get(url);
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOrder = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setOrderSuccess(null);
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setOrdering(true);

    try {
      const totalPrice = selectedProduct.price * quantity;
      const res = await axios.post('/api/store/orders', {
        productName: selectedProduct.name,
        quantity,
        totalPrice,
        district: user?.district || 'Jaipur',
        farmerName: user?.full_name || 'Kisan Ramesh',
        farmerPhone: user?.phone || '+91 98765 43210'
      });

      if (res.data.success) {
        setOrderSuccess(res.data.order);
        setSelectedProduct(null);
      }
    } catch (err) {
      alert('Order placement failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 24px 100px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span className="badge badge-green" style={{ marginBottom: 12 }}>
          🌾 Certified Agro Supplies • DBT Subsidized Rates
        </span>
        <h1 className="font-serif" style={{ fontSize: '2.8rem', color: '#064e3b', marginBottom: 12 }}>
          Certified Fertilizers & Bio-Nutrients
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 650, margin: '0 auto' }}>
          Genuine fertilizer bags sourced directly from cooperative plants (IFFCO, KRIBHCO) delivered to village collection points.
        </p>
      </div>

      {/* Success Notification */}
      {orderSuccess && (
        <div className="glass-card animate-fade-in" style={{
          background: '#ecfdf5',
          border: '2px solid #10b981',
          padding: 24,
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <CheckCircle size={32} color="#059669" />
          <div>
            <h4 style={{ fontSize: '1.15rem', color: '#065f46', fontWeight: 700 }}>
              Order Confirmed (ID #{orderSuccess.id})!
            </h4>
            <p style={{ color: '#047857', fontSize: '0.92rem' }}>
              Successfully recorded in PostgreSQL. Your order for <strong>{orderSuccess.quantity}x {orderSuccess.product_name}</strong> (Total ₹{orderSuccess.total_price}) has been assigned to the {orderSuccess.district} Kisan Seva Kendra.
            </p>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
        {[
          { label: 'All Products', value: '' },
          { label: 'Chemical Fertilizers', value: 'Chemical' },
          { label: 'Organic & Bio-Manure', value: 'Organic' },
          { label: 'Micronutrients', value: 'Micronutrient' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategory(tab.value)}
            className={`btn ${category === tab.value ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 20px', borderRadius: 24, fontSize: '0.9rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 30 }}>
        {products.map((item) => (
          <div key={item.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: 200, width: '100%', background: '#f1f5f9', overflow: 'hidden', position: 'relative' }}>
              <img
                src={item.image_url}
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span className={`badge ${item.category === 'Organic' ? 'badge-green' : item.category === 'Chemical' ? 'badge-blue' : 'badge-amber'}`} style={{
                position: 'absolute',
                top: 14,
                left: 14
              }}>
                {item.category}
              </span>
            </div>

            <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                  {item.name}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 16 }}>
                  {item.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#065f46' }}>₹{item.price}</span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: 4 }}>/ {item.unit}</span>
                </div>

                <button
                  onClick={() => handleOpenOrder(item)}
                  className="btn btn-primary"
                  style={{ padding: '10px 18px', fontSize: '0.9rem' }}
                >
                  <ShoppingBag size={16} /> Book Supply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Order Modal */}
      {selectedProduct && (
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
          <div className="glass-card animate-fade-in" style={{ maxWidth: 450, width: '100%', padding: 32, background: '#ffffff' }}>
            <h3 className="font-serif" style={{ fontSize: '1.6rem', color: '#064e3b', marginBottom: 6 }}>
              Confirm Fertilizer Booking
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>
              Order placed directly to cooperative agro-depots.
            </p>

            <form onSubmit={handleConfirmOrder}>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 20, border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{selectedProduct.name}</h4>
                <div style={{ color: '#059669', fontWeight: 700, fontSize: '1.1rem' }}>
                  ₹{selectedProduct.price} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>per {selectedProduct.unit}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity ({selectedProduct.unit}s)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="btn btn-secondary"
                    style={{ width: 44, height: 44, padding: 0, fontSize: '1.2rem', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '1.4rem', fontWeight: 700, minWidth: 40, textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="btn btn-secondary"
                    style={{ width: 44, height: 44, padding: 0, fontSize: '1.2rem', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', margin: '20px 0 16px', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#475569' }}>Total Bill:</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#065f46' }}>
                  ₹{(selectedProduct.price * quantity).toFixed(2)}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={ordering}
                >
                  {ordering ? 'Saving to Database...' : 'Place Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
