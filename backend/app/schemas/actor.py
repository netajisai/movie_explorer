"""
Actor schemas.
Actors can appear in multiple movies.
"""
from typing import Optional
from datetime import date
from pydantic import Field, HttpUrl
from app.schemas.base import BaseSchema, BaseDBSchema


class ActorCreateRequest(BaseSchema):
    name: str = Field(..., min_length=2, max_length=100, description="Actor full name")
    bio: Optional[str] = Field(None, max_length=2000, description="Biography")
    birth_date: Optional[date] = Field(None, description="Date of birth")
    nationality: Optional[str] = Field(None, max_length=100, description="Nationality")
    profile_image: Optional[HttpUrl] = Field(None, description="Profile image URL")


class ActorUpdateRequest(ActorCreateRequest):
    name: Optional[str] = None


class ActorResponse(BaseDBSchema):
    name: str
    bio: Optional[str]
    birth_date: Optional[date]
    nationality: Optional[str]
    profile_image: Optional[str]


class ActorMinimalResponse(BaseSchema):
    id: str = Field(..., description="Actor ID")
    name: str = Field(..., description="Actor name")
