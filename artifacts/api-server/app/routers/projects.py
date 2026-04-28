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
from ..models import Project
from ..schemas import ProjectOut
from ..seeds import build_seed_projects

router = APIRouter()

ALLOWED_STATUS = {"Completed", "In Progress", "Upcoming"}

_seeded = False


def _ensure_seeded(db: Session) -> None:
    global _seeded
    if _seeded:
        return
    existing = db.execute(select(Project.id).limit(1)).first()
    if existing is None:
        db.add_all(build_seed_projects())
        db.commit()
    _seeded = True


def _normalize(body: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(body, dict):
        return None
    out: Dict[str, Any] = {}

    def s(field, src_key, max_len):
        if isinstance(body.get(src_key), str):
            out[field] = body[src_key][:max_len]

    s("title", "title", 500)
    s("category", "category", 80)

    status_val = body.get("status")
    if isinstance(status_val, str) and status_val in ALLOWED_STATUS:
        out["status"] = status_val

    s("employer", "employer", 500)
    s("original_contract_value", "originalContractValue", 200)
    s("subcontracting_amount", "subcontractingAmount", 200)
    s("awarded", "awarded", 80)
    s("completed", "completed", 80)

    if isinstance(body.get("scopeNote"), str):
        out["scope_note"] = body["scopeNote"][:8000]
    elif body.get("scopeNote") is None and "scopeNote" in body:
        out["scope_note"] = None

    s("hero", "hero", 2000)

    gallery = body.get("gallery")
    if isinstance(gallery, list):
        cleaned: List[str] = [g for g in gallery if isinstance(g, str)]
        out["gallery"] = cleaned[:30]

    sort_order = body.get("sortOrder")
    if isinstance(sort_order, (int, float)) and not isinstance(sort_order, bool):
        if math.isfinite(sort_order):
            out["sort_order"] = int(math.floor(sort_order))

    return out


def _serialize(p: Project) -> Dict[str, Any]:
    return jsonable_encoder(ProjectOut.model_validate(p), by_alias=True)


@router.get("/projects")
def list_projects(db: Session = Depends(get_db)):
    _ensure_seeded(db)
    rows = (
        db.execute(
            select(Project).order_by(Project.sort_order.asc(), Project.created_at.asc())
        )
        .scalars()
        .all()
    )
    return [_serialize(p) for p in rows]


@router.post("/projects", dependencies=[Depends(require_admin)])
async def create_project(request: Request, db: Session = Depends(get_db)):
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
    new_id = clean_id or f"proj-{int(time.time() * 1000)}-{secrets.token_hex(3)}"

    existing_sorts = db.execute(select(Project.sort_order)).all()
    max_sort = max((row[0] for row in existing_sorts), default=-1)
    next_sort = max_sort + 1

    project = Project(
        id=new_id,
        title=data["title"],
        category=data.get("category", "Other"),
        status=data.get("status", "Upcoming"),
        employer=data.get("employer", "N/A"),
        original_contract_value=data.get("original_contract_value", "N/A"),
        subcontracting_amount=data.get("subcontracting_amount", "N/A"),
        awarded=data.get("awarded", "N/A"),
        completed=data.get("completed", "N/A"),
        scope_note=data.get("scope_note"),
        hero=data.get("hero", ""),
        gallery=data.get("gallery", []),
        sort_order=data.get("sort_order", next_sort),
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=_serialize(project),
    )


@router.put("/projects/{project_id}", dependencies=[Depends(require_admin)])
async def update_project(
    project_id: str, request: Request, db: Session = Depends(get_db)
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

    project = db.get(Project, project_id)
    if project is None:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Project not found"},
        )

    for field, value in data.items():
        setattr(project, field, value)
    project.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(project)
    return _serialize(project)


@router.delete("/projects/{project_id}", dependencies=[Depends(require_admin)])
def delete_project(project_id: str, db: Session = Depends(get_db)):
    db.execute(sa_delete(Project).where(Project.id == project_id))
    db.commit()
    return {"ok": True}
