import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { moviesApi, genresApi } from '@/services/api';
import MovieCard from '@/components/MovieCard';
import { MovieCardSkeleton } from '@/components/LoadingSkeleton';
import ErrorMessage from '@/components/ErrorMessage';
import Pagination from '@/components/Pagination';
import { Filter, X } from 'lucide-react';
import type { MovieFilters } from '@/types';

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState<MovieFilters>({
    search: searchParams.get('search') || '',
    genre_id: searchParams.get('genre_id') || '',
    release_year: searchParams.get('release_year') ? parseInt(searchParams.get('release_year')!) : undefined,
    min_rating: searchParams.get('min_rating') ? parseFloat(searchParams.get('min_rating')!) : undefined,
    page: parseInt(searchParams.get('page') || '1'),
    limit: 20,
    sort_by: searchParams.get('sort_by') || 'release_year',
    order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
  });

  // Fetch genres for filter
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: () => genresApi.getAll(),
  });

  // Fetch movies
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['movies', filters],
    queryFn: () => moviesApi.filter(filters),
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.genre_id) params.set('genre_id', filters.genre_id);
    if (filters.release_year) params.set('release_year', filters.release_year.toString());
    if (filters.min_rating) params.set('min_rating', filters.min_rating.toString());
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.order) params.set('order', filters.order);
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // If the URL contained a genre name (legacy), map it to the correct genre id once genres load
  useEffect(() => {
    if (!genres) return;
    if (!filters.genre_id) return;

    // If the current genre_id matches a genre name, replace with the actual id
    const matchedByName = genres.find(g => g.name === filters.genre_id);
    if (matchedByName && matchedByName.id !== filters.genre_id) {
      setFilters(prev => ({ ...prev, genre_id: (matchedByName as any).id ?? (matchedByName as any)._id }));
    }
  }, [genres]);

  const handleFilterChange = (key: keyof MovieFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      genre_id: '',
      release_year: undefined,
      min_rating: undefined,
      page: 1,
      limit: 20,
      sort_by: 'release_year',
      order: 'desc',
    });
  };

  const hasActiveFilters = filters.search || filters.genre_id || filters.release_year || filters.min_rating;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Movies</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Explore thousands of movies, filter by genre, year, and rating. Find your next favorite film.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
          
          {data && (
            <p className="text-gray-600">
              {data.meta.total} movies found
            </p>
          )}
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="card p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <select
                  value={filters.genre_id || ''}
                  onChange={(e) => handleFilterChange('genre_id', e.target.value)}
                  className="input"
                >
                  <option value="">All Genres</option>
                  {genres?.map((genre) => (
                    <option
                      key={(genre as any).id ?? (genre as any)._id ?? genre.name}
                      value={(genre as any).id ?? (genre as any)._id ?? genre.name}
                    >
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release Year
                </label>
                <input
                  type="number"
                  placeholder="e.g., 2010"
                  value={filters.release_year || ''}
                  onChange={(e) => handleFilterChange('release_year', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="input"
                  min="1888"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.min_rating || ''}
                  onChange={(e) => handleFilterChange('min_rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="input"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ ⭐⭐⭐⭐⭐</option>
                  <option value="4.0">4.0+ ⭐⭐⭐⭐</option>
                  <option value="3.5">3.5+ ⭐⭐⭐</option>
                  <option value="3.0">3.0+ ⭐⭐⭐</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={`${filters.sort_by}_${filters.order}`}
                  onChange={(e) => {
                    const [sort_by, order] = e.target.value.split('_');
                    setFilters(prev => ({ ...prev, sort_by, order: order as 'asc' | 'desc' }));
                  }}
                  className="input"
                >
                  <option value="release_year_desc">Newest First</option>
                  <option value="release_year_asc">Oldest First</option>
                  <option value="title_asc">Title A-Z</option>
                  <option value="title_desc">Title Z-A</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <ErrorMessage
            message="Failed to load movies. Please try again."
            onRetry={() => refetch()}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Movies Grid */}
        {data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {data.data.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={data.meta.page}
              totalPages={data.meta.pages}
              onPageChange={(page) => handleFilterChange('page', page)}
            />
          </>
        )}

        {/* Empty State */}
        {data && data.data.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No movies found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search query
            </p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;