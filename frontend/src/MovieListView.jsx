import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";

const MovieListView = ({ status, user }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BACKEND_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:5500")}/api/v1/auth`;

  const fetchMovies = async () => {
    if (!user) {
      setError("You must be logged in to view this list");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`${BACKEND_URL}?status=${status}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setMovies(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [status]); // refetch when status changes

  if (!user) {
    return <p>Please log in to view your {status} list.</p>;
  }

  if (loading) {
    return <p>Loading {status}...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (movies.length === 0) {
    return <p>No movies in your {status} yet.</p>;
  }

  return (
    <div className="container">
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} user={user} />
      ))}
    </div>
  );
};

export default MovieListView;
