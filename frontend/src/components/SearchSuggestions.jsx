import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/apiService';

const SearchSuggestions = ({ query, onSelect, className = '' }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  // Charger les suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);

      try {
        const data = await movieService.searchSuggestions(query);
        setSuggestions(data.results?.slice(0, 5) || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des suggestions:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (isLoading) {
    return <div className={`p-2 bg-imdb-dark-gray rounded ${className}`}>Chargement...</div>;
  }

  if (suggestions.length === 0) {
    return null;
  }

  const getSuggestionType = (type) => {
    switch (type) {
      case 'movie': return 'Film';
      case 'tv': return 'Série TV';
      case 'person': return 'Personne';
      default: return '';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`absolute z-50 w-full mt-1 bg-imdb-dark-gray rounded-lg shadow-lg border border-imdb-light-gray/30 overflow-hidden ${className}`}
    >
      <ul className="max-h-80 overflow-y-auto">
        {suggestions.map((item) => (
          <li 
            key={`${item.media_type}-${item.id}`}
            className="hover:bg-imdb-light-gray/10 transition-colors border-b border-imdb-light-gray/10 last:border-0"
          >
            <Link
              to={item.media_type === 'movie' 
                ? `/movie/${encodeURIComponent(item.title)}` 
                : item.media_type === 'tv' 
                ? `/tv/${item.id}` 
                : `/person/${item.id}`
              }
              className="block p-3 text-white hover:text-imdb-yellow"
              onClick={() => onSelect?.(item)}
            >
              {item.title || item.name}
              <span className="text-imdb-text-secondary text-xs ml-2">
                {getSuggestionType(item.media_type)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions;
