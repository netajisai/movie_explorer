from fastapi import APIRouter, Depends, status
from app.core.database import get_database
from app.schemas.base import (
    SuccessResponse,
    ListResponse,
    MessageResponse,
    PaginationParams,
)
from app.schemas.director import (
    DirectorCreateRequest,
    DirectorUpdateRequest,
    DirectorResponse,
)
from app.repositories.director import DirectorRepository
from app.services.director import DirectorService

router = APIRouter()

# Dependency
def get_director_service(db=Depends(get_database)) -> DirectorService:
    repo = DirectorRepository(db.directors)
    service = DirectorService(repo)
    return service

# ---------- CRUD ----------

@router.get(
    "/{director_id}",
    response_model=SuccessResponse[DirectorResponse],
)
async def get_director(
    director_id: str,
    service: DirectorService = Depends(get_director_service),
):
    director = await service.get_director(director_id)
    return SuccessResponse(data=director)


@router.get(
    "/",
    response_model=ListResponse[DirectorResponse],
)
async def list_directors(
    pagination: PaginationParams = Depends(),
    service: DirectorService = Depends(get_director_service),
):
    directors = await service.list_directors(pagination)
    total = await service.repo.count()
    return ListResponse(
        data=directors,
        meta={
            "page": pagination.page,
            "limit": pagination.limit,
            "total": total,
            "pages": (total + pagination.limit - 1) // pagination.limit,
        },
    )


@router.post(
    "/",
    response_model=SuccessResponse[DirectorResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create_director(
    payload: DirectorCreateRequest,
    service: DirectorService = Depends(get_director_service),
):
    director = await service.create_director(payload)
    return SuccessResponse(data=director)


@router.put(
    "/{director_id}",
    response_model=SuccessResponse[DirectorResponse],
)
async def update_director(
    director_id: str,
    payload: DirectorUpdateRequest,
    service: DirectorService = Depends(get_director_service),
):
    director = await service.update_director(director_id, payload)
    return SuccessResponse(data=director)


@router.delete(
    "/{director_id}",
    response_model=MessageResponse,
)
async def delete_director(
    director_id: str,
    service: DirectorService = Depends(get_director_service),
):
    await service.delete_director(director_id)
    return MessageResponse(message="Director deleted successfully")