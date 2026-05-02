"""
One-shot DB initialisation script.
- Creates all tables defined in app.models (if they don't exist yet).
- Seeds projects + services if their tables are empty.
Run from the artifacts/api-server directory:
    python init_db.py
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))

os.environ.setdefault(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_h8zJ5qeCgbUp@ep-steep-tooth-aoiwiv03-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
)
os.environ.setdefault("SESSION_SECRET", "local-dev-secret")
os.environ.setdefault("SIGMA_ADMIN_PASSWORD", "123095")

from app.db import engine, SessionLocal, Base
from app.models import Project, Service          # registers models on Base
from app.seeds import build_seed_projects, build_seed_services
from sqlalchemy import select, inspect as sa_inspect

print("Creating tables …")
Base.metadata.create_all(bind=engine)
print("Tables created (or already existed).")

db = SessionLocal()
try:
    # seed projects
    if db.execute(select(Project.id).limit(1)).first() is None:
        print("Seeding projects …")
        db.add_all(build_seed_projects())
        db.commit()
        print("Projects seeded.")
    else:
        print("Projects already present — skipping seed.")

    # seed services
    if db.execute(select(Service.id).limit(1)).first() is None:
        print("Seeding services …")
        db.add_all(build_seed_services())
        db.commit()
        print("Services seeded.")
    else:
        print("Services already present — skipping seed.")
finally:
    db.close()

print("Done.")
