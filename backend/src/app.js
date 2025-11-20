// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";

// import { PORT } from './config/env.js';

// import authRouter from "./routes/auth.routes.js";
// import movieListRouter from "./routes/movieList.routes.js";
// import errorMiddleware from "./middlewares/error.middleware.js";
// import connectToDatabase from "./databse/mongodb.js";

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/movies", movieListRouter);

// // Error handling middleware (last)
// app.use(errorMiddleware);

// // Connect to MongoDB and start server
// const startServer = async () => {
//   try {
//     await connectToDatabase();
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running at http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error("❌ Failed to connect to DB. Server not started.");
//   }
// };

// startServer();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { PORT as ENV_PORT, DB_URI } from "./config/env.js";

import authRouter from "./routes/auth.routes.js";
import movieListRouter from "./routes/movieList.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import connectToDatabase from "./databse/mongodb.js";

const app = express();

// Use Render/Railway port OR env.js port OR fallback
const PORT = process.env.PORT || ENV_PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movies", movieListRouter);

// Error handling middleware
app.use(errorMiddleware);

// Connect to DB and start server
const startServer = async () => {
  try {
    await connectToDatabase(DB_URI); 
    // (or await connectToDatabase() if your function reads DB_URI from env)
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB. Server not started.", err);
  }
};

startServer();
