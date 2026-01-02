from datetime import datetime
from typing import List

from pymongo.errors import DuplicateKeyError, PyMongoError

from app.repositories.actor import ActorRepository
from app.schemas.actor import (
    ActorCreateRequest,
    ActorUpdateRequest,
    ActorResponse,
)
from app.schemas.base import PaginationParams
from app.core.exceptions import (
    NotFoundException,
    ConflictException,
    DatabaseException
)

class ActorService:
    """
    Business logic for Actors.
    """

    def __init__(self, repo: ActorRepository):
        self.repo = repo
    
    async def get_actor(self, actor_id: str) -> ActorResponse:
        try:
            actor = await self.repo.get_by_id(actor_id)
            if not actor:
                raise NotFoundException("Actor")

            return ActorResponse(**actor)

        except PyMongoError:
            raise DatabaseException()

    async def list_actors(
        self,
        pagination: PaginationParams,
    ) -> List[ActorResponse]:
        try:
            actors = await self.repo.list_all(
                skip=pagination.skip,
                limit=pagination.limit,
            )

            return [ActorResponse(**a) for a in actors]

        except PyMongoError:
            raise DatabaseException()
    
    async def create_actor(
        self,
        payload: ActorCreateRequest,
    ) -> ActorResponse:
        try:
            existing = await self.repo.get_by_name(payload.name)
            if existing:
                raise ConflictException(
                    "Actor with this name already exists"
                )
            
            data = payload.model_dump()
            actor = await self.repo.create(data)
            return ActorResponse(**actor)

        except DuplicateKeyError:
            raise ConflictException(
                "Actor with this name already exists"
            )

        except PyMongoError:
            raise DatabaseException()

    async def update_actor(
        self,
        actor_id: str,
        payload: ActorUpdateRequest,
    ) -> ActorResponse:
        try:
            data = payload.model_dump(exclude_unset=True)

            if not data:
                raise ConflictException("No fields provided for update")

            updated = await self.repo.update(actor_id, data)
            if not updated:
                raise NotFoundException("Actor")

            return ActorResponse(**updated)
        
        except DuplicateKeyError:
            raise ConflictException(
                "Actor with this name already exists"
            )

        except PyMongoError:
            raise DatabaseException()

    async def delete_actor(self, actor_id: str) -> None:
        """
        Delete an actor.
        """
        try:
            deleted = await self.repo.delete(actor_id)
            if not deleted:
                raise NotFoundException("Actor")

        except PyMongoError:
            raise DatabaseException()