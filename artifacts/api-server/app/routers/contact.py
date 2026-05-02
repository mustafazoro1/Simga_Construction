import os
import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import ContactSubmission
from ..schemas import ContactSubmissionInput, ContactSubmissionResponse

router = APIRouter()


@router.post(
    "/contact",
    status_code=status.HTTP_201_CREATED,
    response_model=ContactSubmissionResponse,
)
async def submit_contact(body: ContactSubmissionInput, db: Session = Depends(get_db)):
    # Verify reCAPTCHA token if provided
    secret_key = os.getenv("RECAPTCHA_SECRET_KEY")
    if secret_key and body.recaptcha_token:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://www.google.com/recaptcha/api/siteverify",
                data={
                    "secret": secret_key,
                    "response": body.recaptcha_token,
                },
            )
            result = response.json()
            if not result.get("success"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Human verification failed. Please try again.",
                )

    row = ContactSubmission(
        name=body.name,
        email=body.email,
        phone=body.phone,
        subject=body.subject,
        message=body.message,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return ContactSubmissionResponse(id=row.id, success=True)
