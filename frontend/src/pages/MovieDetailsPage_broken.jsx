import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, Calendar, Clock, User, ArrowLeft, MessageSquare } from 'lucide-react';
import { movieService, getImageUrl } from '../services/apiService';

const MovieDetailsPage = () => {
  const { movieTitle } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [movieData, setMovieData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  // Fonction pour récupérer la bande-annonce
  const fetchTrailer = async (movieId) => {
    try {
      const videos = await movieService.getMovieVideos(movieId);
      if (videos && videos.results) {
        // Trouver la bande-annonce officielle ou la première vidéo disponible
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

  const handlePlayTrailer = async () => {
    try {
      const url = await fetchTrailer(movieData.id);
      if (url) {
        setTrailerUrl(url);
        setShowTrailer(true);
      } else {
        // Si aucune bande-annonce n'est disponible, ouvrir une recherche YouTube
        const searchQuery = encodeURIComponent(`${movieData.title} bande annonce officielle`);
        window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
      }
    } catch (error) {
      console.error('Erreur lors de la lecture de la bande-annonce:', error);
      setError('Impossible de charger la bande-annonce. Veuillez réessayer plus tard.');
    }
  };

  useEffect(() => {
    const fetchMovieReviews = async () => {
      try {
        setLoading(true);
        
        // Rechercher le film via l'API TMDB
        const searchResults = await movieService.searchMovies(movieTitle, 1);
        let movieInfo = null;
        
        if (searchResults && searchResults.results && searchResults.results.length > 0) {
          // Prendre le premier résultat de recherche
          const tmdbMovie = searchResults.results[0];
          movieInfo = {
            id: tmdbMovie.id,
            title: tmdbMovie.title,
            year: tmdbMovie.release_date ? tmdbMovie.release_date.split('-')[0] : 'N/A',
            genre: "Non spécifié", // TMDB fournit genres séparément
            duration: "N/A", // TMDB fournit runtime séparément
            description: tmdbMovie.overview || "Aucune description disponible",
            image: tmdbMovie.poster_path ? getImageUrl(tmdbMovie.poster_path, 'w500') : `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(movieTitle)}`,
            vote_average: tmdbMovie.vote_average,
            release_date: tmdbMovie.release_date
          };
        } else {
          // Fallback si aucun film trouvé
          movieInfo = {
            title: movieTitle,
            year: 2024,
            genre: "Non spécifié",
            duration: "120 min",
            description: "Film non trouvé dans la base de données TMDB.",
            image: `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(movieTitle)}`,
            vote_average: 0,
            release_date: null
          };
        }
        
        setMovieData(movieInfo);

        // Récupérer les critiques du film depuis l'API
        const response = await fetch(`http://localhost:8000/api/reviews/movie/${encodeURIComponent(movieTitle)}/`);
        const data = await response.json();
        
        if (response.ok) {
          setReviews(data.reviews || []);
        } else {
          setError('Erreur lors du chargement des critiques');
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    if (movieTitle) {
      fetchMovieReviews();
    }
  }, [movieTitle]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < rating ? '#F5C518' : 'none'}
        color={index < rating ? '#F5C518' : '#666'}
        style={{ marginRight: '2px' }}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        <p>Chargement des critiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'rgba(229, 9, 20, 0.1)',
          color: 'var(--error)',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid var(--error)',
          marginBottom: '20px'
        }}>
          {error}
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--link-color)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px 40px'
    }}>
      {/* Header avec retour */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
        gap: '15px'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'var(--bg-primary)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
        >
          <ArrowLeft size={16} />
          Retour
        </button>
        <h1 style={{
          color: 'var(--accent)',
          fontSize: '2rem',
          margin: 0
        }}>
          {movieData.title}
        </h1>
      </div>

      {/* Informations du film */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Affiche du film */}
        <div>
          <img
            src={movieData.image}
            alt={movieData.title}
            style={{
              width: '100%',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}
          />
        </div>

        {/* Détails du film */}
        <div>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '25px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '15px',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={16} />
                {movieData.year}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={16} />
                {movieData.duration}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={16} fill="#F5C518" color="#F5C518" />
                {movieData.vote_average ? movieData.vote_average.toFixed(1) : 'N/A'}
              </span>
              <span>
                {movieData.genre}
              </span>
            </div>
            
            <p style={{
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              {movieData.description}
            </p>

            {isAuthenticated && (
              <Link
                to={`/create-review?movie=${encodeURIComponent(movieData.title)}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: 'var(--accent)',
                  color: '#000',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s',
                  marginRight: '10px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--accent-hover)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'var(--accent)'}
              >
                <MessageSquare size={16} />
                Rédiger une critique
              </Link>
            )}
            
            <button
              onClick={handlePlayTrailer}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'var(--link-color)',
                color: '#fff',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'var(--link-hover)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'var(--link-color)'}
            >
              <Play size={16} />
              Regarder la bande-annonce
            </button>
          </div>

          {/* Modal de la bande-annonce */}
          {showTrailer && (
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
              onClick={() => {
                setShowTrailer(false);
                setTrailerUrl(null);
              }}
            >
              <div style={{ position: 'relative', maxWidth: '800px', width: '100%' }}>
                <button
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '0',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setShowTrailer(false);
                    setTrailerUrl(null);
                  }}
                >
                  ×
                </button>
                <iframe
                  src={trailerUrl}
                  style={{
                    width: '100%',
                    height: '450px',
                    borderRadius: '8px',
                    border: 'none'
                  }}
                  allowFullScreen
                  title="Bande-annonce"
                />
              </div>
            </div>
          )}
          </div>

          {/* Statistiques des critiques */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{
              color: 'var(--text-primary)',
              margin: '0 0 15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MessageSquare size={20} />
              Critiques ({reviews.length})
            </h3>
            {reviews.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {renderStars(Math.round(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length))}
                </div>
                <span style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem'
                }}>
                  {(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)}/5
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Liste des critiques */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '25px',
        borderRadius: '8px',
        border: '1px solid var(--border)'
      }}>
        <h2 style={{
          color: 'var(--accent)',
          margin: '0 0 25px',
          fontSize: '1.5rem'
        }}>
          Critiques des utilisateurs
        </h2>

        {reviews.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--text-secondary)'
          }}>
            <MessageSquare size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
            <p style={{ marginBottom: '15px' }}>
              Aucune critique trouvée pour ce film
            </p>
            {isAuthenticated ? (
              <p>
                Soyez le premier à <Link to={`/create-review?movie=${encodeURIComponent(movieData.title)}`} style={{ color: 'var(--accent)' }}>rédiger une critique</Link> !
              </p>
            ) : (
              <p>
                <Link to="/login" style={{ color: 'var(--accent)' }}>Connectez-vous</Link> pour rédiger une critique
              </p>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '20px'
          }}>
            {reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}
              >
                {/* En-tête de la critique */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000',
                      fontWeight: 'bold'
                    }}>
                      {review.author_username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h4 style={{
                        margin: '0 0 4px',
                        color: 'var(--text-primary)',
                        fontSize: '1rem'
                      }}>
                        {review.author_username}
                      </h4>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={12} fill="#F5C518" color="#F5C518" />
                          {review.rating}
                        </span>
                        <span>
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {renderStars(review.rating)}
                  </div>
                </div>

                {/* Contenu de la critique */}
                <div style={{
                  color: 'var(--text-primary)',
                  lineHeight: '1.6'
                }}>
                  <p style={{ margin: 0 }}>
                    {review.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
