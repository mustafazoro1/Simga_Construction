"""Admin cookie signing + ``require_admin`` dependency.

We use ``itsdangerous.Signer`` so the cookie is tamper-resistant. The wire
format ("<value>.<sig>") differs from Express's cookie-parser format, but the
cookie name (``sigma_admin``) and semantics (signed httpOnly cookie carrying
the literal value ``"1"``) are identical.
"""

from __future__ import annotations

import os
from typing import Optional

from fastapi import Cookie, HTTPException, Response, status
from itsdangerous import BadSignature, Signer

ADMIN_COOKIE = "sigma_admin"
THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30

SESSION_SECRET = os.environ.get("SESSION_SECRET") or "sigma-dev-secret-do-not-use-in-prod"
ADMIN_PASSWORD = os.environ.get("SIGMA_ADMIN_PASSWORD") or "123095"

_signer = Signer(SESSION_SECRET, salt="sigma_admin_cookie")


def sign_admin_value(value: str = "1") -> str:
    return _signer.sign(value.encode("utf-8")).decode("utf-8")


def verify_admin_cookie(raw: Optional[str]) -> bool:
    if not raw:
        return False
    try:
        unsigned = _signer.unsign(raw.encode("utf-8")).decode("utf-8")
    except BadSignature:
        return False
    return unsigned == "1"


def set_admin_cookie(response: Response) -> None:
    secure = os.environ.get("NODE_ENV") == "production"
    response.set_cookie(
        key=ADMIN_COOKIE,
        value=sign_admin_value("1"),
        max_age=THIRTY_DAYS_SECONDS,
        httponly=True,
        secure=secure,
        samesite="lax",
        path="/",
    )


def clear_admin_cookie(response: Response) -> None:
    response.delete_cookie(ADMIN_COOKIE, path="/")


def require_admin(sigma_admin: Optional[str] = Cookie(default=None)) -> None:
    if not verify_admin_cookie(sigma_admin):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"ok": False, "message": "Admin authentication required"},
        )
