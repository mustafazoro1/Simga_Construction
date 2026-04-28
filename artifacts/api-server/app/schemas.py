"""Pydantic models for request validation and response serialization.

The frontend speaks camelCase on the wire. Internally we keep snake_case for
Python attributes; ``alias_generator=to_camel`` + ``populate_by_name=True``
gives us seamless conversion in both directions.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class _CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


# ----- Contact form ---------------------------------------------------------


class ContactSubmissionInput(BaseModel):
    name: str
    email: str
    phone: str
    subject: str
    message: str


class ContactSubmissionResponse(BaseModel):
    id: int
    success: bool


# ----- Admin ----------------------------------------------------------------


class AdminLoginInput(BaseModel):
    password: str


class AdminMeResponse(BaseModel):
    isAdmin: bool


class OkResponse(BaseModel):
    ok: bool


# ----- Site content --------------------------------------------------------


class ContentValueInput(BaseModel):
    value: str


class ContentUpsertResponse(BaseModel):
    ok: bool
    key: str
    value: str


# ----- Projects -------------------------------------------------------------


class ProjectOut(_CamelModel):
    id: str
    title: str
    category: str
    status: str
    employer: str
    original_contract_value: str
    subcontracting_amount: str
    awarded: str
    completed: str
    scope_note: Optional[str] = None
    hero: str
    gallery: List[str]
    sort_order: int
    created_at: datetime
    updated_at: datetime


# ----- Services -------------------------------------------------------------


class ServiceOut(_CamelModel):
    id: str
    title: str
    description: str
    long_description: str
    image: str
    why_best: List[str]
    icon: str
    sort_order: int
    created_at: datetime
    updated_at: datetime


# ----- Uploads --------------------------------------------------------------


class UploadInput(BaseModel):
    filename: Optional[str] = "image"
    dataUrl: Optional[str] = ""


class UploadResponse(BaseModel):
    url: str
    bytes: int


# ----- Health --------------------------------------------------------------


class HealthResponse(BaseModel):
    status: str
