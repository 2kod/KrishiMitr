# KrishiMitra 🌱 - Smart AI Agricultural Platform (PERN Stack)

**KrishiMitra** is a full-stack, enterprise-grade agricultural intelligence platform built for Indian farmers. It combines real-time computer vision leaf disease diagnosis (YOLOv8), live All-India APMC Mandi commodity rates, localized weather advisory, and certified fertilizer booking—built on the **PERN stack** (PostgreSQL, Express.js, React.js, Node.js) and completely independent of Firebase.

---

## ⚡ Tech Stack Architecture

- **Frontend:** React 19 (Vite), React Router v7, Lucide Icons, Modern Vanilla CSS Design Tokens
- **Backend API Gateway:** Node.js & Express.js (Port `5001`), JWT Authentication, Bcrypt password hashing
- **Database:** PostgreSQL (`krishimitra` on Port `5432`), Connection pooling via `pg`, automated schema migrations
- **AI Microservice:** Python 3 + FastAPI + Uvicorn (Port `8000`), Ultralytics YOLOv8 leaf disease detection
- **Decoupled from Firebase:** 100% self-hosted auth, database, and business logic. Zero Firebase payments, quota blocks, or vendor lock-in.

---

## 📂 Project Directory Structure

```text
KrishiMitr/
├── client/                     # ⚛️ React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, UI widgets
│   │   ├── context/            # AuthContext (JWT, user state, demo login)
│   │   ├── pages/              # Landing, Login, Signup, Dashboard, Scan, MandiPrices, FertilizerStore
│   │   ├── App.jsx             # React Router route registry
│   │   └── index.css           # Agricultural design system (Emerald & Amber)
│   ├── vite.config.js          # Port 5173 with /api proxy to 5001
│   └── package.json
│
├── server/                     # 🚀 Node.js / Express.js Backend
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.js        # PostgreSQL pg connection pool
│   │   │   ├── schema.sql      # Database DDL & initial seed datasets
│   │   │   └── migrate.js      # Auto-migration runner
│   │   ├── middleware/         # JWT auth middleware (requireAuth, optionalAuth)
│   │   ├── controllers/        # auth, dashboard, mandi, scan, store controllers
│   │   ├── routes/             # REST route handlers under /api
│   │   └── index.js            # Express entrypoint on Port 5001
│   ├── .env                    # Port, DB connection string, JWT Secret
│   └── package.json
│
├── _model/                     # 🤖 Python FastAPI AI Microservice
│   ├── app.py                  # Leaf disease prediction endpoint (/predict & /)
│   ├── best.pt                 # YOLO model weights
│   ├── requirements.txt        # FastAPI, Uvicorn, Ultralytics, Pillow
│   └── README.md
│
├── start_project.sh            # 🌟 One-command launcher for all services
└── README.md
```

---

## 🚀 Quick Start (One Command)

To run the complete platform (PostgreSQL + Express + React + Python AI):

```bash
chmod +x start_project.sh
./start_project.sh
```

This single command automatically:
1. Cleans up any hanging processes on ports 5001, 5173, and 8000.
2. Connects to PostgreSQL and verifies the database.
3. Launches the **Python YOLO AI Service** on `http://127.0.0.1:8000`.
4. Launches the **Express.js API Gateway** on `http://localhost:5001` (running migrations automatically).
5. Launches the **Vite React Frontend** on `http://localhost:5173`.
6. Opens `http://localhost:5173` directly in your default browser.

---

## 🌐 Service Ports & Endpoints

| Service | Port / URL | Description |
| :--- | :--- | :--- |
| **React Web App** | `http://localhost:5173` | Complete farmer web portal |
| **Express API Gateway** | `http://localhost:5001/api` | REST endpoints for auth, crops, mandi, orders |
| **API Health Check** | `http://localhost:5001/api/health` | Gateway status & PostgreSQL connectivity |
| **AI YOLO Microservice** | `http://127.0.0.1:8000` | FastAPI leaf pathogen detector |
| **Swagger API Docs** | `http://127.0.0.1:8000/docs` | Interactive Swagger documentation |
| **PostgreSQL Database** | `localhost:5432/krishimitra` | Relational tables for farmers, scans, mandi prices |

---

## 🔑 REST API Reference

### 1. Authentication (`/api/auth`)
- `POST /api/auth/register`: Create a new farmer account (Full Name, Email, Password, State, District, Farm Size).
- `POST /api/auth/login`: Authenticate with email & password, returns JWT token.
- `GET /api/auth/me`: Fetch authenticated farmer profile (Bearer token required).
- `PUT /api/auth/profile`: Update farm size, location, or contact details.

### 2. Dashboard (`/api/dashboard`)
- `GET /api/dashboard`: Aggregated vitals including recommended crops for farmer's state, local mandi prices, and recent AI scan history.

### 3. Mandi Market Rates (`/api/mandi`)
- `GET /api/mandi?state=Rajasthan&district=Jaipur`: Filter wholesale commodity prices by state, district, or crop name.

### 4. AI Leaf Disease Scanner (`/api/scan`)
- `POST /api/scan`: Upload multipart leaf photo (`file`). Proxies to Python YOLO microservice, saves scan report in PostgreSQL, returns confidence score and treatment remedies.
- `GET /api/scan/history`: Retrieve farmer's historical disease scan logs.

### 5. Fertilizer Store (`/api/store`)
- `GET /api/store/products?category=Organic`: Fetch certified fertilizer items.
- `POST /api/store/orders`: Place direct farm gate fertilizer order inquiry.
- `GET /api/store/my-orders`: Retrieve farmer's active orders.

---

## 🐘 PostgreSQL Database Setup (Manual if needed)

If you wish to manage PostgreSQL independently:
```bash
# Connect to PostgreSQL
psql -d postgres

# Create database
CREATE DATABASE krishimitra;

# Run migrations and seed data
cd server
npm run migrate
```

---

## 🔒 Disconnected from Firebase
Firebase Authentication, Firestore, and Firebase Hosting have been **completely removed**:
- **Authentication:** Replaced by self-contained JWT tokens + bcrypt hashing in Express.
- **Database:** Replaced by local PostgreSQL (`krishimitra`), supporting relational joins and ACID transactions.
- **Storage/Hosting:** Handled via Express static uploads and Vite client bundle.
- **Zero Third-Party Vendor Blocks:** No referer restrictions, no quota limits, no billing surprises.
