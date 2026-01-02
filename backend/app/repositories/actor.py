from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorCollection

from app.repositories.base import BaseRepository


class ActorRepository(BaseRepository):
    """
    Repository for Actor collection.
    """

    def __init__(self, collection: AsyncIOMotorCollection):
        super().__init__(collection)

    async def get_by_name(self, name: str) -> Optional[dict]:
        return await self.collection.find_one(
            {"name": {"$regex": f"^{name}$", "$options": "i"}}
        )

    async def list_all(self, skip: int, limit: int) -> List[dict]:
        cursor = (
            self.collection
            .find({})
            .sort("name", 1)
            .skip(skip)
            .limit(limit)
        )
        docs = await cursor.to_list(length=limit)
        return [self.serialize(doc) for doc in docs]