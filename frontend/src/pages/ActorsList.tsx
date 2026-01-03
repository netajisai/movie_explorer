import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { actorsApi } from '@/services/api';
import PersonCard from '@/components/PersonCard';
import { PersonCardSkeleton } from '@/components/LoadingSkeleton';
import ErrorMessage from '@/components/ErrorMessage';
import Pagination from '@/components/Pagination';
import { Users } from 'lucide-react';

const ActorsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['actors', page],
    queryFn: () => actorsApi.getAll(page, limit),
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Users className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Actors</h1>
          </div>
          <p className="text-xl text-purple-100 max-w-2xl">
            Discover talented actors and explore their filmography
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {data && (
          <div className="mb-6">
            <p className="text-gray-600">{data.meta.total} actors found</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <ErrorMessage
            message="Failed to load actors. Please try again."
            onRetry={() => refetch()}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <PersonCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Actors Grid */}
        {data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {data.data.map((actor) => (
                <PersonCard key={actor.id} person={actor} type="actor" />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={data.meta.page}
              totalPages={data.meta.pages}
              onPageChange={setPage}
            />
          </>
        )}

        {/* Empty State */}
        {data && data.data.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No actors found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActorsList;