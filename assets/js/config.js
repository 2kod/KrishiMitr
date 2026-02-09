// 1. Import SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 2. Your Config (Paste your REAL keys here)
const firebaseConfig = {
  apiKey: "AIzaSyAqKiUYPHAr5IZJxmzXERBH4Fysw_WyZmM",
  authDomain: "krishimitra-in.firebaseapp.com",
  projectId: "krishimitra-in",
  storageBucket: "krishimitra-in.firebasestorage.app",
  messagingSenderId: "358772049936",
  appId: "1:358772049936:web:c9e0d15e907216519fa295",
  measurementId: "G-X0ZCQFY7E6"
};

// 3. Initialize Everything ONCE
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// 4. Log to confirm it's working
console.log("🔥 Firebase & Analytics Initialized Globally");

// 5. Export Instances so other files can use them
export { app, analytics, auth, db };