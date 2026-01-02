from typing import List
from pymongo.errors import DuplicateKeyError, PyMongoError

from app.repositories.director import DirectorRepository
from app.schemas.director import (
    DirectorCreateRequest,
    DirectorUpdateRequest,
    DirectorResponse,
)
from app.schemas.base import PaginationParams
from app.core.exceptions import (
    BadRequestException,
    NotFoundException,
    ConflictException,
    DatabaseException,
)


class DirectorService:
    """
    Business logic for Directors.
    """

    def __init__(self, repo: DirectorRepository):
        self.repo = repo

    async def get_director(self, director_id: str) -> DirectorResponse:
        try:
            director = await self.repo.get_by_id(director_id)
            if not director:
                raise NotFoundException("Director")
            return DirectorResponse(**director)

        except PyMongoError:
            raise DatabaseException()

    async def list_directors(
        self,
        pagination: PaginationParams,
    ) -> List[DirectorResponse]:
        try:
            directors = await self.repo.list_all(
                skip=pagination.skip,
                limit=pagination.limit,
            )
            return [DirectorResponse(**d) for d in directors]

        except PyMongoError:
            raise DatabaseException()

    async def create_director(
        self,
        payload: DirectorCreateRequest,
    ) -> DirectorResponse:
        try:
            existing = await self.repo.get_by_name(payload.name)
            if existing:
                raise ConflictException(
                    "Director with this name already exists"
                )

            data = payload.model_dump()
            director = await self.repo.create(data)
            return DirectorResponse(**director)

        except DuplicateKeyError:
            raise ConflictException(
                "Director with this name already exists"
            )

        except PyMongoError:
            raise DatabaseException()

    async def update_director(
        self,
        director_id: str,
        payload: DirectorUpdateRequest,
    ) -> DirectorResponse:
        try:
            data = payload.model_dump(exclude_unset=True)

            if not data:
                raise BadRequestException("No fields provided for update")

            updated = await self.repo.update(director_id, data)
            if not updated:
                raise NotFoundException("Director")

            return DirectorResponse(**updated)

        except PyMongoError:
            raise DatabaseException()

    async def delete_director(self, director_id: str) -> None:
        try:
            deleted = await self.repo.delete(director_id)
            if not deleted:
                raise NotFoundException("Director")

        except PyMongoError:
            raise DatabaseException()
