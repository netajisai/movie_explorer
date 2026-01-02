import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.v1.router import router as api_v1_router

settings = get_settings()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



# ---------- Application Lifecycle ----------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting application")
    await connect_to_mongo()
    yield
    await close_mongo_connection()
    logger.info("Application shutdown complete")


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Backend service for Movie Explorer application.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- API Routers ----------
app.include_router(api_v1_router, prefix="/api/v1")
