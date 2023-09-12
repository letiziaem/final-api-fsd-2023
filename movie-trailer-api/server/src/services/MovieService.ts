import IMovie from "../interfaces/MovieInterface.js";
import IRating from "../interfaces/RatingInterface.js";
import MovieRepository from "../repositories/MovieRepository.js";
import { v4 as generateFileName } from 'uuid';
import path from 'path';

class MovieService {
  async createMovie(movieData: IMovie) {
    try {
      const savedMovie = await MovieRepository.createMovie(movieData);

      return savedMovie;
    } catch (error) {
      throw error;
    }
  }

  async getAllMovies(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: string,
    filters: any
  ) {
    try {
      const sortParams: { [key: string]: "asc" | "desc" } = {
        [sortBy]: sortOrder === "desc" ? "desc" : "asc",
      };

      let totalMovies = 0;

      const defaultQuery: any = {};

      for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
          const value = filters[key];
          if (key === "title") {
            defaultQuery[key] = { $regex: value, $options: "i" };
          } else if (
            key === "genres" &&
            Array.isArray(value) &&
            value.length > 0
          ) {
            const validGenres = value.filter(
              (genre: string) => genre.trim() !== ""
            );
            if (validGenres.length > 0) {
              defaultQuery[key] = { $all: validGenres };
            }
          } else if (key === "year") {
            defaultQuery["releaseDate"] = {
              $gte: new Date(`${value}-01-01`),
              $lt: new Date(`${parseInt(value + 1)}-01-01`),
            };
          } else {
            defaultQuery[key] = value;
          }
        }
      }

      const result = await MovieRepository.getAllMovies(
        defaultQuery,
        page,
        limit,
        sortParams
      );

      const responseData = {
        movies: result.movies,
        currentPage: page,
        totalPages: Math.ceil(result.totalMovies / limit),
      };

      return responseData;
    } catch (error) {
      throw error;
    }
  }

  async getMovieById(id: string) {
    try {
      const movie = await MovieRepository.getMovieByID(id);

      return movie;
    } catch (error) {
      throw error;
    }
  }

  async updateMovie(id: string, movieData: IMovie) {
    try {
      const updatedMovie = await MovieRepository.updateMovie(id, movieData);

      return updatedMovie;
    } catch (error) {
      throw error;
    }
  }

  async save(file: any) {
    try {
      const fileExt = file.mimetype.split('/')[1];
      const fileName = generateFileName() + '.' + fileExt;
      const filePath = path.resolve('static', fileName);
  
      await file.mv(filePath);
  
      return fileName;
    } catch (error) {
      throw error;
    }
  }

  async deleteMovie(id: string) {
    try {
      const deletedMovie = await MovieRepository.deleteMovie(id);

      return deletedMovie;
    } catch (error) {
      throw error;
    }
  }

  async createRating(ratingData: IRating) {
    try {
      const savedRating = await MovieRepository.createRating(ratingData);

      return savedRating;
    } catch (error) {
      throw error;
    }
  }
}

export default new MovieService();
