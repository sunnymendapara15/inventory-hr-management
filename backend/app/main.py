from typing import List

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from .database import get_session, init_db
from .models import InventoryItem
from .schemas import InventoryCreate, InventoryRead


app = FastAPI(
    title="Inventory HR Management API",
    description="No-login inventory tracker for HR staff in the IT department.",
    version="1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/", tags=["root"])
def read_root() -> dict:
    return {"message": "Inventory service ready for HR."}


@app.get("/items", response_model=List[InventoryRead], tags=["inventory"])
def list_items(session: Session = Depends(get_session)) -> List[InventoryRead]:
    statement = select(InventoryItem).order_by(InventoryItem.name)
    return session.exec(statement).all()


@app.post("/items", response_model=InventoryRead, status_code=201, tags=["inventory"])
def create_item(
    payload: InventoryCreate, session: Session = Depends(get_session)
) -> InventoryRead:
    existing = (
        session.exec(select(InventoryItem).where(InventoryItem.name == payload.name)).first()
    )

    if existing:
        existing.quantity = max(existing.quantity + payload.quantity, 0)
        if payload.description:
            existing.description = payload.description
        if payload.location:
            existing.location = payload.location
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing

    item = InventoryItem.from_orm(payload)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item
