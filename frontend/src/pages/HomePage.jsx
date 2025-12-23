import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, Play, Calendar, Clock } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  // Films fictifs pour démonstration
  const movies = [
    {
      id: 1,
      title: "Inception",
      year: 2010,
      genre: "Science Fiction",
      duration: "148 min",
      rating: 4.5,
      description: "Un voleur qui entre dans les rêves des gens pour voler leurs secrets.",
      image: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Inception"
    },
    {
      id: 2,
      title: "The Dark Knight",
      year: 2008,
      genre: "Action",
      duration: "152 min",
      rating: 4.8,
      description: "Batman affronte le Joker dans une bataille épic pour Gotham City.",
      image: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Dark+Knight"
    }
  ];

  const handleMovieClick = (movie) => {
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
                      src={movie.image} 
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
                      {movie.rating}
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
                        {movie.year}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        {movie.duration}
                      </span>
                    </div>
                    
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      margin: '0 0 15px',
                      lineHeight: '1.4'
                    }}>
                      {movie.description}
                    </p>
                    
                    <div style={{
                      backgroundColor: 'var(--accent)',
                      color: '#000',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.2s'
                    }}>
                      Rédiger une critique
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                      src={movie.image} 
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
                      {movie.rating}
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
                        {movie.year}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        {movie.duration}
                      </span>
                    </div>
                    
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      margin: '0 0 15px',
                      lineHeight: '1.4'
                    }}>
                      {movie.description}
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
                  backgroundColor: 'var(--accent)',
                  color: '#000',
                  borderRadius: '4px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'background-color 0.2s',
                  marginRight: '10px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--accent-hover)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'var(--accent)'}
              >
                Connexion
              </Link>
              <Link 
                to="/register" 
                style={{
                  padding: '12px 30px',
                  backgroundColor: 'transparent',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)',
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