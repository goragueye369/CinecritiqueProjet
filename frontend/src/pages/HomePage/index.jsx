import { useState, useEffect } from 'react';
import { movieService } from '../../services/apiService';
import { getImageUrl } from '../../services/apiService';
import MovieCard from '../../components/MovieCard';
import MovieFilters from '../../components/MovieFilters';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    minRating: '',
    sortBy: 'popularity.desc'
  });
  const [hasFilters, setHasFilters] = useState(false);

  // Fonction pour charger les films avec les filtres actuels
  const fetchMovies = async (pageNum = 1, reset = false) => {
    try {
      console.log('Chargement des films avec filtres:', { filters, page: pageNum });
      setLoading(true);
      
      let data;
      
      // Vérifier si des filtres sont actifs
      const isFiltered = filters.genre || filters.year || filters.minRating || 
                        filters.sortBy !== 'popularity.desc';
      
      if (isFiltered) {
        data = await movieService.getFilteredMovies(filters, pageNum);
        setHasFilters(true);
      } else {
        data = await movieService.getPopularMovies(pageNum);
        setHasFilters(false);
      }
      
      console.log('Données reçues de l\'API:', {
        page: pageNum,
        hasResults: !!data.results,
        resultsCount: data.results ? data.results.length : 0,
        totalPages: data.total_pages,
        isFiltered
      });

      if (!data.results) {
        throw new Error('Aucune donnée reçue de l\'API');
      }

      setMovies(prevMovies =>
        pageNum === 1 || reset ? data.results : [...prevMovies, ...data.results]
      );
      setTotalPages(data.total_pages);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des films:', {
        error: err.message,
        stack: err.stack,
        filters,
        page: pageNum
      });
      setError(`Impossible de charger les films: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Charger les films lorsque la page ou les filtres changent
  useEffect(() => {
    // Réinitialiser à la première page lorsque les filtres changent
    if (page === 1) {
      fetchMovies(1, true);
    } else {
      setPage(1); // Cela déclenchera un nouvel effet
    }
  }, [filters]);

  // Charger les films lorsque la page change
  useEffect(() => {
    fetchMovies(page);
  }, [page]);
  
  // Gestionnaire de changement de filtre
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      genre: '',
      year: '',
      minRating: '',
      sortBy: 'popularity.desc'
    });
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Afficher le chargement initial
  if (loading && movies.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-yellow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {hasFilters ? 'Résultats de la recherche' : 'Films Populaires'}
          </h1>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="text-accent-yellow hover:text-yellow-400 text-sm font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réinitialiser les filtres
            </button>
          )}
        </div>
        
        {/* Composant de filtres */}
        <MovieFilters 
          onFilterChange={handleFilterChange} 
          currentFilters={filters} 
        />
        
        {error && (
          <div className="bg-red-900/50 border-l-4 border-red-500 text-red-100 p-4 mb-6 rounded" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie}
              imageUrl={getImageUrl(movie.poster_path, 'w500')}
            />
          ))}
        </div>
        
        {!loading && page < totalPages && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-accent-yellow text-dark-bg px-6 py-3 rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
          >
            {loading ? 'Chargement...' : 'Charger plus'}
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default HomePage;
