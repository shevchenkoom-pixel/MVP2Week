from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .bootstrap import reset_database, seed_fake_user
from .config import config
from .routers import auth, catalog, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    reset_database()
    seed_fake_user()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="MVP2Week Backend",
        version="0.1.0",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=config.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(health.router)
    app.include_router(auth.router)
    app.include_router(catalog.router)
    return app


app = create_app()