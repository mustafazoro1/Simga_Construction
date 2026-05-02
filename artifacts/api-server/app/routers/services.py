import math
import re
import time
import secrets
from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy import select, delete as sa_delete
from sqlalchemy.orm import Session

from ..auth import require_admin
from ..db import get_db
from ..models import Service
from ..schemas import ServiceOut
from ..seeds import build_seed_services

router = APIRouter()

ALLOWED_ICONS = {"Truck", "Waves", "Bridge", "Droplets", "Mountain", "HardHat"}

_seeded = False


def _ensure_seeded(db: Session) -> None:
    global _seeded
    if _seeded:
        return
    existing = db.execute(select(Service.id).limit(1)).first()
    if existing is None:
        db.add_all(build_seed_services())
        db.commit()
    _seeded = True


def _normalize(body: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(body, dict):
        return None
    out: Dict[str, Any] = {}

    def s(field, src_key, max_len):
        if isinstance(body.get(src_key), str):
            out[field] = body[src_key][:max_len]

    s("title", "title", 200)
    s("description", "description", 2000)
    s("long_description", "longDescription", 8000)
    s("image", "image", 2000)

    icon = body.get("icon")
    if isinstance(icon, str):
        out["icon"] = icon if icon in ALLOWED_ICONS else "HardHat"

    why = body.get("whyBest")
    if isinstance(why, list):
        cleaned: List[str] = []
        for item in why:
            if isinstance(item, str) and item.strip():
                cleaned.append(item[:300])
        out["why_best"] = cleaned[:12]

    sort_order = body.get("sortOrder")
    if isinstance(sort_order, (int, float)) and not isinstance(sort_order, bool):
        if math.isfinite(sort_order):
            out["sort_order"] = int(math.floor(sort_order))

    return out


def _serialize(s: Service) -> Dict[str, Any]:
    return jsonable_encoder(ServiceOut.model_validate(s), by_alias=True)


@router.get("/services")
def list_services(db: Session = Depends(get_db)):
    _ensure_seeded(db)
    rows = (
        db.execute(
            select(Service).order_by(Service.sort_order.asc(), Service.created_at.asc())
        )
        .scalars()
        .all()
    )
    return [_serialize(s) for s in rows]


@router.post("/services", dependencies=[Depends(require_admin)])
async def create_service(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
    except Exception:
        body = None

    data = _normalize(body)
    if data is None or not data.get("title"):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "title is required"},
        )

    raw_id = body.get("id") if isinstance(body, dict) else ""
    if not isinstance(raw_id, str):
        raw_id = ""
    clean_id = re.sub(r"[^a-zA-Z0-9._-]", "", raw_id)[:64]
    new_id = clean_id or f"svc-{int(time.time() * 1000)}-{secrets.token_hex(3)}"

    existing_sorts = db.execute(select(Service.sort_order)).all()
    max_sort = max((row[0] for row in existing_sorts), default=-1)
    next_sort = max_sort + 1

    service = Service(
        id=new_id,
        title=data["title"],
        description=data.get("description", ""),
        long_description=data.get("long_description", ""),
        image=data.get("image", ""),
        why_best=data.get("why_best", []),
        icon=data.get("icon", "HardHat"),
        sort_order=data.get("sort_order", next_sort),
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=_serialize(service),
    )


@router.put("/services/{service_id}", dependencies=[Depends(require_admin)])
async def update_service(
    service_id: str, request: Request, db: Session = Depends(get_db)
):
    try:
        body = await request.json()
    except Exception:
        body = None

    data = _normalize(body)
    if data is None:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Invalid body"},
        )

    service = db.get(Service, service_id)
    if service is None:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Service not found"},
        )

    for field, value in data.items():
        setattr(service, field, value)
    service.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(service)
    return _serialize(service)


@router.delete("/services/{service_id}", dependencies=[Depends(require_admin)])
def delete_service(service_id: str, db: Session = Depends(get_db)):
    db.execute(sa_delete(Service).where(Service.id == service_id))
    db.commit()
    return {"ok": True}
