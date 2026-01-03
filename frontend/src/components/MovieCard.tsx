import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Film } from 'lucide-react';
import type { MovieListItem } from '@/types';

interface MovieCardProps {
  movie: MovieListItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const posterUrl = movie.poster_url || 'https://via.placeholder.com/300x450/1e293b/cbd5e1?text=No+Poster';

  return (
    <Link to={`/movies/${movie.id}`} className="block group">
      <div className="card h-full">
        {/* Poster */}
        <div className="relative overflow-hidden aspect-[2/3] bg-gray-200">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x450/1e293b/cbd5e1?text=No+Poster';
            }}
          />
          {/* Rating badge */}
          {movie.average_rating > 0 && (
            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {movie.average_rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary-600 transition-colors">
            {movie.title}
          </h3>

          {/* Year and Director */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{movie.release_year}</span>
            </div>
            {movie.director_name && (
              <div className="flex items-center gap-1">
                <Film className="w-4 h-4" />
                <span className="truncate">{movie.director_name}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {movie.genres.slice(0, 3).map((genre) => {
                const isString = typeof genre === 'string';
                const label = isString ? genre : (genre as any).name ?? String(genre);
                const key = isString ? label : (genre as any).id ?? label;

                return (
                  <span key={key} className="badge badge-primary text-xs">
                    {label}
                  </span>
                );
              })}
              {movie.genres.length > 3 && (
                <span className="badge badge-gray text-xs">
                  +{movie.genres.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Rating info */}
          {movie.rating_count > 0 && (
            <div className="text-xs text-gray-500">
              {movie.rating_count} {movie.rating_count === 1 ? 'rating' : 'ratings'}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;