import React from 'react';

const MovieCard = ({ movie }) => {
  const baseImageUrl = "https://image.tmdb.org/t/p/w500";
  const placeholderImage = "https://i.pinimg.com/564x/53/4e/b0/534eb05cdd10f07cd2bcda919c6c84e2.jpg";

  const handleAddToWatchlist = () => {
    // Placeholder for watchlist functionality
    console.log(`Added ${movie.title} to watchlist`);
  };

  const handleMarkAsWatched = () => {
    // Placeholder for watched list functionality
    console.log(`Marked ${movie.title} as watched`);
  };

  return (
    <div className="movie">
      <div>
        <img
          src={movie.poster_path ? `${baseImageUrl}${movie.poster_path}` : placeholderImage}
          alt={movie.title || 'Movie Poster'}
        />
      </div>
      <div className='movie-title'>
        <h3>{movie.title ? `${movie.title} (${movie.release_date.split('-')[0] || 'N/A'})` : 'Untitled'}</h3>
      </div>
      <div className="movie-actions">
        <button className="btn btn-watchlist" onClick={handleAddToWatchlist}>
          Add to Watchlist
        </button>
        <button className="btn btn-watched" onClick={handleMarkAsWatched}>
          Mark as Watched
        </button>
      </div>
    </div>
  );
};

export default MovieCard;