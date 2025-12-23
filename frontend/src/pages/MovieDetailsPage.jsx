import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, Calendar, Clock, User, ArrowLeft, MessageSquare } from 'lucide-react';

const MovieDetailsPage = () => {
  const { movieTitle } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [movieData, setMovieData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Films fictifs pour démonstration
  const moviesDatabase = {
    "Inception": {
      title: "Inception",
      year: 2010,
      genre: "Science Fiction",
      duration: "148 min",
      description: "Un voleur qui entre dans les rêves des gens pour voler leurs secrets.",
      image: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Inception"
    },
    "The Dark Knight": {
      title: "The Dark Knight",
      year: 2008,
      genre: "Action",
      duration: "152 min",
      description: "Batman affronte le Joker dans une bataille épic pour Gotham City.",
      image: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Dark+Knight"
    }
  };

  useEffect(() => {
    const fetchMovieReviews = async () => {
      try {
        setLoading(true);
        
        // Récupérer les informations du film
        const movieInfo = moviesDatabase[movieTitle] || {
          title: movieTitle,
          year: 2024,
          genre: "Non spécifié",
          duration: "120 min",
          description: "Film en cours d'analyse...",
          image: `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(movieTitle)}`
        };
        
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
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--accent-hover)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'var(--accent)'}
              >
                Rédiger une critique
              </Link>
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
      </div>

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
                      <p style={{
                        margin: 0,
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem'
                      }}>
                        {formatDate(review.created_at)}
                      </p>
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
