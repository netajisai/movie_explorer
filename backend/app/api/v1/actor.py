from fastapi import APIRouter, Depends, status
from app.schemas.base import (
    SuccessResponse,
    ListResponse,
    PaginationParams,
)
from app.schemas.actor import (
    ActorCreateRequest,
    ActorUpdateRequest,
    ActorResponse,
)
from app.core.database import get_database
from app.services.actor import ActorService
from app.repositories.actor import ActorRepository

router = APIRouter()

def get_actor_service(db=Depends(get_database)) -> ActorService:
    repo = ActorRepository(db.actors)
    return ActorService(repo)

# Get Requests
@router.get(
    "/{actor_id}",
    response_model=SuccessResponse[ActorResponse],
)
async def get_actor(
    actor_id: str,
    service: ActorService = Depends(get_actor_service),
):
    actor = await service.get_actor(actor_id)
    return SuccessResponse(data=actor)

@router.get(
    "/",
    response_model=list[ActorResponse],
)
async def list_actors(
    pagination: PaginationParams = Depends(),
    service: ActorService = Depends(get_actor_service),
):
    return await service.list_actors(pagination)

# Post requests
@router.post(
    "/",
    response_model=ActorResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_actor(
    payload: ActorCreateRequest,
    service: ActorService = Depends(get_actor_service),
):
    return await service.create_actor(payload)

# Put Requests
@router.put(
    "/{actor_id}",
    response_model=ActorResponse,
)
async def update_actor(
    actor_id: str,
    payload: ActorUpdateRequest,
    service: ActorService = Depends(get_actor_service),
):
    return await service.update_actor(actor_id, payload)


# Delete Requests
@router.delete(
    "/{actor_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_actor(
    actor_id: str,
    service: ActorService = Depends(get_actor_service),
):
    await service.delete_actor(actor_id)
