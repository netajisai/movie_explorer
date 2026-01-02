from typing import List

from pymongo.errors import DuplicateKeyError, PyMongoError

from app.schemas.genre import (
    GenreCreateRequest,
    GenreUpdateRequest,
    GenreResponse,
)
from app.schemas.base import PaginationParams
from app.repositories.genre import GenreRepository
from app.core.exceptions import (
    NotFoundException,
    ConflictException,
    DatabaseException,
)


class GenreService:
    """
    Business logic for Genre entity.
    """

    def __init__(self, repo: GenreRepository):
        self.repo = repo
    
    async def get_genre(
        self,
        genre_id: str,
    ) -> GenreResponse:
        """
        Retrieve a genre by ID.
        """
        try:
            genre = await self.repo.get_by_id(genre_id)
            if not genre:
                raise NotFoundException("Genre")

            return GenreResponse(**genre)

        except PyMongoError:
            raise DatabaseException()

    async def list_genres(
        self,
        pagination: PaginationParams,
    ) -> List[GenreResponse]:
        """
        List genres with pagination.
        """
        try:
            genres = await self.repo.list_all(
                skip=pagination.skip,
                limit=pagination.limit,
            )

            return [GenreResponse(**g) for g in genres]

        except PyMongoError:
            raise DatabaseException()
    
    async def create_genre(
        self,
        payload: GenreCreateRequest,
    ) -> GenreResponse:
        """
        Create a new genre.
        """
        try:
            existing = await self.repo.get_by_name(payload.name)
            if existing:
                raise ConflictException(
                    "Genre with this name already exists"
                )

            genre = await self.repo.create(payload.model_dump())
            return GenreResponse(**genre)

        except DuplicateKeyError:
            # Safety net if unique index triggers
            raise ConflictException(
                "Genre with this name already exists"
            )

        except PyMongoError:
            raise DatabaseException()

    async def update_genre(
        self,
        genre_id: str,
        payload: GenreUpdateRequest,
    ) -> GenreResponse:
        """
        Update an existing genre.
        """
        try:
            data = payload.model_dump(exclude_unset=True)

            if not data:
                raise ConflictException("No fields provided for update")

            updated = await self.repo.update(genre_id, data)
            if not updated:
                raise NotFoundException("Genre")

            return GenreResponse(**updated)

        except DuplicateKeyError:
            raise ConflictException(
                "Genre with this name already exists"
            )

        except PyMongoError:
            raise DatabaseException()

    async def delete_genre(
        self,
        genre_id: str,
    ) -> None:
        """
        Delete a genre.
        """
        try:
            deleted = await self.repo.delete(genre_id)
            if not deleted:
                raise NotFoundException("Genre")

        except PyMongoError:
            raise DatabaseException()
