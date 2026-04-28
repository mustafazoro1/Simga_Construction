"""SQLAlchemy ORM models matching the existing drizzle-managed tables.

Column names and types must match `lib/db/src/schema/*` exactly — the schema
was created and is owned by drizzle-kit, we just read/write rows here.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from sqlalchemy import Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, nullable=False)
    phone: Mapped[str] = mapped_column(Text, nullable=False)
    subject: Mapped[str] = mapped_column(Text, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        "created_at", server_default=func.now(), nullable=False
    )


class SiteContent(Base):
    __tablename__ = "site_content"

    key: Mapped[str] = mapped_column(String(256), primary_key=True)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        "updated_at", server_default=func.now(), nullable=False
    )


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(Text, nullable=False, default="Other")
    status: Mapped[str] = mapped_column(Text, nullable=False, default="Upcoming")
    employer: Mapped[str] = mapped_column(Text, nullable=False, default="N/A")
    original_contract_value: Mapped[str] = mapped_column(
        "original_contract_value", Text, nullable=False, default="N/A"
    )
    subcontracting_amount: Mapped[str] = mapped_column(
        "subcontracting_amount", Text, nullable=False, default="N/A"
    )
    awarded: Mapped[str] = mapped_column(Text, nullable=False, default="N/A")
    completed: Mapped[str] = mapped_column(Text, nullable=False, default="N/A")
    scope_note: Mapped[Optional[str]] = mapped_column(
        "scope_note", Text, nullable=True
    )
    hero: Mapped[str] = mapped_column(Text, nullable=False, default="")
    gallery: Mapped[List[str]] = mapped_column(JSONB, nullable=False, default=list)
    sort_order: Mapped[int] = mapped_column(
        "sort_order", Integer, nullable=False, default=0
    )
    created_at: Mapped[datetime] = mapped_column(
        "created_at", server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        "updated_at", server_default=func.now(), nullable=False
    )


class Service(Base):
    __tablename__ = "services"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    long_description: Mapped[str] = mapped_column(
        "long_description", Text, nullable=False, default=""
    )
    image: Mapped[str] = mapped_column(Text, nullable=False, default="")
    why_best: Mapped[List[str]] = mapped_column(
        "why_best", JSONB, nullable=False, default=list
    )
    icon: Mapped[str] = mapped_column(Text, nullable=False, default="HardHat")
    sort_order: Mapped[int] = mapped_column(
        "sort_order", Integer, nullable=False, default=0
    )
    created_at: Mapped[datetime] = mapped_column(
        "created_at", server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        "updated_at", server_default=func.now(), nullable=False
    )
