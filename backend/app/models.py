from typing import Optional

from sqlmodel import SQLModel, Field


class InventoryItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(..., description="Human-readable label for HR tracking")
    description: Optional[str] = Field(default=None)
    quantity: int = Field(default=0, ge=0)
    location: Optional[str] = Field(default=None, description="Optional storage location or custodian notes")
