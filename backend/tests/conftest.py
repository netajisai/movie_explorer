import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="session")
def anyio_backend():
    """Ensure pytest-anyio uses asyncio backend in this project."""
    return "asyncio"


@pytest.fixture(scope="session")
def client():
    """FastAPI TestClient for integration-style tests.

    Note: `app` lifespan will run (connect/close DB). If that calls external
    services in CI, consider monkeypatching `connect_to_mongo`/`close_mongo_connection`.
    """
    with TestClient(app) as c:
        yield c
