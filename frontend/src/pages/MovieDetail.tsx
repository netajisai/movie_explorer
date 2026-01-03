import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { moviesApi } from '@/services/api';
import { MovieDetailSkeleton } from '@/components/LoadingSkeleton';
import ErrorMessage from '@/components/ErrorMessage';
import { Calendar, Clock, Star, User, Clapperboard, ArrowLeft } from 'lucide-react';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: movie, isLoading, error, refetch } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => moviesApi.getById(id!),
    enabled: !!id,
  });

  const { data: relatedMovies } = useQuery({
    queryKey: ['related-movies', id],
    queryFn: () => moviesApi.getRelated(id!),
    enabled: !!id,
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await moviesApi.addReview(id, rating, comment);
      setComment('');
      setShowReviewForm(false);
      refetch();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-8"><MovieDetailSkeleton /></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-8"><ErrorMessage message="Failed to load movie details" onRetry={refetch} /></div>;
  if (!movie) return null;

  const posterUrl = movie.poster_url || 'https://via.placeholder.com/400x600/1e293b/cbd5e1?text=No+Poster';
  const backdropUrl = movie.backdrop_url || 'https://via.placeholder.com/1920x1080/1e293b/cbd5e1?text=No+Backdrop';

  return (
    <div className="bg-gray-50">
      {/* Backdrop */}
      <div className="relative h-96 bg-gray-900">
        <img src={backdropUrl} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-primary-400 mb-4">
              <ArrowLeft className="w-5 h-5" />
              Back to Movies
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4 text-white/90">
              <span className="flex items-center gap-1">
                <Calendar className="w-5 h-5" />
                {movie.release_year}
              </span>
              {movie.duration_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  {Math.floor(movie.duration_minutes / 60)}h {movie.duration_minutes % 60}m
                </span>
              )}
              {movie.ratings.average > 0 && (
                <span className="flex items-center gap-1 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full font-semibold">
                  <Star className="w-5 h-5 fill-current" />
                  {movie.ratings.average.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Poster for mobile */}
            <div className="md:hidden">
              <img src={posterUrl} alt={movie.title} className="w-full rounded-xl shadow-lg" />
            </div>

            {/* Overview */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                {movie.description || 'No description available.'}
              </p>
            </div>

            {/* Cast */}
            {movie.actors.length > 0 && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Cast
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {movie.actors.map((actor) => (
                    <Link
                      key={actor.id}
                      to={`/actors/${actor.id}`}
                      className="text-center group"
                    >
                      <div className="w-24 h-24 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                        <User className="w-12 h-12 text-gray-400 group-hover:text-primary-600" />
                      </div>
                      <p className="font-medium text-sm group-hover:text-primary-600 transition-colors">
                        {actor.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Reviews ({movie.ratings.count})</h2>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="btn btn-primary"
                >
                  {showReviewForm ? 'Cancel' : 'Add Review'}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          className={`p-2 ${rating >= value ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          <Star className={`w-8 h-8 ${rating >= value ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      rows={4}
                      className="input"
                      placeholder="Share your thoughts about this movie..."
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Submit Review</button>
                </form>
              )}

              {/* Review List */}
              <div className="space-y-4">
                {movie.ratings.reviews.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                  movie.ratings.reviews.slice(0, 5).map((review, index) => (
                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Poster for desktop */}
            <div className="hidden md:block">
              <img src={posterUrl} alt={movie.title} className="w-full rounded-xl shadow-lg" />
            </div>

            {/* Movie Info */}
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-lg">Movie Info</h3>
              
              {movie.director && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Clapperboard className="w-4 h-4" />
                    <span className="text-sm font-medium">Director</span>
                  </div>
                  <Link
                    to={`/directors/${movie.director.id}`}
                    className="text-primary-600 hover:underline font-medium"
                  >
                    {movie.director.name}
                  </Link>
                </div>
              )}

              {movie.genres.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Genres</p>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span key={genre.id} className="badge badge-primary">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Rating</p>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold text-lg">{movie.ratings.average.toFixed(1)}</span>
                  <span className="text-gray-600">({movie.ratings.count} reviews)</span>
                </div>
              </div>
            </div>

            {/* Related Movies */}
            {relatedMovies && relatedMovies.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">Related Movies</h3>
                <div className="space-y-3">
                  {relatedMovies.slice(0, 5).map((related) => (
                    <Link
                      key={related.id}
                      to={`/movies/${related.id}`}
                      className="flex gap-3 group"
                    >
                      <img
                        src={related.poster_url || 'https://via.placeholder.com/80x120'}
                        alt={related.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium group-hover:text-primary-600 transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-sm text-gray-600">{related.release_year}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;