"""Database engine + session helpers.

Reuses the existing PostgreSQL schema that was created by drizzle-kit.
We only read/write rows — we never run migrations from Python.
"""

from __future__ import annotations

import os
import re

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import declarative_base, scoped_session, sessionmaker

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL must be set. Did you forget to provision a database?"
    )

# psycopg v3 uses the `postgresql+psycopg://` SQLAlchemy dialect.
# The DATABASE_URL provided by Replit is `postgresql://...` or `postgres://...`,
# so we normalize the scheme here so SQLAlchemy picks the psycopg3 driver.
_normalized_url = re.sub(
    r"^postgres(ql)?(\+\w+)?://",
    "postgresql+psycopg://",
    DATABASE_URL,
    count=1,
)

engine: Engine = create_engine(
    _normalized_url,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=5,
    future=True,
)

SessionLocal = scoped_session(
    sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
)

Base = declarative_base()


def get_db():
    """FastAPI dependency yielding a thread-local SQLAlchemy session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        SessionLocal.remove()
