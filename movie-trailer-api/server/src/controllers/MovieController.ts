import { Request, Response, NextFunction } from "express";
import IMovie from "../interfaces/MovieInterface.js";
import IUser from "../interfaces/UserInterface.js";
import MovieService from "../services/MovieService.js";
import ApiError from "../utils/ApiError.js";
import AuthService from "../services/AuthService.js";
import IRating from "../interfaces/RatingInterface.js";

class MovieController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, releaseDate, trailerLink, genres } = req.body;

      const poster = req.files?.posterUrl;

      let posterImg = 'no-image.jpg';

      if(poster) {
        posterImg = await MovieService.save(poster);
      } 

      const newMovie = {
        title,
        releaseDate,
        trailerLink,
        posterUrl: posterImg,
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
      const limit = parseInt(req.query.limit as string) || 15;
      const sortBy = (req.query.sortBy as string) || "releaseDate";
      const sortOrder = (req.query.sortOrder as string) || "desc";
      const filtersQuery = req.query.filters as string | undefined;

      let filters: any = {};

      if (filtersQuery) {
        try {
          filters = JSON.parse(decodeURIComponent(filtersQuery));
        } catch (error) {
          next(ApiError.BadRequestError("Invalid filters JSON."));
        }
      }
      console.log(filters);
      const movies = await MovieService.getAllMovies(
        page,
        limit,
        sortBy,
        sortOrder,
        filters
      );

      for (let i = 0; i < movies.movies.length; i++) {
        const fullImageUrl = `${req.protocol}://${req.get("host")}/${movies.movies[i]?.posterUrl}`;

        movies.movies[i].posterUrl = fullImageUrl;
      };

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
        throw ApiError.NotFoundError(`Movie not found for ${id}.`);
      }

      res.status(200).json(movie);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { title, releaseDate, trailerLink, genres } = req.body;

      const poster = req.files?.posterUrl;

      let posterImg = 'no-image.jpg';

      const movieData = {
        title,
        releaseDate,
        trailerLink,
        posterUrl: posterImg,
        genres,
      } as IMovie;

      let existingMovie: IMovie | null = await MovieService.updateMovie(
        id,
        movieData
      );

      if (!existingMovie) {
        throw ApiError.NotFoundError(`Movie not found for ${id}.`);
      };

      if (existingMovie) {
        if(existingMovie.posterUrl && existingMovie.posterUrl !== 'no-image.jpg') {
          await MovieService.deleteMovie(existingMovie.posterUrl);
        }

        if (poster) {
          posterImg = await MovieService.save(poster);
        }

      existingMovie.title = title || existingMovie.title;
      existingMovie.releaseDate = releaseDate || existingMovie.releaseDate;
      existingMovie.trailerLink = trailerLink || existingMovie.trailerLink;
      existingMovie.posterUrl = posterImg || existingMovie.posterUrl;
      existingMovie.genres = genres || existingMovie.genres;

      const updatedMovie = await existingMovie.save();

      res.status(200).json(updatedMovie);
      }
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!AuthService.isAdmin(req.user as IUser)) {
        throw ApiError.UnauthorizedError("Not authorized.");
      }

      const deletedMovie: IMovie | null = await MovieService.deleteMovie(id);

      if (!deletedMovie) {
        throw ApiError.NotFoundError(`Movie not found for ${id}.`);
      }

      res.status(200).json(deletedMovie);
    } catch (error) {
      next(error);
    }
  }

  async createRating(req: Request, res: Response, next: NextFunction) {
    try {
      const { movieId, userId, rating, comment } = req.body;

      const newRating = ({
        movie: movieId,
        user: userId,
        rating,
        comment,
      }) as IRating;

      const savedRating = await MovieService.createRating(newRating);

      res.status(201).json(savedRating);
    } catch (error) {
      next(error);
    }
  }
}

export default new MovieController();
