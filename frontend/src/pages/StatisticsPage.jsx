import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, TrendingUp, Users, Film, BarChart3, Award, ArrowLeft } from 'lucide-react';

const StatisticsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://cinecritiqueprojet.onrender.com/api/reviews/stats/');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des statistiques');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const renderStars = (rating, size = 16) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={size}
        fill={index < rating ? '#F5C518' : 'none'}
        color={index < rating ? '#F5C518' : '#666'}
        style={{ marginRight: '2px' }}
      />
    ));
  };

  const renderProgressBar = (count, total, color = '#F5C518') => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          transition: 'width 0.3s ease'
        }} />
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        color: 'var(--text-secondary)'
      }}>
        <div>Chargement des statistiques...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: 'var(--error)', marginBottom: '15px' }}>Erreur</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px 40px'
    }}>
      <header style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '30px',
        borderRadius: '8px',
        marginBottom: '30px',
        textAlign: 'center',
        border: '1px solid var(--border)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--link-color)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'var(--link-hover)';
            }}
            onMouseDown={(e) => {
              e.target.style.backgroundColor = 'var(--link-hover)';
              e.target.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'var(--link-color)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </button>
        </div>
        <h1 style={{
          color: 'var(--accent)',
          fontSize: '2.5rem',
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px'
        }}>
          <BarChart3 size={40} />
          Statistiques CineCritique
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.1rem'
        }}>
          Découvrez les tendances et les moyennes de notre communauté
        </p>
      </header>

      {/* Statistiques générales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '25px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <Film size={40} style={{ color: 'var(--accent)', marginBottom: '15px' }} />
          <h3 style={{
            color: 'var(--accent)',
            fontSize: '2rem',
            margin: '0 0 10px'
          }}>
            {stats.total_reviews}
          </h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Critiques totales
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '25px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <Star size={40} style={{ color: 'var(--accent)', marginBottom: '15px' }} />
          <h3 style={{
            color: 'var(--accent)',
            fontSize: '2rem',
            margin: '0 0 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            {stats.average_rating}
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/5</span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Note moyenne globale
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '25px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <TrendingUp size={40} style={{ color: 'var(--accent)', marginBottom: '15px' }} />
          <h3 style={{
            color: 'var(--accent)',
            fontSize: '2rem',
            margin: '0 0 10px'
          }}>
            {stats.movie_statistics?.total_movies || 0}
          </h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Films analysés
          </p>
        </div>
      </div>

      {/* Distribution des notes */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '25px',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        marginBottom: '30px'
      }}>
        <h2 style={{
          color: 'var(--accent)',
          margin: '0 0 25px',
          fontSize: '1.5rem'
        }}>
          Distribution des notes
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {[
            { stars: 5, label: '5 étoiles', count: stats.rating_distribution['5_stars'] },
            { stars: 4, label: '4 étoiles', count: stats.rating_distribution['4_stars'] },
            { stars: 3, label: '3 étoiles', count: stats.rating_distribution['3_stars'] },
            { stars: 2, label: '2 étoiles', count: stats.rating_distribution['2_stars'] },
            { stars: 1, label: '1 étoile', count: stats.rating_distribution['1_star'] }
          ].map(({ stars, label, count }) => (
            <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', minWidth: '100px' }}>
                {renderStars(stars)}
                <span style={{ marginLeft: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {label}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                {renderProgressBar(count, stats.total_reviews)}
              </div>
              <div style={{
                minWidth: '50px',
                textAlign: 'right',
                color: 'var(--text-primary)',
                fontWeight: 'bold'
              }}>
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top films */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px'
      }}>
        {/* Films les plus critiqués */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '25px',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{
            color: 'var(--accent)',
            margin: '0 0 20px',
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Users size={20} />
            Films les plus critiqués
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.movie_statistics?.top_reviewed?.map((movie, index) => (
              <div key={movie.title} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '6px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--link-color)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {index + 1}
                  </div>
                  <Link
                    to={`/movie/${encodeURIComponent(movie.title)}`}
                    style={{
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    {movie.title}
                  </Link>
                </div>
                <div style={{
                  backgroundColor: 'rgba(245, 197, 24, 0.1)',
                  color: 'var(--accent)',
                  padding: '4px 12px',
                  borderRadius: '15px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {movie.review_count} critiques
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Films les mieux notés */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '25px',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{
            color: 'var(--accent)',
            margin: '0 0 20px',
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Award size={20} />
            Films les mieux notés
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.movie_statistics?.top_rated?.map((movie, index) => (
              <div key={movie.title} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '6px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--link-color)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {index + 1}
                  </div>
                  <Link
                    to={`/movie/${encodeURIComponent(movie.title)}`}
                    style={{
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    {movie.title}
                  </Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {renderStars(Math.round(movie.avg_rating), 14)}
                  <span style={{
                    color: 'var(--accent)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {movie.avg_rating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
