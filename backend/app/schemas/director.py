"""
Director schemas.
A director can direct multiple movies.
"""
from typing import Optional, List
from datetime import date
from pydantic import Field, HttpUrl
from app.schemas.base import BaseSchema, BaseDBSchema


class DirectorCreateRequest(BaseSchema):
    name: str = Field(..., min_length=2, max_length=100, description="Director full name")
    bio: Optional[str] = Field(None, max_length=2000, description="Biography")
    birth_date: Optional[date] = Field(None, description="Date of birth")
    nationality: Optional[str] = Field(None, max_length=100, description="Nationality")
    profile_image: Optional[HttpUrl] = Field(None, description="Profile image URL")
    awards: List[str] = Field(default_factory=list, description="Awards won")


class DirectorUpdateRequest(DirectorCreateRequest):
    name: Optional[str] = None


class DirectorResponse(BaseDBSchema):
    name: str
    bio: Optional[str]
    birth_date: Optional[date]
    nationality: Optional[str]
    profile_image: Optional[str]
    awards: List[str]


class DirectorMinimalResponse(BaseSchema):
    id: str = Field(..., description="Director ID")
    name: str = Field(..., description="Director name")
