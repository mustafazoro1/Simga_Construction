import base64
import os
import re
import secrets
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import JSONResponse

from ..auth import require_admin

router = APIRouter()

UPLOADS_DIR = Path(os.getcwd()) / "uploads"

MAX_BYTES = 12 * 1024 * 1024  # 12 MB
DATA_URL_RE = re.compile(r"^data:([a-zA-Z0-9.+/-]+);base64,(.+)$", re.DOTALL)
SAFE_FILENAME_RE = re.compile(r"[^a-z0-9._-]", re.IGNORECASE)
HAS_EXT_RE = re.compile(r"\.[a-z0-9]{2,5}$", re.IGNORECASE)
EXT_CLEAN_RE = re.compile(r"[^a-z0-9]", re.IGNORECASE)


@router.post("/admin/upload", dependencies=[Depends(require_admin)])
async def upload(request: Request):
    try:
        body: Any = await request.json()
    except Exception:
        body = None

    if not isinstance(body, dict):
        body = {}

    raw_filename = body.get("filename")
    filename = raw_filename if isinstance(raw_filename, str) else "image"

    raw_data_url = body.get("dataUrl")
    data_url = raw_data_url if isinstance(raw_data_url, str) else ""

    match = DATA_URL_RE.match(data_url)
    if not match:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Invalid data URL"},
        )

    mime = match.group(1).lower()
    if not mime.startswith("image/"):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Only image uploads are supported"},
        )

    try:
        buf = base64.b64decode(match.group(2), validate=False)
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Invalid base64 payload"},
        )

    if len(buf) == 0:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Empty file"},
        )
    if len(buf) > MAX_BYTES:
        return JSONResponse(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            content={"message": "Image too large (max 12 MB)"},
        )

    fallback_ext = (mime.split("/", 1)[1] if "/" in mime else "bin") or "bin"
    fallback_ext = EXT_CLEAN_RE.sub("", fallback_ext)[:6] or "img"

    safe = SAFE_FILENAME_RE.sub("_", filename)[:60] or "image"
    has_ext = bool(HAS_EXT_RE.search(safe))

    stamp = secrets.token_hex(8)
    final_name = f"{stamp}-{safe}" if has_ext else f"{stamp}-{safe}.{fallback_ext}"

    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    target = UPLOADS_DIR / final_name
    target.write_bytes(buf)

    return {"url": f"/api/uploads/{final_name}", "bytes": len(buf)}
