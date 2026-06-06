import React, { useState, useEffect } from 'react';
import { movieService } from '../../services/apiService';

const MovieFilters = ({ onFilterChange, currentFilters }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre: currentFilters.genre || '',
    year: currentFilters.year || '',
    minRating: currentFilters.minRating || '',
    sortBy: currentFilters.sortBy || 'popularity.desc'
  });

  // Charger les genres
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await movieService.getGenres();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Erreur lors du chargement des genres:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      genre: '',
      year: '',
      minRating: '',
      sortBy: 'popularity.desc'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  if (loading) {
    return <div className="text-center py-4">Chargement des filtres...</div>;
  }

  // Générer les années (des 30 dernières années)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = filters.genre || filters.year || filters.minRating || 
                         filters.sortBy !== 'popularity.desc';

  return (
    <div className="bg-dark-surface p-4 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Filtrer les films</h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-accent-yellow hover:text-yellow-400 font-medium flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3.5 w-3.5 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            Réinitialiser
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtre par genre */}
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-text-secondary mb-1">
            Genre
          </label>
          <div className="relative">
            <select
              id="genre"
              name="genre"
              value={filters.genre}
              onChange={handleChange}
              className="w-full bg-dark-surface-light border border-border-dark rounded-md py-2 pl-3 pr-8 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow appearance-none"
            >
              <option value="">Tous les genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filtre par année */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-text-secondary mb-1">
            Année
          </label>
          <div className="relative">
            <select
              id="year"
              name="year"
              value={filters.year}
              onChange={handleChange}
              className="w-full bg-dark-surface-light border border-border-dark rounded-md py-2 pl-3 pr-8 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow appearance-none"
            >
              <option value="">Toutes les années</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filtre par note minimale */}
        <div>
          <label htmlFor="minRating" className="block text-sm font-medium text-text-secondary mb-1">
            Note minimale
          </label>
          <div className="relative">
            <select
              id="minRating"
              name="minRating"
              value={filters.minRating}
              onChange={handleChange}
              className="w-full bg-dark-surface-light border border-border-dark rounded-md py-2 pl-3 pr-8 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow appearance-none"
            >
              <option value="">Toutes les notes</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}+
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tri */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-text-secondary mb-1">
            Trier par
          </label>
          <div className="relative">
            <select
              id="sortBy"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleChange}
              className="w-full bg-dark-surface-light border border-border-dark rounded-md py-2 pl-3 pr-8 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow appearance-none"
            >
              <option value="popularity.desc">Popularité (décroissant)</option>
              <option value="popularity.asc">Popularité (croissant)</option>
              <option value="vote_average.desc">Meilleures notes</option>
              <option value="primary_release_date.desc">Plus récents</option>
              <option value="primary_release_date.asc">Plus anciens</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieFilters;
