import { useState, useEffect } from 'react';
import { movieService } from '../../services/apiService';
import { getImageUrl } from '../../services/apiService';
import MovieCard from '../../components/MovieCard';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        console.log('Chargement des films populaires, page', page);
        setLoading(true);
        const data = await movieService.getPopularMovies(page);
        
        console.log('Données reçues de l\'API:', {
          page: page,
          hasResults: !!data.results,
          resultsCount: data.results ? data.results.length : 0,
          totalPages: data.total_pages
        });
        
        if (!data.results) {
          throw new Error('Aucune donnée reçue de l\'API');
        }
        
        setMovies(prevMovies => 
          page === 1 ? data.results : [...prevMovies, ...data.results]
        );
        setTotalPages(data.total_pages);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des films:', {
          error: err.message,
          stack: err.stack
        });
        setError(`Impossible de charger les films populaires: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, [page]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

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
        <h1 className="text-3xl font-bold mb-8">Films Populaires</h1>
        
        {error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {movies.map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie}
                  imageUrl={getImageUrl(movie.poster_path, 'w500')}
                />
              ))}
            </div>
            
            {page < totalPages && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-accent-yellow text-dark-bg font-bold py-2 px-6 rounded-full hover:bg-yellow-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Chargement...' : 'Voir plus'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
