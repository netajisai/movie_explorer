"""
Movie schemas.
"""
from typing import Optional, List
from datetime import datetime
from pydantic import Field, HttpUrl, model_validator, field_validator
from app.schemas.base import BaseSchema, BaseDBSchema
from app.schemas.actor import ActorMinimalResponse
from app.schemas.director import DirectorMinimalResponse
from app.schemas.genre import GenreMinimalResponse


# ---------- Embedded ----------

class ReviewSchema(BaseSchema):
    rating: float = Field(..., ge=0, le=5)
    comment: str = Field(..., min_length=1, max_length=1000)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class RatingsSchema(BaseSchema):
    average: float = Field(0.0, ge=0, le=5)
    count: int = Field(0, ge=0)
    reviews: List[ReviewSchema] = Field(default_factory=list)


# ---------- Requests ----------

class MovieCreateRequest(BaseSchema):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    release_year: int = Field(..., ge=1888, le=2100)
    duration_minutes: Optional[int] = Field(None, ge=1, le=600)
    poster_url: Optional[HttpUrl] = None
    backdrop_url: Optional[HttpUrl] = None
    director_id: str
    actor_ids: List[str] = Field(default_factory=list)
    genre_ids: List[str] = Field(default_factory=list)

    @field_validator("actor_ids", "genre_ids")
    @classmethod
    def deduplicate_ids(cls, v: List[str]) -> List[str]:
        return list(dict.fromkeys(v))


class MovieUpdateRequest(BaseSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    release_year: Optional[int] = None
    duration_minutes: Optional[int] = None
    poster_url: Optional[HttpUrl] = None
    backdrop_url: Optional[HttpUrl] = None
    director_id: Optional[str] = None
    actor_ids: Optional[List[str]] = None
    genre_ids: Optional[List[str]] = None

class ReviewCreateRequest(BaseSchema):
    rating: float = Field(..., ge=0, le=5)
    comment: str = Field(..., min_length=1, max_length=1000)

# ---------- Responses ----------

class MovieResponse(BaseDBSchema):
    title: str
    description: Optional[str]
    release_year: int
    duration_minutes: Optional[int]
    poster_url: Optional[str]
    backdrop_url: Optional[str]
    director: Optional[DirectorMinimalResponse]
    actors: List[ActorMinimalResponse]
    genres: List[GenreMinimalResponse]
    ratings: RatingsSchema


class MovieListResponse(MovieResponse):
    """List item uses the same full movie schema as `MovieResponse`."""
    pass


class MovieMinimalResponse(BaseSchema):
    id: str
    title: str
    release_year: int

class MovieFilterParams(BaseSchema):
    search: Optional[str] = None
    genre_id: Optional[str] = None
    director_id: Optional[str] = None
    actor_id: Optional[str] = None
    release_year: Optional[int] = None
    min_rating: Optional[float] = None
    max_rating: Optional[float] = None
    
    @model_validator(mode="after")
    def validate_rating_range(self):
        if self.min_rating is not None and self.max_rating is not None:
            if self.min_rating > self.max_rating:
                raise ValueError("min_rating cannot be greater than max_rating")
        return self