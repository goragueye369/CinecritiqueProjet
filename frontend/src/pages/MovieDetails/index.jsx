import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiArrowLeft, FiClock, FiCalendar, FiStar, FiPlay } from 'react-icons/fi';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Fonction pour gérer les erreurs de chargement d'image
const addDefaultImg = (e) => {
  e.target.onerror = null;
  e.target.src = 'https://via.placeholder.com/300x450?text=Photo+non+disponible';
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        
        // Données de démonstration
        const demoMovie = {
          id: id,
          title: 'Inception',
          overview: 'Dom Cobb est un voleur expérimenté dans l\'art périlleux de l\'extraction : sa spécialité consiste à s\'approprier les secrets les plus précieux d\'un individu, enfouis au plus profond de son subconscient, pendant qu\'il rêve.',
          release_date: '2010-07-15',
          runtime: 148,
          vote_average: 8.4,
          poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
          backdrop_path: '/8riWcADI1kEiGu4Y4Pr6Lxkv710.jpg',
          genres: [
            { id: 1, name: 'Science-Fiction' },
            { id: 2, name: 'Action' },
            { id: 3, name: 'Thriller' }
          ]
        };

        const demoCast = [
          {
            id: 1,
            name: 'Leonardo DiCaprio',
            character: 'Dom Cobb',
            profile_path: '/jToSMocaCSPzHC7E4ig5JFiYvGz.jpg',
            known_for_department: 'Acting'
          },
          {
            id: 2,
            name: 'Joseph Gordon-Levitt',
            character: 'Arthur',
            profile_path: '/3Bq4kwd6GFb4Xz5R4J4R6hFOjLc.jpg',
            known_for_department: 'Acting'
          },
          {
            id: 3,
            name: 'Ellen Page',
            character: 'Ariadne',
            profile_path: '/vDurbnzZ4vBNDThdN9gHhJqKTFJ.jpg',
            known_for_department: 'Acting'
          },
          {
            id: 4,
            name: 'Tom Hardy',
            character: 'Eames',
            profile_path: '/sGMA6pA2d604nObJqfaaR0vpbgD.jpg'
          },
          {
            id: 5,
            name: 'Ken Watanabe',
            character: 'Saito',
            profile_path: '/6gZW4U6kNS0XbG6fc3BmGcnwcAw.jpg'
          }
        ];

        // Essayer d'abord l'API
        try {
          const [movieResponse, creditsResponse] = await Promise.all([
            fetch(`http://localhost:3000/api/movies/${id}`).then(res => {
              if (!res.ok) throw new Error('API non disponible');
              return res.json();
            }),
            fetch(`http://localhost:3000/api/movies/${id}/credits`).then(res => {
              if (!res.ok) throw new Error('API non disponible');
              return res.json();
            })
          ]);
          
          setMovie(movieResponse);
          setCast(creditsResponse.cast.slice(0, 10));
        } catch (apiError) {
          // Si l'API échoue, utiliser les données de démonstration
          console.warn('Utilisation des données de démonstration :', apiError.message);
          setMovie(demoMovie);
          setCast(demoCast);
        }
      } catch (err) {
        setError('Impossible de charger les détails du film. ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-yellow"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="text-accent-yellow hover:underline"
          >
            Retour à la page précédente
          </button>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const duration = movie.runtime ? `${Math.floor(movie.runtime / 60)}h${movie.runtime % 60}` : '';

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      {/* En-tête avec bouton retour */}
      <header className="bg-dark-surface/80 backdrop-blur-sm fixed w-full z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-text-secondary hover:text-accent-yellow transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Retour
          </button>
        </div>
      </header>

      {/* Bannière du film */}
      <div className="relative pt-16 pb-8 md:pb-16">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Affiche du film */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster image-loading"
                  onError={addDefaultImg}
                  loading="lazy"
                />
              </div>
              
              <div className="mt-4 flex justify-center">
                <button className="flex items-center justify-center bg-accent-yellow text-dark-bg font-bold py-3 px-6 rounded-full hover:bg-yellow-500 transition-colors">
                  <FiPlay className="mr-2" />
                  Regarder la bande-annonce
                </button>
              </div>
            </div>

            {/* Détails du film */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">
                {movie.title} 
                {releaseYear && <span className="font-normal text-text-secondary ml-2">({releaseYear})</span>}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-text-secondary mb-6">
                {movie.release_date && (
                  <div className="flex items-center">
                    <FiCalendar className="mr-1" />
                    {new Date(movie.release_date).toLocaleDateString('fr-FR')}
                  </div>
                )}
                
                {duration && (
                  <div className="flex items-center">
                    <FiClock className="mr-1" />
                    {duration}
                  </div>
                )}
                
                <div className="flex items-center">
                  <FiStar className="text-accent-yellow mr-1" />
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
                </div>
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map(genre => (
                    <span 
                      key={genre.id}
                      className="bg-dark-surface-light px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
                <p className="text-text-secondary leading-relaxed">
                  {movie.overview || 'Aucun synopsis disponible.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Casting */}
      {cast.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Casting</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {cast.map(person => (
              <div key={person.id} className="text-center">
                <div className="bg-dark-surface-light rounded-lg overflow-hidden mb-2 h-48 flex items-center justify-center">
                  {person.profile_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}${person.profile_path}`}
                      alt={person.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/200x300?text=Photo+non+disponible';
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-dark-surface/50 flex items-center justify-center">
                      <span className="text-text-secondary">Pas de photo</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-sm">{person.name}</h3>
                  <p className="text-xs text-text-secondary">{person.character}</p>
                  {person.known_for_department && (
                    <p className="text-xs text-accent-yellow mt-1">{person.known_for_department}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pied de page */}
      <footer className="bg-dark-surface border-t border-border-dark py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-text-secondary text-sm">
          <p>© {new Date().getFullYear()} CineCritique - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
};

export default MovieDetails;
