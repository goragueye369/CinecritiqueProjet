import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password2: formData.confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Inscription réussie
        console.log('Inscription réussie:', data);
        navigate('/login');
      } else {
        // Erreur du backend
        setError(data.detail || "Une erreur est survenue lors de l'inscription");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription");
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '50px auto',
      padding: '30px',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          color: 'var(--accent)',
          marginBottom: '10px',
          fontSize: '2.2rem'
        }}>Créer un compte</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Rejoignez la communauté CineCritique</p>
      </div>
      
      {error && (
        <div style={{ 
          backgroundColor: 'rgba(229, 9, 20, 0.1)',
          color: 'var(--error)',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid var(--error)'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              padding: '12px 15px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: '12px 15px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            style={{
              padding: '12px 15px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{
              padding: '12px 15px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '20px',
            backgroundColor: loading ? '#ccc' : 'var(--link-color)',
            color: loading ? '#666' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => !loading && (e.target.style.backgroundColor = 'var(--link-hover)')}
          onMouseOut={(e) => !loading && (e.target.style.backgroundColor = 'var(--link-color)')}
        >
          {loading ? 'Inscription en cours...' : "S'inscrire"}
        </button>
      </form>

      <div style={{ 
        textAlign: 'center', 
        paddingTop: '20px',
        borderTop: '1px solid var(--border)'
      }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ 
            color: 'var(--accent)',
            fontWeight: '500'
          }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;