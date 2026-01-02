import pytest
from pydantic import ValidationError
from app.schemas.genre import GenreCreateRequest, GenreResponse


def test_genre_name_normalization():
	g = GenreCreateRequest(name="  action  ")
	assert g.name == "Action"


def test_genre_name_too_short():
	with pytest.raises(ValidationError):
		GenreCreateRequest(name="A")


def test_genre_response_alias_and_fields():
	resp = GenreResponse(_id="123", name="Action")
	assert resp.id == "123"
	assert resp.name == "Action"
