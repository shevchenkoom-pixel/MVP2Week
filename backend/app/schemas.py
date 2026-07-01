from typing import Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"


class UserPublic(BaseModel):
    id: int
    display_name: str
    email: str


class FakeLoginRequest(BaseModel):
    display_name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=80,
        description="Optional display name; backend generates one if omitted.",
    )


class FakeLoginResponse(BaseModel):
    token: str
    user: UserPublic


class CatalogTemplate(BaseModel):
    name: str
    description: str
    filename: str
    source_repo: str


class CatalogResponse(BaseModel):
    templates: list[CatalogTemplate]