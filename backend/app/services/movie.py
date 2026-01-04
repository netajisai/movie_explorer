from typing import List, Tuple
from pymongo.errors import DuplicateKeyError, PyMongoError
from app.repositories.movie import MovieRepository
from app.schemas.movie import (
    MovieCreateRequest, 
    MovieUpdateRequest, 
    MovieResponse, 
    MovieListResponse, 
    MovieFilterParams
)
from app.schemas.movie import ReviewCreateRequest
from app.schemas.base import PaginationParams
from app.core.exceptions import (
    NotFoundException,
    ConflictException,
    BadRequestException, 
    DatabaseException
)


class MovieService:
    """Business logic for Movies."""

    def __init__(self, repo: MovieRepository):
        self.repo = repo

    async def get_movie(self, movie_id: str) -> MovieResponse:
        try:
            movie = await self.repo.get_movie_by_id(movie_id)
            if not movie:
                raise NotFoundException("Movie")
            return MovieResponse(**movie)
        
        except PyMongoError:
            raise DatabaseException()

    async def list_movies(self, filters: MovieFilterParams, pagination: PaginationParams) -> Tuple[List[MovieListResponse], int]:
        try:
            movies, total = await self.repo.list_movies(filters, pagination.skip, pagination.limit)
            return [MovieListResponse(**m) for m in movies], total
        except PyMongoError:
            raise DatabaseException()

    async def create_movie(self, payload: MovieCreateRequest) -> MovieResponse:
        try:
            existing = await self.repo.get_by_movie_title(payload.title)
            if existing:
                raise ConflictException(
                    "Movie with this title already exists"
                )

            data = payload.model_dump()
            movie = await self.repo.create_movie(data)
            return MovieResponse(**movie)

        except DuplicateKeyError:
            raise ConflictException(
                "Movie with this title already exists"
            )

        except PyMongoError:
            raise DatabaseException()

    async def update_movie(self, movie_id: str, payload: MovieUpdateRequest) -> MovieResponse:
        try:
            data = payload.model_dump(exclude_unset=True)
            if not data:
                raise BadRequestException("No fields provided for update")
            
            movie = await self.repo.update_movie(movie_id, data)
            if not movie:
                raise NotFoundException("Movie")
            
            return MovieResponse(**movie)
        except PyMongoError:
            raise DatabaseException()

    async def delete_movie(self, movie_id: str) -> None:
        try:
            deleted = await self.repo.delete(movie_id)
            if not deleted:
                raise NotFoundException("Movie")
        except PyMongoError:
            raise DatabaseException()

    async def add_review(self, movie_id: str, payload: ReviewCreateRequest) -> MovieResponse:
        from datetime import datetime
        try:
            review = {"rating": payload.rating, "comment": payload.comment, "created_at": datetime.utcnow()}
            updated = await self.repo.add_review(movie_id, review)
            if not updated:
                raise NotFoundException("Movie")
            return MovieResponse(**updated)
        except PyMongoError:
            raise DatabaseException()

    async def get_reviews(self, movie_id: str) -> list:
        try:
            reviews = await self.repo.get_reviews(movie_id)
            return reviews
        except PyMongoError:
            raise DatabaseException()
