# KrishiMitra AI Leaf Disease Detection Service 🍃

This folder contains the trained YOLO object detection model (`best.pt`) and the FastAPI backend service that powers the **AI Leaf Doctor** on `pages/scan.html`.

## 📦 Files

- `best.pt`: Trained YOLO model weights for leaf diseases.
- `app.py`: FastAPI application serving predictions at `/predict` and health check at `/`.
- `requirements.txt`: Python package dependencies.
- `test_model.py`: Quick test script to verify model loading.
- `Untitled0.ipynb`: Jupyter training/evaluation notebook.

---

## 🚀 How to Run the Server

### 1. Activate your Python environment or create a new one:
```bash
cd _model
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install dependencies:
```bash
pip install -r requirements.txt
```

### 3. Start the FastAPI server:
```bash
python app.py
```
Or with uvicorn directly:
```bash
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

The service will run at:
- **API URL:** `http://127.0.0.1:8000`
- **Swagger Docs:** `http://127.0.0.1:8000/docs`
- **Prediction Endpoint:** `POST http://127.0.0.1:8000/predict` (multipart `file`)

---

## 🌐 Connecting to Frontend
When the server is running on `http://127.0.0.1:8000`, opening `pages/scan.html` will automatically connect to this live service. If the server is offline, the page will notify you and allow simulation mode.
