import pytest
from pydantic import ValidationError
from app.schemas.movie import (
	MovieCreateRequest,
	ReviewCreateRequest,
	MovieFilterParams,
)


def test_movie_deduplicate_actor_genre_ids():
	m = MovieCreateRequest(
		title="Test Movie",
		release_year=2000,
		director_id="d1",
		actor_ids=["a1", "a1", "a2"],
		genre_ids=["g1", "g1"],
	)
	assert m.actor_ids == ["a1", "a2"]
	assert m.genre_ids == ["g1"]


def test_review_rating_bounds():
	with pytest.raises(ValidationError):
		ReviewCreateRequest(rating=6, comment="Too high")
	with pytest.raises(ValidationError):
		ReviewCreateRequest(rating=-1, comment="Too low")


def test_movie_filter_rating_range_validation():
	with pytest.raises(ValidationError):
		MovieFilterParams(min_rating=4.5, max_rating=4.0)
