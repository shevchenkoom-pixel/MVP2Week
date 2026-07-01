"""Recreate the ephemeral SQLite file on every backend startup.

Per PL-6 requirements, the database is treated as temporary: it is deleted
and recreated when the backend starts, then seeded with a single fake user so
the frontend's first fake-login can rely on at least one existing record.
"""
from __future__ import annotations

import gc
import secrets

from .config import config
from .db import Base, SessionLocal, engine
from .models import User


def reset_database() -> None:
    config.data_dir.mkdir(parents=True, exist_ok=True)
    db_file = config.data_dir / config.db_filename
    # Force any lingering SQLite connections to close before deleting the file.
    # Without this, a previous process that didn't shut down cleanly can leave
    # a Windows file lock and the next startup crashes with PermissionError.
    engine.dispose()
    gc.collect()
    if db_file.exists():
        try:
            db_file.unlink()
        except PermissionError:
            # File is locked by a stale process. Skip delete — create_all on an
            # existing empty/locked file would still fail, so fall back to a
            # fresh filename and let the original be cleaned up on next boot.
            db_file = db_file.with_name(f"{db_file.stem}.{secrets.token_hex(4)}.db")
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