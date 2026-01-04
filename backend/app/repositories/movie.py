from typing import List, Tuple
from bson import ObjectId
from app.repositories.base import BaseRepository
from app.schemas.movie import MovieCreateRequest, MovieFilterParams


class MovieRepository(BaseRepository):
    """Repository for Movie collection."""

    def __init__(self, db):
        super().__init__(db.movies)
        self.db = db

    # ---------------- CREATE ----------------
    async def create_movie(self, data: dict) -> dict:
        data["director_id"] = ObjectId(data["director_id"])
        data["actor_ids"] = [ObjectId(a) for a in data["actor_ids"]]
        data["genre_ids"] = [ObjectId(g) for g in data["genre_ids"]]
        data["ratings"] = {"average": 0.0, "count": 0, "reviews": []}
        
        result = await super().create(data)
        return await self.get_movie_by_id(result["id"])

    # ---------------- READ ----------------
    async def get_movie_by_id(self, movie_id: str) -> dict | None:
        pipeline = [{"$match": {"_id": ObjectId(movie_id)}}, *self._lookup_pipeline()]
        docs = await self.collection.aggregate(pipeline).to_list(1)
        return docs[0] if docs else None

    async def get_by_movie_title(self, title: str) -> dict | None:
        return await self.collection.find_one(
            {"title": title}
        )

    # ---------------- LIST + FILTER ----------------
    async def list_movies(self, filters: MovieFilterParams, skip: int, limit: int) -> Tuple[List[dict], int]:
        match = self._build_filter_query(filters)
        # Use the lookup pipeline to produce full movie documents (same as get_movie_by_id)
        pipeline = [
            {"$match": match},
            {"$sort": {"release_year": -1}},
            {"$skip": skip},
            {"$limit": limit},
            *self._lookup_pipeline(),
        ]

        movies = await self.collection.aggregate(pipeline).to_list(length=limit)
        total = await self.collection.count_documents(match)

        return movies, total

    # ---------------- UPDATE ----------------
    async def update_movie(self, movie_id: str, data: dict) -> dict | None:
        if "director_id" in data:
            data["director_id"] = ObjectId(data["director_id"])
        if "actor_ids" in data:
            data["actor_ids"] = [ObjectId(a) for a in data["actor_ids"]]
        if "genre_ids" in data:
            data["genre_ids"] = [ObjectId(g) for g in data["genre_ids"]]

        result = await self.collection.update_one({"_id": ObjectId(movie_id)}, {"$set": data})
        if result.matched_count == 0:
            return None
        return await self.get_movie_by_id(movie_id)

    # ---------------- DELETE ----------------
    async def delete(self, movie_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(movie_id)})
        return result.deleted_count > 0

    # ---------------- HELPERS ----------------
    def _build_filter_query(self, filters: MovieFilterParams) -> dict:
        query = {}
        if filters.search:
            query["title"] = {"$regex": filters.search, "$options": "i"}
        if filters.genre_id:
            query["genre_ids"] = ObjectId(filters.genre_id)
        if filters.director_id:
            query["director_id"] = ObjectId(filters.director_id)
        if filters.actor_id:
            query["actor_ids"] = ObjectId(filters.actor_id)
        if filters.release_year:
            query["release_year"] = filters.release_year
        if filters.min_rating or filters.max_rating:
            rating = {}
            if filters.min_rating is not None:
                rating["$gte"] = filters.min_rating
            if filters.max_rating is not None:
                rating["$lte"] = filters.max_rating
            query["ratings.average"] = rating
        return query

    def _lookup_pipeline(self) -> List[dict]:
        return [
            {"$lookup": {"from": "directors", "localField": "director_id", "foreignField": "_id", "as": "director"}},
            {"$unwind": {"path": "$director", "preserveNullAndEmptyArrays": True}},
            {"$lookup": {"from": "actors", "localField": "actor_ids", "foreignField": "_id", "as": "actors"}},
            {"$lookup": {"from": "genres", "localField": "genre_ids", "foreignField": "_id", "as": "genres"}},
            {
                "$project": {
                    "_id": 0,
                    "id": {"$toString": "$_id"},
                    "created_at": 1,
                    "updated_at": 1,
                    "title": 1,
                    "description": 1,
                    "release_year": 1,
                    "duration_minutes": 1,
                    "poster_url": 1,
                    "backdrop_url": 1,
                    "ratings": 1,
                    "director": {"id": {"$toString": "$director._id"}, "name": "$director.name"},
                    "actors": {"$map": {"input": "$actors", "as": "a", "in": {"id": {"$toString": "$$a._id"}, "name": "$$a.name"}}},
                    "genres": {"$map": {"input": "$genres", "as": "g", "in": {"id": {"$toString": "$$g._id"}, "name": "$$g.name"}}},
                }
            },
        ]

    # ---------------- REVIEWS ----------------
    async def add_review(self, movie_id: str, review: dict) -> dict | None:
        """Append a review to a movie and return the updated movie document (full lookup projection)."""
        # push the review and increment count
        result = await self.collection.update_one(
            {"_id": ObjectId(movie_id)},
            {"$push": {"ratings.reviews": review}, "$inc": {"ratings.count": 1}},
        )
        if result.matched_count == 0:
            return None

        # Recompute average from stored reviews
        doc = await self.collection.find_one({"_id": ObjectId(movie_id)}, {"ratings.reviews": 1})
        reviews = doc.get("ratings", {}).get("reviews", []) if doc else []
        avg = float(sum(r.get("rating", 0) for r in reviews) / len(reviews)) if reviews else 0.0

        await self.collection.update_one({"_id": ObjectId(movie_id)}, {"$set": {"ratings.average": avg, "ratings.count": len(reviews)}})

        return await self.get_movie_by_id(movie_id)

    async def get_reviews(self, movie_id: str) -> List[dict]:
        doc = await self.collection.find_one({"_id": ObjectId(movie_id)}, {"ratings.reviews": 1, "_id": 0})
        if not doc:
            return []
        return doc.get("ratings", {}).get("reviews", [])
