from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId

from app.repositories.base import BaseRepository


class GenreRepository(BaseRepository):
    """
    Repository for Genre collection.
    Handles ONLY database operations.
    """

    def __init__(self, collection: AsyncIOMotorCollection):
        super().__init__(collection)

    async def get_by_name(self, name: str) -> Optional[dict]:
        """Find genre by name (case-insensitive)."""
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
