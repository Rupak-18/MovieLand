import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { PORT } from './config/env.js';

import authRouter from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import connectToDatabase from "./databse/mongodb.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRouter);

// Error handling middleware (last)
app.use(errorMiddleware);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB. Server not started.");
  }
};

startServer();