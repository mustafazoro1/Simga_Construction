import re
from datetime import datetime
from typing import Any, Dict

from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy import delete as sa_delete
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.orm import Session

from ..auth import require_admin
from ..db import get_db
from ..models import SiteContent

router = APIRouter()

KEY_PATTERN = re.compile(r"^[a-zA-Z0-9._-]+$")
MAX_KEY_LEN = 256
MAX_VALUE_LEN = 20000


def _is_valid_key(key: str) -> bool:
    return bool(key) and len(key) <= MAX_KEY_LEN and bool(KEY_PATTERN.match(key))


@router.get("/content")
def get_content(db: Session = Depends(get_db)) -> Dict[str, str]:
    rows = db.query(SiteContent.key, SiteContent.value).all()
    return {row.key: row.value for row in rows}


@router.put("/content/{key}", dependencies=[Depends(require_admin)])
async def put_content(key: str, request: Request, db: Session = Depends(get_db)):
    if not _is_valid_key(key):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Invalid key"},
        )

    body: Any
    try:
        body = await request.json()
    except Exception:
        body = None

    value = body.get("value") if isinstance(body, dict) else None
    if not isinstance(value, str):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Body must contain a 'value' string"},
        )
    if len(value) > MAX_VALUE_LEN:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Value too long"},
        )

    now = datetime.utcnow()
    stmt = pg_insert(SiteContent).values(key=key, value=value, updated_at=now)
    stmt = stmt.on_conflict_do_update(
        index_elements=[SiteContent.key],
        set_={"value": value, "updated_at": now},
    )
    db.execute(stmt)
    db.commit()
    return {"ok": True, "key": key, "value": value}


@router.delete("/content/{key}", dependencies=[Depends(require_admin)])
def delete_content_key(key: str, db: Session = Depends(get_db)):
    if not _is_valid_key(key):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Invalid key"},
        )
    db.execute(sa_delete(SiteContent).where(SiteContent.key == key))
    db.commit()
    return {"ok": True}


@router.delete("/content", dependencies=[Depends(require_admin)])
def delete_all_content(db: Session = Depends(get_db)):
    db.execute(sa_delete(SiteContent))
    db.commit()
    return {"ok": True}
