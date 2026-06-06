import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService } from '../../services/apiService';
import { getImageUrl } from '../../services/apiService';
import MovieCard from '../../components/MovieCard';
import SearchSuggestions from '../../components/SearchSuggestions';
import { FaSpinner, FaExclamationTriangle, FaInfoCircle, FaPlay, FaStar, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchFormRef = useRef(null);
  const navigate = useNavigate();

  // Gérer la soumission du formulaire de recherche
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  // Gérer la sélection d'une suggestion
  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  // Fermer les suggestions en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchFormRef.current && !searchFormRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Charger les films populaires
  const fetchPopularMovies = async (pageNum = 1) => {
    try {
      setLoading(true);
      const data = await movieService.getPopularMovies(pageNum);
      
      if (!data.results) {
        throw new Error('Aucun film trouvé');
      }

      setMovies(prevMovies => 
        pageNum === 1 ? data.results : [...prevMovies, ...data.results]
      );
      setTotalPages(data.total_pages);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des films:', err);
      setError('Impossible de charger les films. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Charger les films au montage du composant
  useEffect(() => {
    fetchPopularMovies(1);
  }, []);

  // Charger plus de films
  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPopularMovies(nextPage);
    }
  };

  // Afficher le chargement initial
  if (loading && movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-imdb-black">
        <FaSpinner className="animate-spin text-4xl text-imdb-yellow mb-4" />
        <p className="text-imdb-text-secondary">Chargement des films en cours...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-imdb-black pt-20 pb-16">
      {/* Bannière du film en vedette (premier film de la liste) */}
      {movies.length > 0 && (
        <div className="relative h-96 mb-12 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${getImageUrl(movies[0]?.backdrop_path || movies[0]?.poster_path, 'original')})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-imdb-black to-imdb-black/30" />
          </div>
          
          <div className="container mx-auto px-4 h-full relative z-10 flex items-end pb-12">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {movies[0]?.title}
              </h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center bg-imdb-yellow/90 text-imdb-black px-3 py-1 rounded-md font-bold mr-4">
                  <FaStar className="mr-1" />
                  {movies[0]?.vote_average?.toFixed(1)}
                </div>
                <span className="text-imdb-text-secondary">
                  {new Date(movies[0]?.release_date).getFullYear()}
                </span>
              </div>
              <p className="text-imdb-text-secondary line-clamp-3 mb-6">
                {movies[0]?.overview}
              </p>
              <div className="flex space-x-4">
                <button className="bg-imdb-yellow hover:bg-imdb-yellow/90 text-imdb-black font-bold py-2 px-6 rounded flex items-center">
                  <FaPlay className="mr-2" /> Regarder
                </button>
                <button className="bg-imdb-dark-gray hover:bg-imdb-dark-gray/80 text-imdb-text-primary font-medium py-2 px-4 rounded border border-imdb-light-gray/30">
                  + Ma liste
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Barre de recherche */}
        <div ref={searchFormRef} className="mb-8 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
              placeholder="Rechercher un film, une série, un acteur..."
              className="w-full bg-imdb-dark-gray border border-imdb-light-gray/30 rounded-full py-3 px-6 pl-12 text-imdb-text-primary focus:outline-none focus:ring-2 focus:ring-imdb-yellow/50 focus:border-transparent"
            />
            <button 
              type="submit"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-imdb-text-secondary hover:text-imdb-yellow transition-colors"
            >
              <FaSearch className="text-xl" />
            </button>

            {/* Suggestions de recherche */}
            <div className="search-suggestions-container absolute top-full left-0 right-0 mt-1 z-50">
              <SearchSuggestions 
                query={searchQuery}
                onSelect={handleSuggestionSelect}
                className="w-full"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-imdb-text-primary flex items-center">
            <FaStar className="text-imdb-yellow mr-2" />
            Films Populaires
          </h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm rounded bg-imdb-dark-gray text-imdb-text-secondary hover:bg-imdb-light-gray/20">
              Tendance
            </button>
            <button className="px-3 py-1 text-sm rounded bg-imdb-dark-gray text-imdb-text-secondary hover:bg-imdb-light-gray/20">
              Nouveautés
            </button>
          </div>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/80 border-l-4 border-red-500 text-red-100 p-6 mb-6 rounded-lg shadow-lg"
            role="alert"
          >
            <div className="flex items-start">
              <FaExclamationTriangle className="text-red-400 text-2xl mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-1">Erreur de chargement</h3>
                <p className="mb-2">{error}</p>
                <div className="bg-black/30 p-3 rounded text-sm mt-3">
                  <div className="flex items-start">
                    <FaInfoCircle className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Détails techniques :</p>
                      <p className="text-imdb-text-secondary text-xs mt-1 font-mono">
                        {error.message || 'Aucun détail supplémentaire disponible'}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors duration-200"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {movies.map((movie, index) => (
            <motion.div
              key={`${movie.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MovieCard 
                movie={movie}
                imageUrl={getImageUrl(movie.poster_path, 'w500')}
              />
            </motion.div>
          ))}
        </div>
        
        {!loading && page < totalPages && (
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-imdb-yellow hover:bg-imdb-yellow/90 text-imdb-black font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center mx-auto"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Chargement...
                </>
              ) : (
                'Voir plus de films'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
