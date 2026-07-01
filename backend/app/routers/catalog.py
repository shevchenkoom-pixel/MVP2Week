"""Serve the legal-template catalog over HTTP.

PL-6 ships a minimal, JSON-shaped endpoint backed by `catalog.json`. PL-4 will
add `/api/templates/{filename}` for full template bodies, but the catalog
itself is needed by PL-4's UI to render the template picker.
"""
from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException

from ..config import config
from ..schemas import CatalogResponse, CatalogTemplate

router = APIRouter(prefix="/api", tags=["catalog"])


def _load_catalog() -> CatalogResponse:
    if not config.catalog_path.exists():
        raise HTTPException(status_code=500, detail="catalog.json not found")
    raw = json.loads(config.catalog_path.read_text(encoding="utf-8"))
    templates = [
        CatalogTemplate(
            name=entry["name"],
            description=entry["description"],
            filename=entry["filename"],
            source_repo=entry["source_repo"],
        )
        for entry in raw.get("templates", [])
    ]
    return CatalogResponse(templates=templates)


@router.get("/catalog", response_model=CatalogResponse)
def catalog() -> CatalogResponse:
    return _load_catalog()