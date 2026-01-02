from fastapi import APIRouter, Depends, status

from app.schemas import (
    GenreCreateRequest,
    GenreUpdateRequest,
    GenreResponse,
    SuccessResponse,
    ListResponse,
    PaginationParams,
)
from app.core.database import get_database
from app.repositories.genre import GenreRepository
from app.services.genre import GenreService

router = APIRouter()


def get_genre_service(db=Depends(get_database)) -> GenreService:
    repo = GenreRepository(db.genres)
    return GenreService(repo)

# Get Requests
@router.get(
    "/{genre_id}",
    response_model=SuccessResponse[GenreResponse],
)
async def get_genre(
    genre_id: str,
    service: GenreService = Depends(get_genre_service),
):
    genre = await service.get_genre(genre_id)
    return SuccessResponse(data=genre)


@router.get(
    "",
    response_model=ListResponse[GenreResponse],
)
async def list_genres(
    pagination: PaginationParams = Depends(),
    service: GenreService = Depends(get_genre_service),
):
    genres = await service.list_genres(pagination)
    total = await service.repo.count()

    return ListResponse(
        data=genres,
        meta={
            "page": pagination.page,
            "limit": pagination.limit,
            "total": total,
            "pages": (total + pagination.limit - 1) // pagination.limit,
        },
    )


# Post Requests
@router.post(
    "",
    response_model=SuccessResponse[GenreResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create_genre(
    payload: GenreCreateRequest,
    service: GenreService = Depends(get_genre_service),
):
    genre = await service.create_genre(payload)
    return SuccessResponse(data=genre, message="Genre created successfully")


# Put Requests
@router.put(
    "/{genre_id}",
    response_model=SuccessResponse[GenreResponse],
)
async def update_genre(
    genre_id: str,
    payload: GenreUpdateRequest,
    service: GenreService = Depends(get_genre_service),
):
    genre = await service.update_genre(genre_id, payload)
    return SuccessResponse(data=genre, message="Genre updated successfully")


# Delete Requests
@router.delete(
    "/{genre_id}",
    response_model=SuccessResponse[None],
)
async def delete_genre(
    genre_id: str,
    service: GenreService = Depends(get_genre_service),
):
    await service.delete_genre(genre_id)
    return SuccessResponse(message="Genre deleted successfully", data=None)
