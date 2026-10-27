#!/bin/bash

# ==========================================================
# KrishiMitra - Start Complete Platform
# (PostgreSQL + Express API + HTML Frontend + React + Python YOLO)
# ==========================================================

echo "🌱 Starting KrishiMitra Agricultural Platform..."

# 1. Clean up lingering processes on ports 5001, 5500, 5173, and 8000
lsof -ti :5001 | xargs kill -9 2>/dev/null || true
lsof -ti :5500 | xargs kill -9 2>/dev/null || true
lsof -ti :5173 | xargs kill -9 2>/dev/null || true
lsof -ti :8000 | xargs kill -9 2>/dev/null || true

# 2. Check / Start PostgreSQL
if pg_isready -q; then
    echo "🐘 PostgreSQL Database: Active and connected (krishimitra)."
else
    echo "⚠️ PostgreSQL is starting via brew services..."
    brew services start postgresql@16 2>/dev/null || brew services start postgresql 2>/dev/null || true
    sleep 1
fi

# 3. Start Python YOLO Leaf Disease Detection API on Port 8000
echo "🤖 Starting AI YOLO Microservice on http://127.0.0.1:8000 ..."
cd _model
if [ -d ".venv" ]; then
    .venv/bin/uvicorn app:app --host 127.0.0.1 --port 8000 --reload &
else
    python3 app.py &
fi
AI_PID=$!
cd ..

# 4. Start Express.js API Backend on Port 5001 (PostgreSQL Powered)
echo "🚀 Starting Express.js PostgreSQL API on http://localhost:5001 ..."
cd server
npm start &
SERVER_PID=$!
cd ..

# 5. Start Original HTML Frontend on Port 5500 (Preserved Layout & Colors)
echo "🌐 Starting Original HTML Web App on http://localhost:5500 ..."
python3 -m http.server 5500 &
HTML_PID=$!

# 6. Start React Frontend on Port 5173
if [ -d "client" ]; then
    echo "⚛️ Starting React Frontend on http://localhost:5173 ..."
    cd client
    npm run dev -- --port 5173 &
    REACT_PID=$!
    cd ..
fi

sleep 2

# Auto-open the original HTML website (exact layout & colors) in default browser
if command -v open > /dev/null; then
    open "http://localhost:5500"
fi

echo ""
echo "=========================================================="
echo "🎉 KrishiMitra Platform is LIVE (Zero Firebase Dependencies)!"
echo "   - 🌐 Original Web App (Preserved Design): http://localhost:5500"
echo "   - 🚀 Express + PostgreSQL API:           http://localhost:5001/api/health"
echo "   - 🤖 AI YOLO Disease Scanner:            http://localhost:8000 (Docs: /docs)"
echo "   - ⚛️ React PERN Frontend:                 http://localhost:5173"
echo "   - 🐘 PostgreSQL Database:                krishimitra (localhost:5432)"
echo "=========================================================="
echo ""
echo "Press Ctrl+C to stop all servers."

# Trap Ctrl+C and kill all background processes
trap "echo 'Stopping all KrishiMitra services...'; kill $AI_PID $SERVER_PID $HTML_PID $REACT_PID 2>/dev/null; exit" INT
wait
