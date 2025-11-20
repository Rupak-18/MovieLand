import mongoose from "mongoose";

const movieListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming you already have a User model
      required: true,
    },
    movieId: {
      type: Number, // TMDB movie ID
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    releaseDate: {
      type: String, // YYYY-MM-DD from TMDB
      required: true,
    },
    posterUrl: {
      type: String, // TMDB poster path or external URL
      required: true,
    },
    status: {
      type: String,
      enum: ["watchlist", "watched"], // list type
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate movie entries per user per list type
movieListSchema.index({ user: 1, movieId: 1, status: 1 }, { unique: true });

export default mongoose.model("MovieList", movieListSchema);
