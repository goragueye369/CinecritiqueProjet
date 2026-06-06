import { Link } from 'react-router-dom';
import { FiSearch, FiHome, FiFilm } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="bg-dark-surface/80 backdrop-blur-sm fixed w-full z-50 border-b border-border-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FiFilm className="text-accent-yellow text-2xl" />
            <span className="text-xl font-bold bg-gradient-to-r from-accent-yellow to-accent-orange bg-clip-text text-transparent">
              CineCritique
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-text-primary hover:text-accent-yellow transition-colors flex items-center space-x-1"
            >
              <FiHome className="mr-1" />
              <span>Accueil</span>
            </Link>
            <Link 
              to="/search" 
              className="text-text-primary hover:text-accent-yellow transition-colors flex items-center space-x-1"
            >
              <FiSearch className="mr-1" />
              <span>Recherche</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
