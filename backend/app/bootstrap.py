"""Recreate the ephemeral SQLite file on every backend startup.

Per PL-6 requirements, the database is treated as temporary: it is deleted
and recreated when the backend starts, then seeded with a single fake user so
the frontend's first fake-login can rely on at least one existing record.
"""
from __future__ import annotations

import secrets

from .config import config
from .db import Base, SessionLocal, engine
from .models import User


def reset_database() -> None:
    config.data_dir.mkdir(parents=True, exist_ok=True)
    db_file = config.data_dir / config.db_filename
    if db_file.exists():
        db_file.unlink()
    Base.metadata.create_all(bind=engine)


def seed_fake_user() -> None:
    suffix = secrets.token_hex(4)
    with SessionLocal() as session:
        session.add(
            User(
                email=f"seed-{suffix}@local",
                display_name=f"Seed User {suffix}",
            )
        )
        session.commit()