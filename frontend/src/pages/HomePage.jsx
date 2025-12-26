import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, Play, Calendar, Clock, Film, Search, ChevronRight, X, User, LogOut, Settings, TrendingUp, Award, Heart } from 'lucide-react';
import { movieService, getImageUrl } from '../services/apiService';
import SearchSuggestions from '../components/SearchSuggestions';
import MovieFilters from '../components/MovieFilters';

const HomePage = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [userWatchlist, setUserWatchlist] = useState([]);
  
  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    minRating: '',
    sortBy: 'popularity.desc',
    language: 'fr-FR'
  });
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [activeTab, setActiveTab] = useState('popular');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fonctions principales
  const fetchTrailer = async (movieId) => {
    if (!movieId) {
      console.error('fetchTrailer: movieId est undefined ou null');
      return null;
    }
    
    try {
      const videos = await movieService.getMovieVideos(movieId);
      if (videos && videos.results) {
        const trailer = videos.results.find(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        ) || videos.results[0];
        
        if (trailer) {
          return `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
        }
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la bande-annonce:', error);
      return null;
    }
  };

  const handleMovieClick = (movie) => {
    navigate(`/movie/${encodeURIComponent(movie.title)}`);
  };

  const handleWatchTrailer = async (movie, e) => {
    e.stopPropagation();
    try {
      const trailer = await fetchTrailer(movie.id);
      if (trailer) {
        setTrailerUrl(trailer);
        setShowTrailer(true);
      } else {
        alert('Aucune bande-annonce disponible pour ce film.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la bande-annonce:', error);
      alert('Erreur lors de la récupération de la bande-annonce.');
    }
  };

  const handleCreateReview = (movie, e) => {
    e.stopPropagation();
    if (isAuthenticated) {
      navigate(`/create-review?movie=${encodeURIComponent(movie.title)}`);
    } else {
      navigate('/login');
    }
  };

  const handleSearch = async (term) => {
    if (term.trim()) {
      setIsSearchMode(true);
      setShowSuggestions(false);
      try {
        setMoviesLoading(true);
        const response = await movieService.searchMovies(term, 1, filters);
        
        // Mettre à jour les films avec les résultats de recherche
        setMovies(response.results || []);
        setPopularMovies(response.results || []);
        setTopRatedMovies(response.results || []);
        setUpcomingMovies(response.results || []);
        setNowPlayingMovies(response.results || []);
        
        setCurrentPage(1);
        setHasMore(response.results && response.results.length > 0);
        setError('');
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setError('Erreur lors de la recherche de films.');
      } finally {
        setMoviesLoading(false);
      }
    } else {
      setIsSearchMode(false);
      // Recharger les films par défaut
      loadMovies(activeTab);
    }
  };

  // Ajouter un debounce pour les suggestions de recherche
  const searchTimeoutRef = useRef(null);
  
  const debouncedSearchSuggestions = (query) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (query.length > 0) {
        movieService.searchMovies(query, 1)
          .then(response => {
            if (response && response.results) {
              setSuggestions(response.results.slice(0, 8));
            }
          })
          .catch(error => {
            console.error('Erreur lors de la recherche de suggestions:', error);
          });
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms de debounce
  };

  const loadMoreMovies = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      let response;
      
      switch (activeTab) {
        case 'popular':
          response = await movieService.getPopularMovies(nextPage, filters);
          setPopularMovies(prev => [...prev, ...(response.results || [])]);
          break;
        case 'toprated':
          response = await movieService.getTopRatedMovies(nextPage, filters);
          setTopRatedMovies(prev => [...prev, ...(response.results || [])]);
          break;
        case 'upcoming':
          response = await movieService.getUpcomingMovies(nextPage, filters);
          setUpcomingMovies(prev => [...prev, ...(response.results || [])]);
          break;
        case 'nowplaying':
          response = await movieService.getNowPlayingMovies(nextPage, filters);
          setNowPlayingMovies(prev => [...prev, ...(response.results || [])]);
          break;
      }
      
      setCurrentPage(nextPage);
      setHasMore(response.results && response.results.length > 0);
    } catch (error) {
      console.error('Erreur lors du chargement de plus de films:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMovies = async (category = 'popular') => {
    try {
      setMoviesLoading(true);
      let response;
      
      switch (category) {
        case 'popular':
          response = await movieService.getPopularMovies(1, filters);
          setPopularMovies(response.results || []);
          break;
        case 'toprated':
          response = await movieService.getTopRatedMovies(1, filters);
          setTopRatedMovies(response.results || []);
          break;
        case 'upcoming':
          response = await movieService.getUpcomingMovies(1, filters);
          setUpcomingMovies(response.results || []);
          break;
        case 'nowplaying':
          response = await movieService.getNowPlayingMovies(1, filters);
          setNowPlayingMovies(response.results || []);
          break;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des films:', error);
      setError('Erreur lors du chargement des films.');
    } finally {
      setMoviesLoading(false);
    }
  };

  // Effets
  useEffect(() => {
    if (!loading) {
      loadMovies(activeTab);
    }
  }, [loading, activeTab, filters]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Charger les données utilisateur
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    try {
      // Charger les favoris, la liste de visionnage, etc.
      // const favorites = await userService.getFavorites();
      // setUserFavorites(favorites);
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px 40px',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      {/* Header principal */}
      <header style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '20px 0',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 30px'
        }}>
          <div>
            <h1 style={{
              color: 'var(--accent)',
              fontSize: '2.5rem',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              CineCritique
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              margin: 0
            }}>
              Découvrez, critiquez et partagez vos films préférés
            </p>
          </div>
          
          {/* Menu utilisateur */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            {isAuthenticated ? (
              <>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '8px',
                      color: 'var(--text-secondary)',
                      position: 'relative'
                    }}
                  >
                    <Heart size={24} />
                    {notifications.length > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'var(--accent)',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {notifications.length}
                      </span>
                    )}
                  </button>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 15px',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <User size={20} />
                    <span>{user?.username || 'Utilisateur'}</span>
                    <ChevronRight size={16} />
                  </button>
                  
                  {showUserMenu && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '10px 0',
                      minWidth: '200px',
                      zIndex: 1000,
                      marginTop: '5px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                      <Link
                        to="/profile"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 20px',
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = 'var(--bg-tertiary)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Settings size={16} />
                        Mon profil
                      </Link>
                      <Link
                        to="/favorites"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 20px',
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = 'var(--bg-tertiary)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Heart size={16} />
                        Mes favoris
                      </Link>
                      <Link
                        to="/watchlist"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 20px',
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = 'var(--bg-tertiary)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Play size={16} />
                        Ma liste de visionnage
                      </Link>
                      <div style={{
                        height: '1px',
                        backgroundColor: 'var(--border)',
                        margin: '10px 0'
                      }} />
                      <button
                        onClick={() => {
                          // Logique de déconnexion
                          navigate('/login');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 20px',
                          color: 'var(--accent)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <LogOut size={16} />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Utilisateur non connecté - ne pas afficher les boutons Connexion/Inscription
              null
            )}
          </div>
        </div>
      </header>

      {/* Barre de recherche principale - en haut de la page */}
      <div style={{
        marginBottom: '30px',
        backgroundColor: 'var(--bg-secondary)',
        padding: '25px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchTerm);
          }}>
            <div style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center'
            }}>
              <div style={{ 
                position: 'relative', 
                flex: 1 
              }}>
                <input
                  type="text"
                  placeholder="Rechercher un film, un acteur, un réalisateur..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value.length > 0) {
                      setShowSuggestions(true);
                      // Utiliser le debounce pour les suggestions
                      debouncedSearchSuggestions(e.target.value);
                    } else {
                      setShowSuggestions(false);
                      setSuggestions([]);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '15px 50px 15px 20px',
                    fontSize: '16px',
                    border: '2px solid var(--border)',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                  onBlur={() => {
                    // Délai pour permettre le clic sur les suggestions
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                />
                <div style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setShowSuggestions(false);
                        setIsSearchMode(false);
                        loadMovies(activeTab);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '5px',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = 'var(--bg-tertiary)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="submit"
                    style={{
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      color: '#fff',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: '600'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#e74c3c';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'var(--accent)';
                    }}
                  >
                    <Search size={18} />
                    Rechercher
                  </button>
                </div>
              </div>
            </div>
          </form>
          
          {/* Suggestions de recherche */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderTop: 'none',
              borderRadius: '0 0 12px 12px',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  onClick={() => {
                    setSearchTerm(suggestion.title);
                    setShowSuggestions(false);
                    handleSearch(suggestion.title);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    borderBottom: index < suggestions.length - 1 ? '1px solid var(--border)' : 'none'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <img
                      src={getImageUrl(suggestion.poster_path, 'w92')}
                      alt={suggestion.title}
                      style={{
                        width: '40px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMmEyYTJhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5OTk5IiBmb250LXNpemU9IjgiIGZvbnQtZmFtaWx5PSJBcmlhbCBzYW5zLXNlcmlmIj5JbWc8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '4px'
                    }}>
                      {suggestion.title}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)'
                    }}>
                      {suggestion.release_date && new Date(suggestion.release_date).getFullYear()} • 
                      {suggestion.vote_average ? ` ${suggestion.vote_average.toFixed(1)}/5` : ' N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section de recherche et filtres professionnels */}
      <section style={{
        marginBottom: '40px',
        backgroundColor: 'var(--bg-secondary)',
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Filtres avancés professionnels */}
        <div>
          <h3 style={{
            marginBottom: '15px',
            fontSize: '1.2rem',
            color: 'var(--text-primary)',
            fontWeight: '600'
          }}>
            Filtres avancés
          </h3>
          <MovieFilters 
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>
      </section>

      {/* Section principale des films */}
      <main>
        {/* Navigation par onglets */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '10px'
        }}>
          {[
            { id: 'popular', label: 'Populaires', icon: TrendingUp },
            { id: 'toprated', label: 'Mieux notés', icon: Star },
            { id: 'upcoming', label: 'À venir', icon: Calendar },
            { id: 'nowplaying', label: 'Au cinéma', icon: Film }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-primary)',
                border: activeTab === tab.id ? 'none' : '1px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal'
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        <div>
          {activeTab === 'popular' && (
            <MovieSection 
              title="Films populaires"
              movies={popularMovies}
              loading={moviesLoading}
              onMovieClick={handleMovieClick}
              onWatchTrailer={handleWatchTrailer}
              onCreateReview={handleCreateReview}
              isAuthenticated={isAuthenticated}
              onLoadMore={loadMoreMovies}
              hasMore={hasMore}
              loadingMore={loadingMore}
              navigate={navigate}
            />
          )}
          
          {activeTab === 'toprated' && (
            <MovieSection 
              title="Films les mieux notés"
              movies={topRatedMovies}
              loading={moviesLoading}
              onMovieClick={handleMovieClick}
              onWatchTrailer={handleWatchTrailer}
              onCreateReview={handleCreateReview}
              isAuthenticated={isAuthenticated}
              onLoadMore={loadMoreMovies}
              hasMore={hasMore}
              loadingMore={loadingMore}
              navigate={navigate}
            />
          )}
          
          {activeTab === 'upcoming' && (
            <MovieSection 
              title="Films à venir"
              movies={upcomingMovies}
              loading={moviesLoading}
              onMovieClick={handleMovieClick}
              onWatchTrailer={handleWatchTrailer}
              onCreateReview={handleCreateReview}
              isAuthenticated={isAuthenticated}
              onLoadMore={loadMoreMovies}
              hasMore={hasMore}
              loadingMore={loadingMore}
              navigate={navigate}
            />
          )}
          
          {activeTab === 'nowplaying' && (
            <MovieSection 
              title="Films au cinéma"
              movies={nowPlayingMovies}
              loading={moviesLoading}
              onMovieClick={handleMovieClick}
              onWatchTrailer={handleWatchTrailer}
              onCreateReview={handleCreateReview}
              isAuthenticated={isAuthenticated}
              onLoadMore={loadMoreMovies}
              hasMore={hasMore}
              loadingMore={loadingMore}
              navigate={navigate}
            />
          )}
        </div>
      </main>

      {/* Modal pour la bande-annonce */}
      {showTrailer && trailerUrl && (
        <TrailerModal 
          trailerUrl={trailerUrl}
          onClose={() => {
            setShowTrailer(false);
            setTrailerUrl(null);
          }}
        />
      )}
    </div>
  );
};

// Composant MovieSection
const MovieSection = ({ title, movies, loading, onMovieClick, onWatchTrailer, onCreateReview, isAuthenticated, onLoadMore, hasMore, loadingMore, navigate }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Film size={48} style={{ opacity: 0.5 }} />
        <p>Chargement...</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Film size={48} style={{ opacity: 0.5 }} />
        <p>Aucun film disponible.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', fontSize: '1.8rem', color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {movies.map((movie) => (
          <MovieCard 
            key={movie.id}
            movie={movie}
            onMovieClick={onMovieClick}
            onWatchTrailer={onWatchTrailer}
            onCreateReview={onCreateReview}
            isAuthenticated={isAuthenticated}
            navigate={navigate}
          />
        ))}
      </div>
      
      {/* Bouton "Voir plus" */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            style={{
              padding: '12px 30px',
              backgroundColor: loadingMore ? 'var(--bg-tertiary)' : 'var(--accent)',
              color: loadingMore ? 'var(--text-secondary)' : '#fff',
              border: loadingMore ? '1px solid var(--border)' : 'none',
              borderRadius: '8px',
              cursor: loadingMore ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '0 auto'
            }}
            onMouseOver={(e) => {
              if (!loadingMore) {
                e.target.style.backgroundColor = '#e74c3c';
              }
            }}
            onMouseOut={(e) => {
              if (!loadingMore) {
                e.target.style.backgroundColor = 'var(--accent)';
              }
            }}
          >
            {loadingMore ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid var(--border)',
                  borderTop: '2px solid var(--accent)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Chargement...
              </>
            ) : (
              <>
                Voir plus
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      )}
      
      {/* Animation CSS pour le spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Composant MovieCard
const MovieCard = ({ movie, onMovieClick, onWatchTrailer, onCreateReview, isAuthenticated, navigate }) => {
  return (
    <div 
      onClick={() => onMovieClick(movie)}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image du film */}
      <div style={{
        height: '150px',
        backgroundColor: 'var(--bg-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img
            src={getImageUrl(movie.poster_path, 'w300')}
            alt={movie.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzJhMmEyYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OTk5OSIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIHNhbnMtc2VyaWYiPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
        
        {/* Bouton de lecture */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        onClick={(e) => onWatchTrailer(movie, e)}>
          <Play size={14} color="#fff" />
        </div>
      </div>

      {/* Informations */}
      <div style={{ padding: '15px' }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          lineHeight: '1.3'
        }}>
          {movie.title}
        </h3>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px',
          fontSize: '14px',
          color: 'var(--text-secondary)'
        }}>
          {movie.release_date && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} />
              {new Date(movie.release_date).getFullYear()}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={12} color="#f39c12" />
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </div>
        </div>

        {/* Boutons d'action */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginTop: '10px'
        }}>
          {isAuthenticated ? (
          <button
            onClick={(e) => onWatchTrailer(movie, e)}
            style={{
              flex: 1,
              padding: '6px 8px',
              backgroundColor: 'var(--link-color)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px'
            }}
          >
            <Play size={10} />
            Bande-annonce
          </button>
        ) : (
          <button
            disabled
            style={{
              flex: 1,
              padding: '6px 8px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              cursor: 'not-allowed',
              fontSize: '11px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              opacity: 0.5
            }}
          >
            <Play size={10} />
            Bande-annonce
          </button>
        )}
          
          {isAuthenticated ? (
          <button
            onClick={(e) => {
              console.log('Bouton Critiques cliqué, isAuthenticated:', isAuthenticated);
              e.stopPropagation();
              // Naviguer vers la page du film
              navigate(`/movie/${encodeURIComponent(movie.title)}`);
              // Scroll vers reviews après un délai
              setTimeout(() => {
                const reviewsElement = document.getElementById('reviews');
                if (reviewsElement) {
                  reviewsElement.scrollIntoView({ behavior: 'smooth' });
                }
              }, 500);
            }}
            style={{
              flex: 1,
              padding: '6px 8px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px'
            }}
          >
            <Star size={10} />
            Critiques
          </button>
        ) : (
          <button
            disabled
            style={{
              flex: 1,
              padding: '6px 8px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              cursor: 'not-allowed',
              fontSize: '11px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              opacity: 0.5
            }}
          >
            <Star size={10} />
            Critiques
          </button>
        )}
          
          {isAuthenticated ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateReview(movie, e);
              }}
              style={{
                flex: 1,
                padding: '6px 8px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              Critiquer
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/register');
              }}
              style={{
                flex: 1,
                padding: '6px 8px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              S'inscrire
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant TrailerModal
const TrailerModal = ({ trailerUrl, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        width: '90%',
        maxWidth: '800px',
        aspectRatio: '16/9',
        backgroundColor: '#000',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1001,
            fontSize: '20px',
            fontWeight: 'bold'
          }}
        >
          ×
        </button>
        <iframe
          src={trailerUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default HomePage;
