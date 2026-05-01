"""
Fix Neon DB: drop old tables and recreate with the correct schema + seed data.
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))

os.environ.setdefault(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_h8zJ5qeCgbUp@ep-steep-tooth-aoiwiv03-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
)
os.environ.setdefault("SESSION_SECRET", "local-dev-secret")
os.environ.setdefault("SIGMA_ADMIN_PASSWORD", "123095")

from sqlalchemy import text
from app.db import engine, SessionLocal, Base
from app.models import Project, Service, ContactSubmission, SiteContent
from app.seeds import build_seed_projects, build_seed_services

with engine.connect() as conn:
    print("Dropping old tables ...")
    conn.execute(text("DROP TABLE IF EXISTS projects CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS services CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS contact_submissions CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS site_content CASCADE"))
    # Also drop any leftover Replit tables
    conn.execute(text("DROP TABLE IF EXISTS content_blocks CASCADE"))
    conn.commit()
    print("Old tables dropped.")

print("Creating fresh tables ...")
Base.metadata.create_all(bind=engine)
print("Tables created.")

db = SessionLocal()
try:
    print("Seeding projects ...")
    db.add_all(build_seed_projects())
    db.commit()
    print(f"  -> {db.query(Project).count()} projects seeded.")

    print("Seeding services ...")
    db.add_all(build_seed_services())
    db.commit()
    print(f"  -> {db.query(Service).count()} services seeded.")
finally:
    db.close()

print("Done! DB is ready.")
