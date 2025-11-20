import MovieList from "../models/movieList.model.js";

// Add a movie to watchlist or watched
export const addMovie = async (req, res, next) => {
  try {
    const { movieId, title, releaseDate, posterUrl, status } = req.body;

    if (!movieId || !title || !releaseDate || !posterUrl || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["watchlist", "watched"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const newEntry = await MovieList.create({
      user: req.user._id,
      movieId,
      title,
      releaseDate,
      posterUrl,
      status,
    });

    res.status(201).json({
      message: `Movie added to ${status} successfully`,
      data: newEntry,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Movie already exists in this list" });
    }
    next(err);
  }
};

// Remove a movie from a list
export const removeMovie = async (req, res, next) => {
  try {
    const { movieId, status } = req.body;

    if (!movieId || !status) {
      return res.status(400).json({ message: "Movie ID and status required" });
    }

    const deleted = await MovieList.findOneAndDelete({
      user: req.user._id,
      movieId,
      status,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Movie not found in your list" });
    }

    res.json({ message: "Movie removed successfully" });
  } catch (err) {
    next(err);
  }
};

// Get all movies from a specific list
export const getMovies = async (req, res, next) => {
  try {
    const { status } = req.query;

    if (!status || !["watchlist", "watched"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const movies = await MovieList.find({
      user: req.user._id,
      status,
    }).sort({ createdAt: -1 });

    res.json({ data: movies });
  } catch (err) {
    next(err);
  }
};
