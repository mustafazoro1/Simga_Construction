from fastapi import APIRouter, Depends, status
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
def submit_contact(body: ContactSubmissionInput, db: Session = Depends(get_db)):
    # Mirror drizzle-zod's behavior: all five fields are required strings;
    # FastAPI/Pydantic returns 422 on validation failure, but the original
    # Express handler returned 400 with a `message` field. Match that.
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
