import React, { useState, useEffect } from 'react';
import { movieService } from '../../services/apiService';

const MovieFilters = ({ onFilterChange, currentFilters = {} }) => {
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
    return (
      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: 'var(--text-secondary)'
      }}>
        Chargement des filtres...
      </div>
    );
  }

  // Générer les années (des 30 dernières années)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = filters.genre || filters.year || filters.minRating || 
                         filters.sortBy !== 'popularity.desc';

  const selectStyles = {
    width: '100%',
    padding: '10px 15px',
    backgroundColor: 'var(--bg-primary)',
    border: '2px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    backgroundSize: '16px'
  };

  const labelStyles = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '8px'
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-tertiary)',
      padding: '25px',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: 0
        }}>
          Filtres avancés
        </h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              backgroundColor: 'transparent',
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'var(--accent)';
              e.target.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'var(--accent)';
            }}
          >
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Réinitialiser
          </button>
        )}
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {/* Filtre par genre */}
        <div>
          <label htmlFor="genre" style={labelStyles}>
            Genre
          </label>
          <select
            id="genre"
            name="genre"
            value={filters.genre}
            onChange={handleChange}
            style={selectStyles}
            onMouseOver={(e) => {
              e.target.style.borderColor = 'var(--accent)';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = 'var(--border)';
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent)';
              e.target.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">Tous les genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par année */}
        <div>
          <label htmlFor="year" style={labelStyles}>
            Année de sortie
          </label>
          <select
            id="year"
            name="year"
            value={filters.year}
            onChange={handleChange}
            style={selectStyles}
            onMouseOver={(e) => {
              e.target.style.borderColor = 'var(--accent)';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = 'var(--border)';
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent)';
              e.target.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">Toutes les années</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par note minimale */}
        <div>
          <label htmlFor="minRating" style={labelStyles}>
            Note minimale
          </label>
          <select
            id="minRating"
            name="minRating"
            value={filters.minRating}
            onChange={handleChange}
            style={selectStyles}
            onMouseOver={(e) => {
              e.target.style.borderColor = 'var(--accent)';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = 'var(--border)';
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent)';
              e.target.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">Toutes les notes</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((rating) => (
              <option key={rating} value={rating}>
                {rating}+ / 10
              </option>
            ))}
          </select>
        </div>

        {/* Tri */}
        <div>
          <label htmlFor="sortBy" style={labelStyles}>
            Trier par
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            style={selectStyles}
            onMouseOver={(e) => {
              e.target.style.borderColor = 'var(--accent)';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = 'var(--border)';
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent)';
              e.target.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="popularity.desc">Popularité (décroissant)</option>
            <option value="popularity.asc">Popularité (croissant)</option>
            <option value="vote_average.desc">Meilleures notes</option>
            <option value="vote_average.asc">Moins bonnes notes</option>
            <option value="primary_release_date.desc">Plus récents</option>
            <option value="primary_release_date.asc">Plus anciens</option>
            <option value="title.asc">Titre (A-Z)</option>
            <option value="title.desc">Titre (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Indicateurs de filtres actifs */}
      {hasActiveFilters && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '10px',
            fontWeight: '600'
          }}>
            Filtres actifs :
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {filters.genre && (
              <span style={{
                padding: '4px 8px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Genre: {genres.find(g => g.id === parseInt(filters.genre))?.name || filters.genre}
              </span>
            )}
            {filters.year && (
              <span style={{
                padding: '4px 8px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Année: {filters.year}
              </span>
            )}
            {filters.minRating && (
              <span style={{
                padding: '4px 8px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Note: {filters.minRating}+
              </span>
            )}
            {filters.sortBy !== 'popularity.desc' && (
              <span style={{
                padding: '4px 8px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Tri: {
                  filters.sortBy === 'vote_average.desc' ? 'Meilleures notes' :
                  filters.sortBy === 'primary_release_date.desc' ? 'Plus récents' :
                  filters.sortBy === 'primary_release_date.asc' ? 'Plus anciens' :
                  filters.sortBy === 'title.asc' ? 'Titre A-Z' :
                  filters.sortBy === 'title.desc' ? 'Titre Z-A' :
                  filters.sortBy
                }
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieFilters;
