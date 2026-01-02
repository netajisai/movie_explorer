from fastapi import APIRouter

router = APIRouter()

@router.get("/", summary="Health Check")
async def health_check():
    """
    Health check endpoint to verify service availability.
    """
    return {
        "status": "ok",
        "service": "movie-explorer-backend"
    }
