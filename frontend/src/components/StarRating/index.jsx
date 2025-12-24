import { FiStar } from 'react-icons/fi';
import { useState } from 'react';

const StarRating = ({ rating, onRate }) => {
  const [hover, setHover] = useState(null);
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            className={`text-2xl ${ratingValue <= (hover || rating) ? 'text-accent-yellow' : 'text-gray-600'}`}
            onClick={() => onRate(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
          >
            <FiStar className="fill-current" />
          </button>
        );
      })}
      <span className="ml-2 text-text-secondary">{rating || ''}</span>
    </div>
  );
};

export default StarRating;
