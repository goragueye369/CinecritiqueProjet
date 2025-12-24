import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const MovieCard = ({ movie, imageUrl }) => {
  // Fonction pour afficher les étoiles de notation
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.min(Math.floor(rating / 2), 5); // S'assurer de ne pas dépasser 5 étoiles
    const hasHalfStar = rating % 2 >= 0.5 && fullStars < 5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-imdb-yellow" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-imdb-yellow" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-imdb-yellow" />);
      }
    }
    
    return stars;
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <div className="movie-card bg-imdb-dark-gray rounded-lg overflow-hidden shadow-movie-card transition-all duration-300 hover:shadow-lg hover:shadow-imdb-yellow/10">
        {/* Affiche du film */}
        <div className="relative pt-[150%] bg-imdb-black">
          <img 
            src={imageUrl || 'https://via.placeholder.com/300x450?text=No+Poster'} 
            alt={movie.title}
            className="absolute top-0 left-0 w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
            }}
          />
          {/* Badge de note */}
          <div className="absolute bottom-2 left-2 bg-imdb-yellow text-imdb-black text-sm font-bold px-2 py-1 rounded flex items-center">
            <FaStar className="mr-1" />
            <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>

        {/* Détails du film */}
        <div className="p-4">
          <h3 className="font-semibold text-imdb-text-primary mb-1 line-clamp-2 h-12">
            {movie.title}
          </h3>
          
          <div className="flex items-center text-imdb-light-gray text-sm mb-2">
            <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
            {movie.runtime && (
              <>
                <span className="mx-2">•</span>
                <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
              </>
            )}
          </div>

          {/* Genres */}
          {movie.genre_names?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {movie.genre_names.slice(0, 2).map((genre, index) => (
                <span 
                  key={index}
                  className="text-xs bg-imdb-light-gray/20 text-imdb-text-secondary px-2 py-1 rounded-full"
                >
                  {genre}
                </span>
              ))}
              {movie.genre_names.length > 2 && (
                <span className="text-xs text-imdb-light-gray">+{movie.genre_names.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
