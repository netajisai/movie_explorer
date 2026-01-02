"""
Genre schemas.
Genres are simple classification entities.
"""
from typing import Optional
from pydantic import Field, field_validator
from app.schemas.base import BaseSchema, BaseDBSchema


class GenreCreateRequest(BaseSchema):
    name: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Genre name (e.g., Action, Drama)"
    )
    description: Optional[str] = Field(
        None,
        max_length=500,
        description="Brief genre description"
    )

    @field_validator("name")
    @classmethod
    def normalize_name(cls, v: str) -> str:
        return v.strip().title()


class GenreUpdateRequest(BaseSchema):
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    description: Optional[str] = Field(None, max_length=500)


class GenreResponse(BaseDBSchema):
    name: str = Field(..., description="Genre name")
    description: Optional[str] = Field(None, description="Genre description")


class GenreMinimalResponse(BaseSchema):
    id: str = Field(..., description="Genre ID")
    name: str = Field(..., description="Genre name")
