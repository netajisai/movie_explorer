import React from 'react';

export const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="card">
      <div className="skeleton h-72 w-full rounded-t-xl"></div>
      <div className="p-4 space-y-3">
        <div className="skeleton h-6 w-3/4 rounded"></div>
        <div className="skeleton h-4 w-1/2 rounded"></div>
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16 rounded-full"></div>
          <div className="skeleton h-6 w-16 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export const MovieDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero section skeleton */}
      <div className="skeleton h-96 w-full rounded-xl"></div>
      
      {/* Content skeleton */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="skeleton h-8 w-3/4 rounded"></div>
          <div className="skeleton h-4 w-full rounded"></div>
          <div className="skeleton h-4 w-full rounded"></div>
          <div className="skeleton h-4 w-2/3 rounded"></div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-48 w-full rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export const PersonCardSkeleton: React.FC = () => {
  return (
    <div className="card">
      <div className="skeleton h-64 w-full rounded-t-xl"></div>
      <div className="p-4 space-y-2">
        <div className="skeleton h-5 w-3/4 rounded"></div>
        <div className="skeleton h-4 w-1/2 rounded"></div>
      </div>
    </div>
  );
};

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton h-24 w-full rounded-xl"></div>
      ))}
    </div>
  );
};