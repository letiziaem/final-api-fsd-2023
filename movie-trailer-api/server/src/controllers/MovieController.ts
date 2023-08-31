import { Request, Response, NextFunction } from "express";
import IMovie from "../interfaces/MovieInterface.js";
import IUser from "../interfaces/UserInterface.js";
import MovieService from "../services/MovieService.js";
import ApiError from "../utils/ApiError.js";
import AuthService from "../services/AuthService.js";

class MovieController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, releaseDate, trailerLink, posterUrl, genres } = req.body;

      const newMovie = {
        title,
        releaseDate,
        trailerLink,
        posterUrl,
        genres,
      } as IMovie;

      const savedMovie = await MovieService.createMovie(newMovie);

      res.status(201).json(savedMovie);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || "releaseDate";
      const sortOrder = (req.query.sortOrder as string) || "desc";
      const filtersQuery = req.query.filters as string | undefined;

      let filters: any = {};

      if (filtersQuery) {
        try {
          filters = JSON.parse(decodeURIComponent(filtersQuery));
        } catch (error) {
          return next(ApiError.BadRequestError("Invalid filters JSON"));
        }
      }

      const movies = await MovieService.getAllMovies(
        page,
        limit,
        sortBy,
        sortOrder,
        filters
      );

      res.status(200).json(movies);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const movie = await MovieService.getMovieById(id);

      if (!movie) {
        throw ApiError.NotFoundError(`Movie not found for ${id}`);
      }

      res.status(200).json(movie);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { title, releaseDate, trailerLink, posterUrl, genres } = req.body;

      // const posterUrl = 

      const movieData = {
        title,
        releaseDate,
        trailerLink,
        posterUrl,
        genres,
      } as IMovie;

      let existingMovie: IMovie | null = await MovieService.updateMovie(id, movieData);

      if(!existingMovie) {
        throw ApiError.NotFoundError(`Movie not found for ${id}`);
      };

      existingMovie.title = title || existingMovie.title;
      existingMovie.releaseDate = releaseDate || existingMovie.releaseDate;
      existingMovie.trailerLink = trailerLink || existingMovie.trailerLink;
      existingMovie.posterUrl = posterUrl || existingMovie.posterUrl;
      existingMovie.genres = genres || existingMovie.genres;

      const updatedMovie = await existingMovie.save();

      res.status(200).json(updatedMovie);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!AuthService.isAdmin(req.user as IUser)) {
        throw ApiError.UnauthorizedError("Not authorized");
      }

      const deletedMovie: IMovie | null = await MovieService.deleteMovie(id);

      if(!deletedMovie) {
        throw ApiError.NotFoundError(`Movie not found for ${id}`);
      }

      res.status(200).json(deletedMovie);
    } catch (error) {
      next(error);
    }
  }
}

export default new MovieController();