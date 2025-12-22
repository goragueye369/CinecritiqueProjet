import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: 'Utilisateur',
    bio: '',
    avatar: null,
    preview: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Simuler le chargement du profil utilisateur
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        // Ici, vous récupéreriez les données du profil depuis votre API
        // const response = await fetch('/api/profile');
        // const data = await response.json();
        // setProfile(prev => ({ ...prev, ...data }));
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        setError('Erreur lors du chargement du profil');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          avatar: file,
          preview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Ici, vous enverriez les données mises à jour à votre API
      // const formData = new FormData();
      // formData.append('username', profile.username);
      // formData.append('bio', profile.bio);
      // if (profile.avatar) {
      //   formData.append('avatar', profile.avatar);
      // }
      // await fetch('/api/profile', { method: 'POST', body: formData });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      // Rafraîchir les données du profil
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !isEditing) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
        color: 'var(--text-primary)'
      }}>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
    }}>
      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <Link to="/" style={{ 
          color: 'var(--accent)',
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          Retour à l'accueil
        </Link>
      </div>

      <h1 style={{ 
        color: 'var(--text-primary)',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        Mon Profil
      </h1>

      {error && (
        <div style={{
          backgroundColor: 'var(--error)',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          overflow: 'hidden',
          marginBottom: '1rem',
          border: '3px solid var(--accent)',
          position: 'relative'
        }}>
          <img 
            src={profile.preview || 'https://via.placeholder.com/150'} 
            alt="Profil"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {isEditing && (
            <label style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              textAlign: 'center',
              padding: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}>
              Changer
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              Pseudo
            </label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              Biographie
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem'
          }}>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--accent)',
                border: 'none',
                color: 'black',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div style={{ 
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              color: 'var(--accent)',
              marginBottom: '0.5rem',
              fontSize: '2rem'
            }}>
              {profile.username}
            </h2>
            <p style={{ 
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              fontSize: '1.1rem'
            }}>
              {profile.bio || 'Aucune biographie pour le moment.'}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--accent)',
                border: 'none',
                color: 'black',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                marginRight: '1rem'
              }}
            >
              Modifier le profil
            </button>
            <Link to="/change-password" style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'inline-block',
              fontWeight: '500',
              fontSize: '1rem'
            }}>
              Changer le mot de passe
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
