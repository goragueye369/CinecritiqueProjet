import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, ArrowLeft, Save, X } from 'lucide-react';

const CreateReviewPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, getToken } = useAuth();
  const [review, setReview] = useState({
    title: '',
    content: '',
    rating: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  // Pré-remplir le titre du film si passé dans l'URL
  useEffect(() => {
    const movieTitle = searchParams.get('movie');
    if (movieTitle) {
      setReview(prev => ({ ...prev, title: movieTitle }));
    }
  }, [searchParams]);

  const handleRatingChange = (rating) => {
    setReview(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (review.rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }
    
    if (!review.title.trim() || !review.content.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = await getToken();
      const response = await fetch('http://localhost:8000/api/reviews/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Critique créée:', data);
        navigate('/'); // Rediriger vers la page d'accueil ou la liste des critiques
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Erreur lors de la création de la critique');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ value, onChange, hovered, onHover }) => {
    return (
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={() => onHover(0)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Star
              size={32}
              fill={(star <= (hovered || value)) ? '#F5C518' : 'none'}
              color={(star <= (hovered || value)) ? '#F5C518' : '#ccc'}
              strokeWidth={2}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      minHeight: '100vh'
    }}>
      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '2rem',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = 'var(--surface)';
          e.target.style.color = 'var(--text-primary)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = 'var(--text-secondary)';
        }}
      >
        <ArrowLeft size={16} />
        Retour
      </button>

      {/* Formulaire de création */}
      <div style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          margin: '0 0 2rem 0',
          fontSize: '2rem',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          Rédiger une critique
        </h1>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            padding: '0.75rem',
            marginBottom: '1rem',
            color: '#c33',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <X size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Note */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: 'var(--text-primary)'
            }}>
              Note *
            </label>
            <StarRating
              value={review.rating}
              onChange={handleRatingChange}
              hovered={hoveredStar}
              onHover={setHoveredStar}
            />
            <div style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text-secondary)',
              marginTop: '0.5rem'
            }}>
              {review.rating === 0 
                ? 'Cliquez sur les étoiles pour noter' 
                : `Votre note : ${review.rating}/5`
              }
            </div>
          </div>

          {/* Titre du film */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: 'var(--text-primary)'
            }}>
              Titre du film *
            </label>
            <input
              type="text"
              value={review.title}
              onChange={(e) => setReview(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Entrez le titre du film"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text-primary)',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
              }}
            />
          </div>

          {/* Contenu de la critique */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: 'var(--text-primary)'
            }}>
              Votre critique *
            </label>
            <textarea
              value={review.content}
              onChange={(e) => setReview(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Rédigez votre critique..."
              rows={8}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text-primary)',
                resize: 'vertical',
                fontFamily: 'inherit',
                lineHeight: '1.5',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
              }}
            />
            <div style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text-secondary)',
              marginTop: '0.25rem',
              textAlign: 'right'
            }}>
              {review.content.length} caractères
            </div>
          </div>

          {/* Boutons d'action */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '2rem'
          }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'var(--surface)';
                  e.target.style.color = 'var(--text-primary)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-secondary)';
              }}
            >
              Annuler
            </button>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#ccc' : 'var(--link-color)',
                color: loading ? '#666' : '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'var(--link-hover)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = loading ? '#ccc' : 'var(--link-color)';
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #666',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Publication...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Publier la critique
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Animation CSS pour le spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CreateReviewPage;
