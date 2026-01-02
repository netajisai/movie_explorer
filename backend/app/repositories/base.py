from typing import Any, Dict, List, Optional
from datetime import date, datetime, time
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from pydantic import AnyUrl

class BaseRepository:
    """
    Base repository for MongoDB collections.
    Provides common async CRUD operations.
    """

    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    # ---------- Helpers ----------

    @staticmethod
    def to_object_id(id: str) -> ObjectId:
        """Convert string ID to MongoDB ObjectId."""
        if not ObjectId.is_valid(id):
            raise ValueError("Invalid ObjectId")
        return ObjectId(id)

    @staticmethod
    def add_timestamps(
        data: Dict[str, Any],
        is_update: bool = False
    ) -> Dict[str, Any]:
        """Add created_at / updated_at timestamps."""
        now = datetime.utcnow()

        if not is_update:
            data["created_at"] = now

        data["updated_at"] = now
        return data

    @staticmethod
    def serialize(document: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """Convert MongoDB document to API-friendly dict."""
        if not document:
            return None

        document["id"] = str(document["_id"])
        document.pop("_id", None)
        return document
    
    @staticmethod
    def normalize_for_mongo(data: dict) -> dict:
        """
        Convert Pydantic-specific types into MongoDB-compatible types.
        """
        normalized = {}

        for key, value in data.items():
            if isinstance(value, date) and not isinstance(value, datetime):
                normalized[key] = datetime.combine(value, time.min)

            elif isinstance(value, AnyUrl):
                normalized[key] = str(value)

            else:
                normalized[key] = value

        return normalized
    
    # ---------- CRUD Operations ----------

    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        data = self.add_timestamps(data)
        data = self.normalize_for_mongo(data)
        result = await self.collection.insert_one(data)
        document = await self.collection.find_one({"_id": result.inserted_id})
        return self.serialize(document)

    async def get_by_id(self, id: str) -> Optional[Dict[str, Any]]:
        document = await self.collection.find_one(
            {"_id": self.to_object_id(id)}
        )
        return self.serialize(document)

    async def get_many(
        self,
        filter: Optional[Dict[str, Any]] = None,
        skip: int = 0,
        limit: int = 10,
        sort_by: str = "created_at",
        order: int = -1,  # -1 desc, 1 asc
    ) -> List[Dict[str, Any]]:
        filter = filter or {}

        cursor = (
            self.collection
            .find(filter)
            .sort(sort_by, order)
            .skip(skip)
            .limit(limit)
        )

        documents = await cursor.to_list(length=limit)
        return [self.serialize(doc) for doc in documents]

    async def update(
        self,
        id: str,
        data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        data = self.add_timestamps(data, is_update=True)
        data = self.normalize_for_mongo(data)
        result = await self.collection.update_one(
            {"_id": self.to_object_id(id)},
            {"$set": data},
        )

        if result.matched_count == 0:
            return None

        document = await self.collection.find_one(
            {"_id": self.to_object_id(id)}
        )
        return self.serialize(document)

    async def delete(self, id: str) -> bool:
        result = await self.collection.delete_one(
            {"_id": self.to_object_id(id)}
        )
        return result.deleted_count == 1

    async def count(
        self,
        filter: Optional[Dict[str, Any]] = None
    ) -> int:
        filter = filter or {}
        return await self.collection.count_documents(filter)

    async def exists(
        self,
        filter: Dict[str, Any]
    ) -> bool:
        return await self.collection.count_documents(filter, limit=1) > 0
