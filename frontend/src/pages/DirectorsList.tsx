import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { directorsApi } from '@/services/api';
import PersonCard from '@/components/PersonCard';
import { PersonCardSkeleton } from '@/components/LoadingSkeleton';
import ErrorMessage from '@/components/ErrorMessage';
import Pagination from '@/components/Pagination';
import { Clapperboard } from 'lucide-react';

const DirectorsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['directors', page],
    queryFn: () => directorsApi.getAll(page, limit),
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Clapperboard className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Directors</h1>
          </div>
          <p className="text-xl text-indigo-100 max-w-2xl">
            Explore visionary directors and their cinematic masterpieces
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {data && (
          <div className="mb-6">
            <p className="text-gray-600">{data.meta.total} directors found</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <ErrorMessage
            message="Failed to load directors. Please try again."
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

        {/* Directors Grid */}
        {data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {data.data.map((director: any) => (
                <PersonCard key={(director as any).id ?? (director as any)._id} person={director} type="director" />
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
            <Clapperboard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No directors found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectorsList;