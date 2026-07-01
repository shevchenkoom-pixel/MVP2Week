"""Fake login: no authentication. Creates or reuses a user by email and
returns a synthetic token. The shape of the response mirrors what a real
JWT-based login would return, so PL-7 can swap the implementation without
touching the frontend contract.
"""
from __future__ import annotations

import re
import secrets

from fastapi import APIRouter
from sqlalchemy import select

from ..db import SessionLocal
from ..models import User
from ..schemas import FakeLoginRequest, FakeLoginResponse, UserPublic

router = APIRouter(tags=["auth"])


def _slugify_display_name(display_name: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", ".", display_name.strip().lower()).strip(".")
    return slug or "user"


def _issue_token() -> str:
    return f"fake-{secrets.token_urlsafe(16)}"


@router.post("/auth/fake-login", response_model=FakeLoginResponse)
def fake_login(body: FakeLoginRequest | None = None) -> FakeLoginResponse:
    display_name = (body.display_name if body and body.display_name else "Demo User").strip()
    email_local = _slugify_display_name(display_name)
    email = f"{email_local}@local"

    with SessionLocal() as session:
        user = session.scalar(select(User).where(User.email == email))
        if user is None:
            user = User(email=email, display_name=display_name)
            session.add(user)
            session.commit()
            session.refresh(user)

        return FakeLoginResponse(
            token=_issue_token(),
            user=UserPublic(
                id=user.id,
                display_name=user.display_name,
                email=user.email,
            ),
        )