import { Document } from "mongoose";

export default interface IMovie extends Document {
  title: string;
  releaseDate: Date;
  trailerLink: string;
  posterUrl: string;
  genres: string[]; //ou [string]
}