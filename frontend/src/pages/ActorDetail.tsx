import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { actorsApi } from '@/services/api';
import { PersonCardSkeleton } from '@/components/LoadingSkeleton';
import ErrorMessage from '@/components/ErrorMessage';
import { Calendar, MapPin, Film, ArrowLeft, User } from 'lucide-react';

const ActorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: actor, isLoading: actorLoading, error: actorError } = useQuery({
    queryKey: ['actor', id],
    queryFn: () => actorsApi.getById(id!),
    enabled: !!id,
  });

  const { data: movies, isLoading: moviesLoading } = useQuery({
    queryKey: ['actor-movies', id],
    queryFn: () => actorsApi.getMovies(id!),
    enabled: !!id,
  });

  if (actorLoading) return <div className="max-w-7xl mx-auto px-4 py-8"><PersonCardSkeleton /></div>;
  if (actorError) return <div className="max-w-7xl mx-auto px-4 py-8"><ErrorMessage message="Failed to load actor details" /></div>;
  if (!actor) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/actors" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Actors
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="md:col-span-1">
            <div className="card p-6">
              <div className="w-48 h-48 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                {actor.profile_image ? (
                  <img src={actor.profile_image} alt={actor.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <User className="w-24 h-24 text-gray-400" />
                )}
              </div>

              <h1 className="text-2xl font-bold text-center mb-4">{actor.name}</h1>

              <div className="space-y-3 text-sm">
                {actor.birth_date && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Born {new Date(actor.birth_date).toLocaleDateString()}</span>
                  </div>
                )}
                {actor.nationality && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{actor.nationality}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Biography */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Biography</h2>
              <p className="text-gray-700 leading-relaxed">
                {actor.bio || 'No biography available.'}
              </p>
            </div>

            {/* Filmography */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Film className="w-6 h-6" />
                Filmography {movies && `(${movies.length})`}
              </h2>

              {moviesLoading ? (
                <p className="text-gray-600">Loading filmography...</p>
              ) : movies && movies.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {movies.map((movie: any) => (
                        <Link key={movie.id ?? movie._id} to={`/movies/${movie.id ?? movie._id}`} className="group">
                      <div className="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden mb-2">
                        <img
                          src={movie.poster_url || 'https://via.placeholder.com/300x450'}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-medium group-hover:text-primary-600 transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-sm text-gray-600">{movie.release_year}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No movies found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorDetail;