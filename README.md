# Inventory HR Management

A lightweight inventory tracker tailored for HR teams in an IT company. The FastAPI backend stores inventory data, while the React frontend presents a simple form for HR staff to log purchases or allocations, track stock, and keep an eye on quantities without requiring any authentication.

## Repository layout

- `backend/` – FastAPI service, SQLite (SQLModel) data layer, and API documentation.
- `frontend/` – Vite-powered React + TypeScript UI that talks to the backend.

## Getting started

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend listens on `http://127.0.0.1:8000` by default and exposes:
- `GET /items` to list inventory records.
- `POST /items` to add stock or bump quantities.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI defaults to `http://localhost:5173` and automatically points to `http://localhost:8000` for API calls. Override `VITE_API_BASE_URL` in a `.env` file if the backend runs on a different host/port.

## Workflow notes

- HR users can immediately add inventory by typing the name, quantity, description, and optional location. Entering an existing name increments the quantity.
- Inventory listings auto-refresh after each successful submission.
