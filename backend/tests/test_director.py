import pytest
from pydantic import ValidationError
from app.schemas.director import DirectorCreateRequest, DirectorUpdateRequest


def test_director_awards_default_and_fields():
	d = DirectorCreateRequest(name="Quentin Tarantino")
	assert d.awards == []
	assert d.name == "Quentin Tarantino"


def test_director_name_min_length():
	with pytest.raises(ValidationError):
		DirectorCreateRequest(name="A")


def test_director_update_allows_none_name():
	# Update schema allows name to be optional/None
	u = DirectorUpdateRequest(name=None)
	assert u.name is None
