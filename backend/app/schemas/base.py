"""
Base schemas for all request/response models.
"""
from datetime import datetime
from typing import Optional, Generic, TypeVar, List
from pydantic import BaseModel, Field

T = TypeVar("T")


class BaseSchema(BaseModel):
    """Base schema for all request/response models."""

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
        "str_strip_whitespace": True,
    }


class BaseDBSchema(BaseSchema):
    """Base schema for MongoDB-backed responses."""

    id: str = Field(..., alias="_id", description="Unique document ID")
    created_at: Optional[datetime] = Field(None, description="Creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")


# ---------- Pagination & Sorting ----------

class PaginationParams(BaseSchema):
    """Pagination parameters for list endpoints."""

    page: int = Field(1, ge=1, description="Page number")
    limit: int = Field(20, ge=1, le=100, description="Items per page")

    @property
    def skip(self) -> int:
        """MongoDB skip value."""
        return (self.page - 1) * self.limit


class PaginationMeta(BaseSchema):
    """Pagination metadata."""

    page: int
    limit: int
    total: int
    pages: int

    @classmethod
    def create(cls, page: int, limit: int, total: int) -> "PaginationMeta":
        pages = (total + limit - 1) // limit if total > 0 else 0
        return cls(page=page, limit=limit, total=total, pages=pages)


class SortParams(BaseSchema):
    """Sorting parameters."""

    sort_by: str = Field("created_at", description="Field to sort by")
    order: str = Field("desc", pattern="^(asc|desc)$", description="Sort order")

    @property
    def sort_direction(self) -> int:
        """MongoDB sort direction."""
        return 1 if self.order == "asc" else -1


# ---------- Generic Responses ----------

class SuccessResponse(BaseSchema, Generic[T]):
    success: bool = True
    data: T
    message: str = "Operation successful"
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ListResponse(BaseSchema, Generic[T]):
    success: bool = True
    data: List[T]
    meta: PaginationMeta
    message: str = "Items retrieved successfully"
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class MessageResponse(BaseSchema):
    success: bool = True
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ErrorResponse(BaseSchema):
    success: bool = False
    message: str
    details: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class HealthResponse(BaseSchema):
    status: str = Field(..., description="Service health status")
    database: str = Field(..., description="Database connection status")
    version: str = Field("1.0.0", description="API version")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatsResponse(BaseSchema):
    total_movies: int
    total_actors: int
    total_directors: int
    total_genres: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)
