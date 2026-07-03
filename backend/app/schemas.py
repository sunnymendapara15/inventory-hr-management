from typing import Optional

from sqlmodel import SQLModel, Field


class InventoryBase(SQLModel):
    name: str = Field(..., description="Inventory label used by HR")
    description: Optional[str] = None
    quantity: int = Field(..., ge=0)
    location: Optional[str] = None


class InventoryCreate(InventoryBase):
    """Submitted payload when HR adds or merges stock."""


class InventoryRead(InventoryBase):
    id: int
