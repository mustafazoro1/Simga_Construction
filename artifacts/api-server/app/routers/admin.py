from typing import Optional

from fastapi import APIRouter, Cookie, HTTPException, Response, status
from fastapi.responses import JSONResponse

from ..auth import (
    ADMIN_COOKIE,
    ADMIN_PASSWORD,
    clear_admin_cookie,
    set_admin_cookie,
    verify_admin_cookie,
)
from ..schemas import AdminLoginInput, AdminMeResponse, OkResponse

router = APIRouter()


@router.post("/admin/login")
def admin_login(body: AdminLoginInput, response: Response):
    password = body.password if isinstance(body.password, str) else ""
    if not password:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"ok": False, "message": "Password required"},
        )
    if password != ADMIN_PASSWORD:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"ok": False, "message": "Incorrect password"},
        )
    set_admin_cookie(response)
    return {"ok": True}


@router.post("/admin/logout", response_model=OkResponse)
def admin_logout(response: Response) -> OkResponse:
    clear_admin_cookie(response)
    return OkResponse(ok=True)


@router.get("/admin/me", response_model=AdminMeResponse)
def admin_me(sigma_admin: Optional[str] = Cookie(default=None)) -> AdminMeResponse:
    return AdminMeResponse(isAdmin=verify_admin_cookie(sigma_admin))
