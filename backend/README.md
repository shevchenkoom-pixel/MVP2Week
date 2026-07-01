# MVP2Week backend

FastAPI service backing the V1 frontend. Manages users, ephemeral SQLite, and a fake-login endpoint used by PL-6. The legal-template catalog is served from `catalog.json`.

## Requirements

- Python 3.12+
- [uv](https://docs.astral.sh/uv/) (dependency manager)

## Install and run (dev)

```bash
cd backend
uv sync
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

OpenAPI docs: http://127.0.0.1:8000/docs

## Tests

```bash
uv run pytest
```

5 cases cover `/health`, fake-login (create / default / reuse), and `/api/catalog`. Tests use a throwaway SQLite and catalog in a temp directory.

## Endpoints

| Method | Path                | Purpose                                                                                          |
|--------|---------------------|--------------------------------------------------------------------------------------------------|
| GET    | `/health`           | Liveness probe. Returns `{"status":"ok"}`.                                                       |
| POST   | `/auth/fake-login`  | Body `{ "display_name"?: string }`. Returns `{ token, user }`; creates the user if not present.   |
| GET    | `/api/catalog`      | Returns the legal-template catalog as `{ templates: [...] }`.                                    |

## Configuration

All settings are environment-driven via Pydantic Settings, prefix `MVP2WEEK_`:

| Variable                   | Default                                   | Notes                                                |
|----------------------------|-------------------------------------------|------------------------------------------------------|
| `MVP2WEEK_HOST`            | `127.0.0.1`                               | Bind address.                                        |
| `MVP2WEEK_PORT`            | `8000`                                    | Listen port.                                         |
| `MVP2WEEK_ALLOWED_ORIGINS` | `["http://localhost:3000"]`               | CORS allowlist (JSON list).                          |
| `MVP2WEEK_CATALOG_PATH`    | `<repo>/backend/catalog.json`             | Path to catalog.json. Copy from repo root to update. |
| `MVP2WEEK_DATA_DIR`        | `<repo>/backend/data`                     | SQLite directory. Recreated on every startup.        |
| `MVP2WEEK_DB_FILENAME`     | `app.db`                                  | SQLite filename.                                     |

## Database

SQLite via SQLAlchemy 2.x. The file is **deleted on every backend startup** (per PL-6: temporary DB) and recreated via `Base.metadata.create_all`. One fake user is seeded so the UI's first fake-login has at least one record.

Tables:

- `users(id, email UNIQUE, display_name, created_at)`
- `documents(id, owner_id FK→users, template_slug, status CHECK in ('draft','in_review','signed'), content TEXT, created_at, updated_at)`

Indexes on `documents.owner_id` and `documents.template_slug`. `DocumentStatus` enum enforced both by SQLAlchemy and a CHECK constraint. Content is JSON-shaped text — `documents.content` is a JSON string in PL-6, ready for richer edits in PL-4/PL-7.

## Project layout

```
backend/
├── app/
│   ├── bootstrap.py   # reset DB, seed fake user
│   ├── config.py      # Pydantic Settings
│   ├── db.py          # SQLAlchemy engine + Base + SessionLocal
│   ├── main.py        # FastAPI factory + CORS + lifespan
│   ├── models.py      # User, Document, DocumentStatus
│   ├── schemas.py     # Pydantic v2 request/response shapes
│   └── routers/
│       ├── auth.py    # POST /auth/fake-login
│       ├── catalog.py # GET /api/catalog
│       └── health.py  # GET /health
├── catalog.json       # copy of ../catalog.json
├── data/.gitignore    # *.db gitignored
└── tests/             # pytest
```

## Docker

Built by the top-level `Dockerfile` (`backend` stage). Compose brings the whole stack up:

```bash
docker compose up --build
```
