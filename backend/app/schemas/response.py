from typing import Generic, List, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class ResponseModel(BaseModel, Generic[T]):
    data: T
    message: str = "Success"


class ListResponseModel(BaseModel, Generic[T]):
    data: List[T]
    total: int
    page: int
    limit: int


# Generic response schemas for consistent API responses