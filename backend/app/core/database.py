import logging
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ASCENDING, TEXT
from pymongo.errors import ServerSelectionTimeoutError

from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


class DatabaseManager:
    """
    Manages MongoDB connection and indexes.
    """

    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db: Optional[AsyncIOMotorDatabase] = None

    async def connect(self) -> None:
        try:
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=5000,
            )
            self.db = self.client[settings.MONGODB_DB_NAME]

            # Ping DB
            await self.db.command("ping")
            logger.info("MongoDB connected")

            # Create indexes
            await self._create_indexes()

        except ServerSelectionTimeoutError as exc:
            logger.error("MongoDB connection timeout")
            raise exc

    async def disconnect(self) -> None:
        if self.client:
            self.client.close()
            logger.info("MongoDB disconnected")

    # ---------- Index Management ----------

    async def _create_indexes(self) -> None:
        """
        Create MongoDB indexes for all collections.
        Safe to run multiple times.
        """
        if self.db is None:
            return

        # ---------- Genres ----------
        await self.db.genres.create_index("name", unique=True)

        # ---------- Actors ----------
        await self.db.actors.create_index("name", unique=True)

        # ---------- Directors ----------
        await self.db.directors.create_index("name", unique=True)

        # ---------- Movies ----------
        await self.db.movies.create_index("title")
        await self.db.movies.create_index("release_year")
        await self.db.movies.create_index("director_id")
        await self.db.movies.create_index("actor_ids")
        await self.db.movies.create_index("genre_ids")

        logger.info("MongoDB indexes ensured")

    def get_database(self) -> AsyncIOMotorDatabase:
        if self.db is None:
            raise RuntimeError("Database not initialized")
        return self.db


# ---------- Dependency Helpers ----------

db_manager = DatabaseManager()

async def connect_to_mongo() -> None:
    await db_manager.connect()

async def close_mongo_connection() -> None:
    await db_manager.disconnect()

def get_database() -> AsyncIOMotorDatabase:
    return db_manager.get_database()
