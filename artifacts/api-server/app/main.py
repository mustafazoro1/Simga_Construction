"""FastAPI entrypoint — mirrors the previous Express server 1:1.

Mounts:
- ``/api`` — JSON router (health, contact, admin, content, projects, services, uploads)
- ``/api/uploads`` — Static file serving for previously uploaded images

CORS reflects any origin and allows credentials, identical to the Express
``cors({ origin: true, credentials: true })`` setting.
"""

from __future__ import annotations

import logging
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from fastapi.staticfiles import StaticFiles

from .routers import admin, contact, content, health, projects, services, uploads

logger = logging.getLogger("api-server")
logging.basicConfig(level=logging.INFO)

UPLOADS_DIR = Path(os.getcwd()) / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

# 15 MB matches the previous express.json({ limit: "15mb" }) cap.
MAX_BODY_BYTES = 15 * 1024 * 1024


class CachedStaticFiles(StaticFiles):
    """StaticFiles with the ``public, max-age=604800, immutable`` Cache-Control
    header — mirrors the previous express.static({ maxAge: "7d" }) behavior."""

    async def get_response(self, path: str, scope):  # type: ignore[override]
        response = await super().get_response(path, scope)
        if response.status_code == 200:
            response.headers["Cache-Control"] = "public, max-age=604800, immutable"
        return response


app = FastAPI(
    title="Sigma Contractors API",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def _validation_handler(request: Request, exc: RequestValidationError):
    """Mirror Express's behavior: return 400 with a ``{message: string}`` body
    instead of FastAPI's default 422 ``{detail: [...]}`` shape."""
    parts = []
    for err in exc.errors():
        loc = ".".join(str(p) for p in err.get("loc", []) if p not in ("body",))
        msg = err.get("msg", "invalid")
        parts.append(f"{loc}: {msg}" if loc else msg)
    message = "; ".join(parts) or "Invalid request body"
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": message})


@app.exception_handler(HTTPException)
async def _flatten_dict_detail(request: Request, exc: HTTPException):
    """If a route raises ``HTTPException(detail={...})``, return the dict
    directly as the response body — matching the Express error shape rather
    than FastAPI's default ``{"detail": {...}}`` wrapper."""
    if isinstance(exc.detail, dict):
        return JSONResponse(status_code=exc.status_code, content=exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail} if exc.detail is not None else {},
    )


@app.middleware("http")
async def enforce_body_size(request: Request, call_next):
    cl = request.headers.get("content-length")
    if cl is not None:
        try:
            if int(cl) > MAX_BODY_BYTES:
                return JSONResponse(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    content={"message": "Request body too large"},
                )
        except ValueError:
            pass
    return await call_next(request)


@app.middleware("http")
async def access_log(request: Request, call_next):
    response: Response = await call_next(request)
    logger.info(
        "%s %s -> %s",
        request.method,
        request.url.path,
        response.status_code,
    )
    return response


# Static uploads must be mounted BEFORE the JSON router so the `/api/uploads/...`
# prefix is matched first.
app.mount(
    "/api/uploads",
    CachedStaticFiles(directory=str(UPLOADS_DIR), check_dir=False),
    name="uploads",
)

# All API routes live under /api, matching the previous Express app.use("/api", router).
app.include_router(health.router, prefix="/api")
app.include_router(contact.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(content.router, prefix="/api")
app.include_router(uploads.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(services.router, prefix="/api")
