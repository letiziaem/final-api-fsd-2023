import { Document } from "mongoose";

export default interface IRating extends Document {
  movie: string;
  user: string;
  rating: number;
  comment: string;
}
