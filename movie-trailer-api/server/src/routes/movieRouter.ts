import express from "express";
import MovieController from "../controllers/MovieController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { check } from "express-validator";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/movies", MovieController.getAll);

router.get("/movies/:id", MovieController.getOne);

router.post(
  "/movies", adminMiddleware,
  [
    check("title", "Title is required").notEmpty(),
    check("releaseDate", "Release date must be a valid date").isDate(),
    check("trailerLink", "Trailer link is required").notEmpty(),
    check("posterUrl", "Poster URL is required").notEmpty(),
    check("genres", "Genres is required").notEmpty(),
  ],
  MovieController.create
);

router.put("/movies/:id", MovieController.update);

router.delete("/movies/:id", adminMiddleware, MovieController.delete);

router.post("/movies/:id/ratings", authMiddleware, MovieController.createRating);

export default router;