import express from "express";
import {
  addMovie,
  removeMovie,
  getMovies,
} from "../controllers/movieList.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"; // Ensure this exists

const movieListRouter = express.Router();

// All routes require authentication
movieListRouter.use(authMiddleware);

// Add a movie to watchlist or watched list
movieListRouter.post("/add", addMovie);

// Remove a movie from a list
movieListRouter.delete("/remove", removeMovie);

// Get all movies from a specific list
// Example: GET /api/v1/movies?status=watchlist
movieListRouter.get("/", getMovies);

export default movieListRouter;
