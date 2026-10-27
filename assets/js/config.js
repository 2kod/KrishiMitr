// KrishiMitra API Config - Decoupled from Firebase
// Backend: PostgreSQL + Express API on port 5001

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_CONFIG = {
  baseURL: isLocal ? 'http://localhost:5001/api' : 'https://krishimitra-api.onrender.com/api',
  aiServiceURL: isLocal ? 'http://localhost:8000' : 'https://krishimitra-ai.onrender.com'
};

const auth = {
  currentUser: (function() {
    try {
      const u = localStorage.getItem('krishimitr_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  })()
};

const db = {};

console.log("🌱 KrishiMitra PERN Architecture Active (No Firebase Dependencies)");

export { API_CONFIG, auth, db };