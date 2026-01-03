import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Movie Explorer</h3>
            <p className="text-sm">
              Discover movies, actors, and directors. Your ultimate guide to cinema.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Movies</a></li>
              <li><a href="/actors" className="hover:text-white transition-colors">Actors</a></li>
              <li><a href="/directors" className="hover:text-white transition-colors">Directors</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Connect</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/netajisai/movie_explorer"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by Netaji Sai
          </p>
          <p className="mt-2 text-gray-400">
            © {new Date().getFullYear()} Movie Explorer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;