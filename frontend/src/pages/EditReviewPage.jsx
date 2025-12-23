import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config/constants';
import { Star, ArrowLeft, Save } from 'lucide-react';

const EditReviewPage = () => {
  const { reviewId } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 0
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/reviews/${reviewId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const review = await response.json();
          setFormData({
            title: review.title,
            content: review.content,
            rating: review.rating
          });
        } else {
          setError('Critique non trouvée ou accès non autorisé');
        }
      } catch (err) {
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [reviewId, getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/reviews/${reviewId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/my-reviews');
      } else {
        setError('Erreur lors de la mise à jour de la critique');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <p>Chargement de la critique...</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      {/* En-tête */}
      <header style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '30px',
        borderRadius: '8px',
        marginBottom: '40px',
        textAlign: 'center',
        border: '1px solid var(--border)',
        position: 'relative'
      }}>
        <button
          onClick={() => navigate('/my-reviews')}
          style={{
            position: 'absolute',
            left: '30px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '8px 16px',
            backgroundColor: 'var(--accent)',
            color: '#000',
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
          Modifier la critique
        </h1>
        <p style={{ 
          color: 'var(--text-secondary)',
          fontSize: '1.1rem'
        }}>
          Mettez à jour votre critique
        </p>
      </header>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '40px',
        borderRadius: '8px',
        border: '1px solid var(--border)'
      }}>
        {error && (
          <div style={{
            backgroundColor: 'var(--error)',
            color: '#fff',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Film */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'var(--text-primary)',
            fontWeight: '600'
          }}>
            Film
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}
            required
          />
        </div>

        {/* Note */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'var(--text-primary)',
            fontWeight: '600'
          }}>
            Note
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                <Star
                  size={32}
                  fill={star <= formData.rating ? '#F5C518' : 'none'}
                  color={star <= formData.rating ? '#F5C518' : '#666'}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Critique */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'var(--text-primary)',
            fontWeight: '600'
          }}>
            Votre critique
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '12px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            placeholder="Rédigez votre critique..."
            required
          />
        </div>

        {/* Boutons */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={() => navigate('/my-reviews')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--accent)',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: submitting ? 0.7 : 1
            }}
          >
            <Save size={16} />
            {submitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReviewPage;
