import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/apiService';

const MovieCard = ({ movie, imageUrl }) => {
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  
  return (
    <Link 
      to={`/movie/${movie.id}`}
      className="group relative rounded-lg overflow-hidden bg-dark-surface-light hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[2/3] bg-dark-surface/50">
        <img
          src={imageUrl || getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/500x750?text=Image+non+disponible';
          }}
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-2">{movie.title}</h3>
        <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
          <span>{releaseYear}</span>
          <div className="flex items-center">
            <span className="text-accent-yellow mr-1">★</span>
            {movie.vote_average?.toFixed(1) || 'N/A'}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
