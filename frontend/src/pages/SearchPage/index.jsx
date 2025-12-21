import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../../components/MovieCard';
import { movieService, getImageUrl } from '../../services/apiService';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Fonction pour effectuer la recherche
  const searchMovies = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await movieService.searchMovies(searchQuery);
      setMovies(data.results || []);
    } catch (err) {
      console.error('Erreur lors de la recherche des films:', err);
      setError('Impossible de charger les résultats de recherche');
    } finally {
      setIsLoading(false);
    }
  };

  // Effet pour déclencher la recherche quand l'URL change
  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      searchMovies(query);
    } else {
      setSearchTerm('');
      setMovies([]);
    }
  }, [query]);

  // Gestionnaire de soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // La navigation va déclencher le useEffect qui fera la recherche
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      {/* En-tête */}
      <header className="bg-dark-surface shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6 text-center">
            <span className="text-accent-yellow">Cine</span>Critique
          </h1>
          
          {/* Formulaire de recherche */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="flex w-full">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                    placeholder="Rechercher un film..."
                    className="w-full bg-dark-surface-light border border-r-0 border-border-dark rounded-l-lg py-3 pl-10 pr-4 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-text-secondary" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !searchTerm.trim()}
                  className="bg-accent-yellow text-dark-bg px-6 py-3 rounded-r-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  {isLoading ? 'Recherche...' : 'Rechercher'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-900/50 border-l-4 border-red-500 text-red-100 p-4 mb-6 rounded" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Résultats de la recherche */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-yellow mb-4"></div>
            <p className="text-text-secondary">Recherche en cours...</p>
          </div>
        ) : query && movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">Aucun film trouvé pour "{query}"</p>
            <p className="text-text-secondary/70 mt-2">Essayez avec d'autres termes de recherche</p>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                imageUrl={getImageUrl(movie.poster_path, 'w500')}
              />
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg">Aucun film trouvé pour "{searchTerm}"</p>
            <p className="text-text-secondary/70 mt-2">Essayez avec d'autres termes de recherche</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Bienvenue sur CineCritique</h2>
            <p className="text-text-secondary">Utilisez la barre de recherche pour trouver des films et laissez votre avis</p>
          </div>
        )}
      </main>

      {/* Pied de page */}
      <footer className="bg-dark-surface border-t border-border-dark py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-text-secondary text-sm">
          <p>© {new Date().getFullYear()} CineCritique - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;
