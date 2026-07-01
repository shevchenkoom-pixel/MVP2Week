import os
import tempfile
from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def isolated_config(monkeypatch: pytest.MonkeyPatch, tmp_path) -> Iterator[None]:
    """Point the app at a throwaway DB + catalog so tests are deterministic
    and never touch the real `backend/data/app.db`."""
    db_dir = tmp_path / "data"
    db_dir.mkdir()
    monkeypatch.setenv("MVP2WEEK_DATA_DIR", str(db_dir))
    monkeypatch.setenv("MVP2WEEK_DB_FILENAME", "test.db")

    fake_catalog = tmp_path / "catalog.json"
    fake_catalog.write_text(
        '{"templates":[{"name":"Test NDA","description":"d","filename":"t.md","source_repo":"https://example/x"}]}',
        encoding="utf-8",
    )
    monkeypatch.setenv("MVP2WEEK_CATALOG_PATH", str(fake_catalog))

    # The AppConfig singleton was already constructed at import time; reload it.
    from app import config as config_module
    from app.config import AppConfig
    config_module.config = AppConfig()

    # Reset engine/session so they bind to the new DB url.
    from app import db as db_module
    from app.db import Base, create_engine, sessionmaker
    db_module.engine = create_engine(
        config_module.config.db_url, connect_args={"check_same_thread": False}
    )
    db_module.SessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=db_module.engine
    )

    yield


@pytest.fixture
def client(isolated_config: None) -> Iterator[TestClient]:
    from app.main import app
    with TestClient(app) as test_client:
        yield test_client