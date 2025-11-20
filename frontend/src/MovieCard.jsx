import React from "react";
import axios from "axios";

const MovieCard = ({ movie, user }) => {
  const baseImageUrl = "https://image.tmdb.org/t/p/w500";
  const placeholderImage =
    "https://i.pinimg.com/564x/53/4e/b0/534eb05cdd10f07cd2bcda919c6c84e2.jpg";

 const BACKEND_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:5500")}/api/v1/movies`;

  const handleAddMovie = async (status) => {
    if (!user) {
      alert("You must be logged in to use this feature");
      return;
    }

    try {
      const payload = {
        movieId: movie.id || movie.movieId, // Handle both TMDB and backend movieId
        title: movie.title,
        releaseDate: movie.release_date || movie.releaseDate, // Use backend field if TMDB field is absent
        posterUrl: movie.poster_path
          ? `${baseImageUrl}${movie.poster_path}`
          : movie.posterUrl || placeholderImage, // Use backend field if TMDB field is absent
        status,
      };

      await axios.post(`${BACKEND_URL}/add`, payload, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert(
        status === "watchlist"
          ? "Movie added to your watchlist!"
          : "Movie marked as watched!"
      );
    } catch (err) {
      console.error("Error adding movie:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "Failed to update your list. Please try again."
      );
    }
  };

  return (
    <div className="movie">
      <div>
        <img
          src={
            movie.poster_path
              ? `${baseImageUrl}${movie.poster_path}`
              : movie.posterUrl || placeholderImage // Use posterUrl for backend data
          }
          alt={movie.title || "Movie Poster"}
        />
      </div>
      <div className="movie-title">
        <h3>
          {movie.title
            ? `${movie.title} (${
                (movie.release_date || movie.releaseDate)?.split("-")[0] || "N/A"
              })`
            : "Untitled"}
        </h3>
      </div>
      <div className="movie-actions">
        <button
          className="btn btn-watchlist"
          onClick={() => handleAddMovie("watchlist")}
        >
          Add to Watchlist
        </button>
        <button
          className="btn btn-watched"
          onClick={() => handleAddMovie("watched")}
        >
          Mark as Watched
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
