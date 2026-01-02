import pytest
from pydantic import ValidationError
from app.schemas.actor import ActorCreateRequest


def test_actor_name_min_length():
	with pytest.raises(ValidationError):
		ActorCreateRequest(name="A")


def test_actor_profile_image_url_invalid():
	with pytest.raises(ValidationError):
		ActorCreateRequest(name="John Doe", profile_image="not-a-url")
