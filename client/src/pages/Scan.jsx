import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, ShoppingBag, Sparkles, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Scan() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError('');
    } else {
      setError('Please upload a valid image file (JPG, PNG).');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  };

  const handleScan = async () => {
    if (!selectedFile) return;
    setAnalyzing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await axios.post('/api/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setResult(res.data.result);
      } else {
        throw new Error(res.data.message || 'Diagnostic failed');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError(err.response?.data?.message || err.message || 'Could not analyze leaf. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 24px 100px', maxWidth: 900 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
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
          marginBottom: 16
        }}>
          <Cpu size={16} /> YOLOv8 Computer Vision • Express API Gateway
        </div>
        <h1 className="font-serif" style={{ fontSize: '2.8rem', color: '#064e3b', marginBottom: 12 }}>
          AI Crop Leaf Doctor 🍃
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: 650, margin: '0 auto', lineHeight: 1.6 }}>
          Snap a photo of any discolored, spotted, or curled crop leaf. Our neural network detects early stage pathogens and prescribes organic & chemical remedies.
        </p>
      </div>

      {/* Main Upload Box */}
      <div className="glass-card" style={{ padding: 40, marginBottom: 32 }}>
        {!previewUrl ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed #10b981',
              borderRadius: 20,
              padding: '60px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#f0fdf4',
              transition: 'background 0.2s ease'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)',
              marginBottom: 18
            }}>
              <UploadCloud size={32} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#065f46', marginBottom: 8 }}>
              Click to browse or drag & drop leaf photo
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Supports Wheat, Paddy, Banana, Chilli, Tomato, Cotton (JPG, PNG up to 10MB)
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 30, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: 240, height: 240, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: '#000' }}>
                <img
                  src={previewUrl}
                  alt="Crop Leaf Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ marginBottom: 16 }}>
                  <span className="badge badge-green" style={{ marginBottom: 8 }}>Image Loaded</span>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedFile?.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB • Ready for neural inference
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={handleScan}
                    className="btn btn-primary"
                    style={{ flex: 2, padding: '14px', fontSize: '1rem' }}
                    disabled={analyzing}
                  >
                    {analyzing ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" /> Analyzing with YOLO...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} /> Analyze Leaf Health
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    disabled={analyzing}
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '14px 20px',
            borderRadius: 12,
            fontSize: '0.92rem',
            marginTop: 20
          }}>
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Result Card */}
      {result && (
        <div className="glass-card animate-fade-in" style={{
          padding: 36,
          border: `2px solid ${result.isHealthy ? '#10b981' : '#f59e0b'}`,
          background: result.isHealthy ? '#f0fdf4' : '#fffbeb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <span className={`badge ${result.isHealthy ? 'badge-green' : result.severity === 'High' ? 'badge-red' : 'badge-amber'}`} style={{ marginBottom: 10 }}>
                {result.isHealthy ? '✓ Healthy Plant Tissue' : `⚠️ Detected: ${result.severity} Severity`}
              </span>
              <h2 className="font-serif" style={{ fontSize: '2rem', color: '#0f172a' }}>
                {result.diseaseName}
              </h2>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'block' }}>Model Confidence</span>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#065f46' }}>
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 24 }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#065f46', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={18} /> Agronomic Treatment & Spray Advisory
            </h4>
            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.7 }}>
              {result.cure}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              💾 Diagnostic report saved permanently to your PostgreSQL farmer history.
            </span>
            <Link to="/store" className="btn btn-accent" style={{ gap: 8 }}>
              <ShoppingBag size={18} /> View Matching Fertilizers & Fungicides
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
