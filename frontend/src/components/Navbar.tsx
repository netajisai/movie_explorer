import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, Search, Menu, X, Home, Users, Clapperboard } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <Film className="w-8 h-8" />
            <span className="hidden sm:inline">Movie Explorer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              Movies
            </Link>
            <Link
              to="/actors"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/actors') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              Actors
            </Link>
            <Link
              to="/directors"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/directors') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Clapperboard className="w-5 h-5" />
              Directors
            </Link>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-64 pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <form onSubmit={handleSearch} className="px-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </form>
            <div className="space-y-1 px-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  isActive('/') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                Movies
              </Link>
              <Link
                to="/actors"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  isActive('/actors') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                Actors
              </Link>
              <Link
                to="/directors"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  isActive('/directors') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Clapperboard className="w-5 h-5" />
                Directors
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;