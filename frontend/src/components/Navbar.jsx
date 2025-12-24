import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBars, FaTimes, FaStar, FaSearch } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import SearchSuggestions from './SearchSuggestions';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const searchFormRef = useRef(null);
  const navigate = useNavigate();

  // Gérer la soumission de la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  // Gérer la sélection d'une suggestion
  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery('');
    setShowSearch(false);
  };

  // Fermer la recherche si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchFormRef.current && !searchFormRef.current.contains(event.target)) {
        // Ne pas fermer si on clique sur une suggestion
        const isClickOnSuggestion = event.target.closest('.search-suggestions-container');
        if (!isClickOnSuggestion) {
          setShowSearch(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed w-full bg-imdb-dark-gray shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <button 
              className="md:hidden text-imdb-yellow p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-imdb-yellow">CineCritique</span>
            </Link>
          </div>
          
          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-6 flex-1">
            <NavLink to="/" icon={<FaHome className="mr-1" />} text="Accueil" />
            <NavLink to="/top-rated" icon={<FaStar className="mr-1" />} text="Top Films" />
          </div>

          {/* Barre de recherche Desktop */}
          <div className="hidden md:flex items-center">
            {showSearch ? (
              <div className="relative" ref={searchFormRef}>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un film, une série, un acteur..."
                    className="bg-imdb-light-gray/10 text-white rounded-full py-1 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-imdb-yellow/50 border border-imdb-light-gray/30 w-64"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-imdb-text-secondary hover:text-imdb-yellow"
                  >
                    <FaSearch />
                  </button>
                </form>
                
                {/* Suggestions de recherche */}
                <div className="search-suggestions-container absolute top-full right-0 mt-1 w-80 z-50">
                  <SearchSuggestions 
                    query={searchQuery}
                    onSelect={handleSuggestionSelect}
                    className="w-full"
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-imdb-text-secondary hover:text-imdb-yellow transition-colors"
                aria-label="Rechercher"
              >
                <FaSearch size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-imdb-black py-2 px-4 space-y-3">
            <MobileNavLink to="/" icon={<FaHome />} text="Accueil" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/top-rated" icon={<FaStar />} text="Top Films" onClick={() => setIsMenuOpen(false)} />
            
            {/* Barre de recherche Mobile */}
            <div className="px-4 py-3 border-t border-imdb-light-gray/20 mt-2">
              <div className="relative">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un film, une série..."
                    className="w-full bg-imdb-light-gray/10 text-white rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-imdb-yellow/50 border border-imdb-light-gray/30"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-imdb-text-secondary hover:text-imdb-yellow"
                  >
                    <FaSearch />
                  </button>
                </form>
                
                {/* Suggestions de recherche mobile */}
                <div className="search-suggestions-container absolute top-full left-0 right-0 mt-1 z-50">
                  <SearchSuggestions 
                    query={searchQuery}
                    onSelect={handleSuggestionSelect}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Composant pour les liens de navigation desktop
const NavLink = ({ to, icon, text }) => (
  <Link 
    to={to} 
    className="flex items-center text-imdb-text-secondary hover:text-imdb-yellow transition-colors px-3 py-2 rounded"
  >
    {icon}
    <span className="ml-2">{text}</span>
  </Link>
);

// Composant pour les liens de navigation mobile
const MobileNavLink = ({ to, icon, text, onClick }) => (
  <Link 
    to={to} 
    className="flex items-center text-imdb-text-secondary hover:text-imdb-yellow transition-colors py-2 px-4 hover:bg-imdb-dark-gray rounded"
    onClick={onClick}
  >
    <span className="text-imdb-yellow w-6">{icon}</span>
    <span className="ml-3">{text}</span>
  </Link>
);

export default Navbar;
