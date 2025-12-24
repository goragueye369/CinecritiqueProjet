import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiArrowLeft, FiClock, FiCalendar, FiStar, FiPlay, FiX } from 'react-icons/fi';
import { movieService } from '../../services/apiService';
import { getImageUrl } from '../../services/apiService';

// Fonction pour gérer les erreurs de chargement d'image
const addDefaultImg = (e) => {
  e.target.onerror = null;
  // Remplacer par un placeholder SVG inline
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzJhMmEyYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OTk5OSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsIHNhbnMtc2VyaWYiPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  // Fonction pour récupérer la bande-annonce
  const fetchTrailer = async (movieId) => {
    try {
      const videos = await movieService.getMovieVideos(movieId);
      if (videos && videos.results) {
        // Trouver la bande-annonce officielle ou la première vidéo disponible
        const trailer = videos.results.find(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        ) || videos.results[0];
        
        if (trailer) {
          return `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
        }
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la bande-annonce:', error);
      return null;
    }
  };

  const handlePlayTrailer = async () => {
    try {
      setLoading(true);
      const url = await fetchTrailer(id);
      if (url) {
        setTrailerUrl(url);
        setShowTrailer(true);
      } else {
        // Si aucune bande-annonce n'est disponible, ouvrir une recherche YouTube
        const searchQuery = encodeURIComponent(`${movie.title} bande annonce officielle`);
        window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger la bande-annonce. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Récupération des détails du film avec l'ID: ${id}`);
        
        // Récupérer les détails du film depuis l'API
        const [movieData, videosData] = await Promise.all([
          movieService.getMovieDetails(id),
          movieService.getMovieVideos(id)
        ]);
        
        if (!isMounted) return;
        
        if (!movieData) {
          throw new Error('Film non trouvé');
        }

        console.log('Détails du film récupérés:', movieData);
        
        // Mettre à jour l'état avec les données du film
        setMovie(movieData);
        
        // Si les crédits sont déjà inclus dans la réponse (avec append_to_response)
        if (movieData.credits?.cast) {
          const topCast = movieData.credits.cast.slice(0, 10).map(actor => ({
            id: actor.id,
            name: actor.name,
            character: actor.character,
            profile_path: actor.profile_path,
            known_for_department: actor.known_for_department
          }));
          setCast(topCast);
        } else {
          // Sinon, faire un appel séparé pour les crédits
          const creditsData = await movieService.getMovieCredits(id);
          if (isMounted && creditsData?.cast) {
            const topCast = creditsData.cast.slice(0, 10).map(actor => ({
              id: actor.id,
              name: actor.name,
              character: actor.character,
              profile_path: actor.profile_path,
              known_for_department: actor.known_for_department
            }));
            setCast(topCast);
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement des détails du film:', err);
        if (isMounted) {
          setError(`Impossible de charger les détails du film. ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchMovieDetails();
    } else {
      setError('Aucun identifiant de film fourni');
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-imdb-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-imdb-yellow mx-auto"></div>
          <p className="mt-4 text-imdb-text-secondary">Chargement des détails du film...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-imdb-black flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-imdb-text-primary mb-2">Oups !</h2>
          <p className="text-imdb-text-secondary mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-imdb-yellow hover:bg-yellow-600 text-imdb-black font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-imdb-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-imdb-text-primary mb-2">Film non trouvé</h2>
          <p className="text-imdb-text-secondary">Le film demandé n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-imdb-yellow hover:bg-yellow-600 text-imdb-black font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-imdb-black text-imdb-text-primary">
      {/* En-tête avec image de fond */}
      <div 
        className="relative h-96 bg-cover bg-center pt-16"
        style={{
          backgroundImage: movie.backdrop_path || movie.poster_path 
            ? `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${getImageUrl(movie.backdrop_path || movie.poster_path, 'original')})`
            : 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9))',
          marginTop: '-4rem',
          paddingTop: '6rem'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-imdb-black to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col">
          {/* Boutons de navigation */}
          <div className="absolute top-6 left-4 md:left-8 flex space-x-4 items-center">
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center justify-center w-10 h-10 rounded-full bg-imdb-yellow/90 hover:bg-imdb-yellow text-imdb-black transition-all duration-200 transform hover:scale-110 shadow-lg"
              title="Retour"
            >
              <FiArrowLeft className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-imdb-text-secondary hover:text-imdb-yellow transition-colors bg-imdb-dark-gray/80 hover:bg-imdb-dark-gray px-4 py-2 rounded-full"
            >
              Accueil
            </button>
          </div>
          
          {/* Contenu du film */}
          <div className="mt-auto mb-12 flex flex-col md:flex-row items-start">
            {/* Affiche du film */}
            <div className="w-48 h-72 md:w-64 md:h-96 rounded-lg overflow-hidden shadow-lg flex-shrink-0 mb-6 md:mb-0 md:mr-8 bg-imdb-dark-gray flex items-center justify-center">
              {movie.poster_path ? (
                <img 
                  src={getImageUrl(movie.poster_path, 'w500')} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                  onError={addDefaultImg}
                />
              ) : (
                <div className="text-center text-imdb-text-secondary">
                  <FiX className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Image non disponible</p>
                </div>
              )}
            </div>
            
            {/* Détails du film */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center text-sm text-imdb-text-secondary mb-4">
                <span className="flex items-center mr-4 mb-2">
                  <FiCalendar className="mr-1 text-imdb-yellow" />
                  {new Date(movie.release_date).getFullYear()}
                </span>
                {movie.runtime > 0 && (
                  <span className="flex items-center mr-4 mb-2">
                    <FiClock className="mr-1 text-imdb-yellow" />
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                  </span>
                )}
                <div className="flex items-center bg-imdb-dark-gray/50 px-2 py-1 rounded-full text-xs">
                  <FiStar className="text-imdb-yellow mr-1" />
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres && movie.genres.map(genre => (
                  <span key={genre.id} className="px-3 py-1 bg-imdb-dark-gray rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <h3 className="text-xl font-semibold mb-2 mt-6">Synopsis</h3>
              <p className="text-imdb-text-secondary mb-6">
                {movie.overview || 'Aucune description disponible.'}
              </p>
              
              <div className="flex space-x-4">
                <button 
                  onClick={handlePlayTrailer}
                  disabled={loading}
                  className="bg-imdb-yellow hover:bg-yellow-600 text-imdb-black font-bold py-2 px-6 rounded-full flex items-center transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <FiPlay className="mr-2 animate-pulse" /> Chargement...
                    </>
                  ) : (
                    <>
                      <FiPlay className="mr-2" /> Regarder la bande-annonce
                    </>
                  )}
                </button>
                <button className="bg-imdb-dark-gray hover:bg-imdb-light-gray/20 text-imdb-text-primary font-bold py-2 px-6 rounded-full border border-imdb-light-gray/30 transition-colors">
                  + Ma liste
                </button>
              </div>
              
              {/* Modal de la bande-annonce */}
              {showTrailer && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setShowTrailer(false)}>
                  <div className="relative w-full max-w-4xl">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTrailer(false);
                        setTrailerUrl(null);
                      }}
                      className="absolute -top-12 right-0 text-white hover:text-imdb-yellow transition-colors"
                      aria-label="Fermer"
                    >
                      <FiX size={32} />
                    </button>
                    <div className="aspect-w-16 aspect-h-9 w-full">
                      <iframe
                        src={trailerUrl}
                        className="w-full h-[70vh]"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Bande-annonce"
                      ></iframe>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Distribution des acteurs */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Distribution des rôles</h2>
        
        {cast.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {cast.map(actor => (
              <div key={actor.id} className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 bg-imdb-dark-gray flex items-center justify-center">
                  {actor.profile_path ? (
                    <img 
                      src={getImageUrl(actor.profile_path, 'w185')} 
                      alt={actor.name}
                      className="w-full h-full object-cover"
                      onError={addDefaultImg}
                    />
                  ) : (
                    <div className="text-center text-imdb-text-secondary">
                      <FiX className="w-6 h-6 mx-auto opacity-50" />
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-sm">{actor.name}</h4>
                <p className="text-xs text-imdb-text-secondary">{actor.character}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-imdb-text-secondary">Aucune information sur la distribution n'est disponible.</p>
        )}
      </div>
      
      {/* Recommandations de films similaires */}
      <div className="container mx-auto px-4 py-8 border-t border-imdb-light-gray/10">
        <h2 className="text-2xl font-bold mb-6">Recommandations</h2>
        <p className="text-imdb-text-secondary">Les recommandations seront bientôt disponibles.</p>
      </div>
    </div>
  );
};

export default MovieDetails;