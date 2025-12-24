import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config/constants';
import { Star, Film, Calendar, Edit, Trash2, ArrowLeft } from 'lucide-react';

const MyReviewsPage = () => {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = await getToken();
        console.log('Token récupéré:', token ? 'OK' : 'NULL');
        
        const response = await fetch(`${API_URL}/reviews/my-reviews/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          console.error('Erreur API:', response.status, response.statusText);
          setError('Erreur lors de la récupération de vos critiques');
        }
      } catch (err) {
        console.error('Erreur fetchReviews:', err);
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [getToken]);

  const handleEdit = (reviewId) => {
    navigate(`/edit-review/${reviewId}`);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette critique ?')) {
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/reviews/${reviewId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setReviews(reviews.filter(review => review.id !== reviewId));
      } else {
        setError('Erreur lors de la suppression de la critique');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? '#F5C518' : 'none'}
            color={star <= rating ? '#F5C518' : '#666'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px 40px',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        <p>Chargement de vos critiques...</p>
      </div>
    );
  }

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
        border: '1px solid var(--border)',
        position: 'relative'
      }}>
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            left: '30px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '8px 16px',
            backgroundColor: 'var(--link-color)',
            color: '#fff',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} />
          Retour
        </button>
        
        <h1 style={{ 
          color: 'var(--accent)',
          fontSize: '2.5rem',
          marginBottom: '15px'
        }}>
          Mes Critiques
        </h1>
        <p style={{ 
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          Consultez et gérez toutes vos critiques de films
        </p>
      </header>

      {error && (
        <div style={{
          backgroundColor: 'var(--error)',
          color: '#fff',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '60px 30px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid var(--border)'
        }}>
          <Film size={64} color="var(--accent)" style={{ marginBottom: '20px' }} />
          <h2 style={{
            color: 'var(--text-primary)',
            fontSize: '1.5rem',
            marginBottom: '15px'
          }}>
            Vous n'avez pas encore de critique
          </h2>
          <p style={{ 
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            marginBottom: '25px'
          }}>
            Commencez à rédiger votre première critique depuis la page d'accueil !
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 30px',
              backgroundColor: 'var(--link-color)',
              color: '#fff',
              borderRadius: '4px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Découvrir les films
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: '25px'
        }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '25px',
                border: '1px solid var(--border)',
                position: 'relative'
              }}
            >
              {/* En-tête de la critique */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    color: 'var(--text-primary)',
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                  }}>
                    {review.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} />
                      {new Date(review.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '10px'
                }}>
                  <button
                    onClick={() => handleEdit(review.id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'var(--link-color)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <Edit size={14} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'var(--error)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              </div>

              {/* Contenu de la critique */}
              <div style={{
                color: 'var(--text-primary)',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                {review.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;
