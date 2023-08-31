import mongoose from "mongoose";
import IMovie from "../interfaces/MovieInterface.js";

const MovieSchema = new mongoose.Schema<IMovie>({
  title: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  trailerLink: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  genres: {
    type: [String],
    required: true,
  },
});

const MovieModel = mongoose.model<IMovie>("Movie", MovieSchema);

export default MovieModel;