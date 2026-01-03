import React from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin } from 'lucide-react';
import type { Actor, Director } from '@/types';

interface PersonCardProps {
  person: Actor | Director;
  type: 'actor' | 'director';
}

const PersonCard: React.FC<PersonCardProps> = ({ person, type }) => {
  const personId = (person as any).id ?? (person as any)._id;

  return (
    <Link to={`/${type}s/${personId}`} className="block group">
      <div className="card h-full">
        <div className="aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
          {person.profile_image ? (
            <img
              src={person.profile_image}
              alt={person.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <User className="w-24 h-24 text-gray-400" />
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 transition-colors">
            {person.name}
          </h3>

          {person.nationality && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{person.nationality}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PersonCard;