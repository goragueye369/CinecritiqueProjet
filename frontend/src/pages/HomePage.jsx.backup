import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, Play, Calendar, Clock, Film } from 'lucide-react';
import { movieService, getImageUrl } from '../services/apiService';

const HomePage = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  const fetchMovies = async (page = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else if (page === 1) {
        setMoviesLoading(true);
      }

      const data = await movieService.getPopularMovies(page);
      
      if (data && data.results) {
        if (isLoadMore) {
          setMovies(prevMovies => [...prevMovies, ...data.results]);
        } else {
          setMovies(data.results);
        }
        
        // Vérifier s'il y a plus de pages (TMDB a généralement ~500 pages de films populaires)
        setHasMore(page < data.total_pages && page < 50); // Limiter à 50 pages pour éviter trop de requêtes
        setCurrentPage(page);
        setError('');
      } else {
        if (!isLoadMore) {
          setError('Aucun film trouvé');
        }
        setHasMore(false);
      }
    } catch (err) {
      console.error('Erreur:', err);
      if (!isLoadMore) {
        setError('Erreur de connexion au service de films');
      }
      setHasMore(false);
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setMoviesLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchMovies(1, false);
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      const nextPage = currentPage + 1;
      fetchMovies(nextPage, true);
    }
  };

  const handleMovieClick = (movie) => {
    // Rediriger vers la page de détails du film
    navigate(`/movie/${encodeURIComponent(movie.title)}`);
  };

  const handleCreateReview = (movie) => {
    // Rediriger vers la page de création de critique avec le film pré-rempli
    navigate(`/create-review?movie=${encodeURIComponent(movie.title)}`);
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px 40px',
    }}>
      <header style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '30px',
        borderRadius: '8px',
        marginBottom: '40px',
        textAlign: 'center',
        border: '1px solid var(--border)'
      }}>
        <h1 style={{ 
          color: 'var(--accent)',
          fontSize: '2.5rem',
          marginBottom: '15px'
        }}>
          Bienvenue sur CineCritique
        </h1>
        <p style={{ 
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          Découvrez et partagez vos films préférés. Rejoignez notre communauté de cinéphiles.
        </p>
      </header>

      {/* État de chargement */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-secondary)'
        }}>
          <p>Chargement...</p>
        </div>
      ) : isAuthenticated ? (
        <>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '25px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            marginBottom: '30px'
          }}>
            <h2 style={{ 
              color: 'var(--accent)',
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--border)'
            }}>
              Bienvenue, {user?.username || 'utilisateur'} !
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
              Cliquez sur un film ci-dessous pour rédiger votre critique :
            </p>
          </div>

          {/* Films disponibles */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '25px',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <h2 style={{ 
              color: 'var(--accent)',
              marginBottom: '25px',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--border)'
            }}>
              Films à découvrir
            </h2>
            
            {/* État de chargement des films */}
            {moviesLoading ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: 'var(--text-secondary)'
              }}>
                <Film size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                <p>Chargement des films...</p>
              </div>
            ) : error ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: 'var(--error)'
              }}>
                <p>{error}</p>
              </div>
            ) : movies.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: 'var(--text-secondary)'
              }}>
                <Film size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                <p>Aucun film disponible pour le moment.</p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '25px'
              }}>
                {movies.map((movie) => (
                  <div 
                    key={movie.id}
                    onClick={() => handleMovieClick(movie)}
                    style={{
                      backgroundColor: 'var(--bg-primary)', 
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
                      height: '200px',
                      backgroundColor: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={getImageUrl(movie.poster_path, 'w500')} 
                        alt={movie.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {/* Badge de notation */}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: '#F5C518',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        <Star size={14} fill="#F5C518" />
                        {movie.vote_average?.toFixed(1)}
                      </div>
                      {/* Bouton play */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(245, 197, 24, 0.9)',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Play size={20} fill="#000" color="#000" />
                      </div>
                    </div>
                    
                    {/* Informations du film */}
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ 
                        margin: '0 0 10px', 
                        color: 'var(--text-primary)',
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                      }}>
                        {movie.title}
                      </h3>
                      
                      <div style={{
                        display: 'flex',
                        gap: '15px',
                        marginBottom: '10px',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} />
                          {movie.release_date?.split('-')[0] || 'N/A'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={14} />
                          {movie.vote_average?.toFixed(1)}
                        </span>
                      </div>
                      
                      <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        margin: '0 0 15px',
                        lineHeight: '1.4'
                      }}>
                        {movie.overview?.slice(0, 150)}{movie.overview?.length > 150 ? '...' : ''}
                      </p>
                      
                      <div style={{
                        display: 'flex',
                        gap: '10px'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMovieClick(movie);
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: 'var(--bg-primary)',
                            color: 'var(--accent)',
                            border: '1px solid var(--accent)',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = 'rgba(245, 197, 24, 0.1)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'var(--bg-primary)';
                          }}
                        >
                          Voir les critiques
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateReview(movie);
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: 'var(--link-color)',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = 'var(--link-hover)'}
                          onMouseOut={(e) => e.target.style.backgroundColor = 'var(--link-color)'}
                        >
                          Rédiger
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </> 
      ) : (
        <>
          {/* Films disponibles pour les non-connectés */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '25px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            marginBottom: '30px'
          }}>
            <h2 style={{ 
              color: 'var(--accent)',
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--border)'
            }}>
              Films à découvrir
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
              Connectez-vous pour rédiger des critiques sur ces films :
            </p>
            
            {/* État de chargement des films pour non-connectés */}
            {moviesLoading ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: 'var(--text-secondary)'
              }}>
                <Film size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                <p>Chargement des films...</p>
              </div>
            ) : error ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: 'var(--error)'
              }}>
                <p>{error}</p>
              </div>
            ) : movies.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: 'var(--text-secondary)'
              }}>
                <Film size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                <p>Aucun film disponible pour le moment.</p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '25px'
              }}>
                {movies.map((movie) => (
                  <div 
                    key={movie.id}
                    style={{
                      backgroundColor: 'var(--bg-primary)', 
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid var(--border)',
                      position: 'relative'
                    }}
                  >
                    {/* Image du film */}
                    <div style={{
                      height: '200px',
                      backgroundColor: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={getImageUrl(movie.poster_path, 'w500')} 
                        alt={movie.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {/* Badge de notation */}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: '#F5C518',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        <Star size={14} fill="#F5C518" />
                        {movie.vote_average?.toFixed(1)}
                      </div>
                    </div>
                    
                    {/* Informations du film */}
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ 
                        margin: '0 0 10px', 
                        color: 'var(--text-primary)',
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                      }}>
                        {movie.title}
                      </h3>
                      
                      <div style={{
                        display: 'flex',
                        gap: '15px',
                        marginBottom: '10px',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} />
                          {movie.release_date?.split('-')[0] || 'N/A'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={14} />
                          {movie.vote_average?.toFixed(1)}
                        </span>
                      </div>
                      
                      <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        margin: '0 0 15px',
                        lineHeight: '1.4'
                      }}>
                        {movie.overview?.slice(0, 150)}{movie.overview?.length > 150 ? '...' : ''}
                      </p>
                      
                      <div style={{
                        backgroundColor: 'var(--accent)',
                        color: '#000',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        Connectez-vous pour critiquer
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '25px',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <h2 style={{ 
              color: 'var(--text-primary)',
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--border)'
            }}>
              Rejoignez la communauté
            </h2>
            <div style={{ 
              textAlign: 'center',
              padding: '40px 0'
            }}>
              <p style={{ 
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                marginBottom: '20px'
              }}>
                Découvrez les dernières critiques de films et partagez vos avis avec la communauté.
              </p>
              <Link 
                to="/login" 
                style={{
                  padding: '12px 30px',
                  backgroundColor: 'var(--link-color)',
                  color: '#fff',
                  borderRadius: '4px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'background-color 0.2s',
                  marginRight: '10px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--link-hover)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'var(--link-color)'}
              >
                Connexion
              </Link>
              <Link 
                to="/register" 
                style={{
                  padding: '12px 30px',
                  backgroundColor: 'transparent',
                  color: 'var(--link-color)',
                  border: '1px solid var(--link-color)',
                  borderRadius: '4px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'rgba(245, 197, 24, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Inscription
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;