# Backend — FastAPI Inventory API

This service powers the HR-facing inventory form. It is intentionally simple so HR staff can deploy and manage it without authentication or permissions handling.

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Development

```bash
uvicorn app.main:app --reload
```

The SQLite file `inventory.db` is created next to this module, and SQLModel automatically creates the `inventoryitem` table inside it.

## API Endpoints

| Method | Path     | Description |
|--------|----------|-------------|
| GET    | `/items` | List all inventory records |
| POST   | `/items` | Create or merge an inventory item (same name merges quantity, optional description/location overrides if provided) |
