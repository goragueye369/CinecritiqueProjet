import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/constants';
import { ArrowLeft, Lock } from 'lucide-react';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.new_password !== formData.confirm_password) {
      setError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    if (formData.new_password.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_URL}/profile/change-password/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: formData.current_password,
          new_password: formData.new_password,
        })
      });

      if (response.ok) {
        setSuccess('Mot de passe modifié avec succès !');
        setFormData({ current_password: '', new_password: '', confirm_password: '' });
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        const data = await response.json();
        setError(data.detail || data.error || 'Erreur lors du changement de mot de passe.');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>
      <button
        onClick={() => navigate('/profile')}
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
          marginBottom: '1.5rem'
        }}
      >
        <ArrowLeft size={16} />
        Retour au profil
      </button>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Lock size={40} color="var(--accent)" style={{ marginBottom: '1rem' }} />
        <h1 style={{ color: 'var(--text-primary)', fontSize: '1.8rem' }}>
          Changer le mot de passe
        </h1>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'rgba(229,9,20,0.1)',
          color: 'var(--error)',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid var(--error)'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: 'rgba(0,200,100,0.1)',
          color: '#00c864',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #00c864'
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {[
          { name: 'current_password', label: 'Mot de passe actuel' },
          { name: 'new_password', label: 'Nouveau mot de passe' },
          { name: 'confirm_password', label: 'Confirmer le nouveau mot de passe' },
        ].map(({ name, label }) => (
          <div key={name} style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              {label}
            </label>
            <input
              type="password"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: loading ? '#ccc' : 'var(--link-color)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
            marginTop: '0.5rem'
          }}
        >
          {loading ? 'Enregistrement...' : 'Changer le mot de passe'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
