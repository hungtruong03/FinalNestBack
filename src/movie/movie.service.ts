import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './movie.schema';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name, 'movie1Connection')
    private readonly movieModel1: Model<Movie>, // Model kết nối đến movie1

    @InjectModel(Movie.name, 'movie2Connection')
    private readonly movieModel2: Model<Movie>, // Model kết nối đến movie2
  ) { }

  /**
   * Lấy thông tin chi tiết phim theo `tmdb_id`.
   * @param tmdb_id ID phim từ TMDB.
   */
  async getMovieById(tmdb_id: number): Promise<Movie> {
    console.log(`Searching for movie with tmdb_id2: ${tmdb_id}`);

    const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id }).exec();
    if (movieFromDb1) {
      console.log('Found in movie1Connection');
      return movieFromDb1;
    }

    const movieFromDb2 = await this.movieModel2.findOne({ tmdb_id }).exec();
    if (movieFromDb2) {
      console.log('Found in movie2Connection');
      return movieFromDb2;
    }

    throw new NotFoundException('Movie not found in either database');
  }

  /**
   * Lấy danh sách diễn viên và đội ngũ làm phim.
   * @param tmdb_id ID phim từ TMDB.
   */
  async getMovieCredits(tmdb_id: number): Promise<any> {
    console.log(`Searching for movie with tmdb_id1: ${tmdb_id}`);

    const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id }).exec();
    if (movieFromDb1) {
      console.log('Found in movie1Connection');
      return movieFromDb1.credits;
    }

    const movieFromDb2 = await this.movieModel2.findOne({ tmdb_id }).exec();
    if (movieFromDb2) {
      console.log('Found in movie2Connection');
      return movieFromDb2.credits;
    }

    throw new NotFoundException('Movie not found in either database');
  }

  async getTrailers(tmdb_id: number): Promise<any> {
    const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id }).exec();
    const movieFromDb2 = await this.movieModel2.findOne({ tmdb_id }).exec();
    let movie = null;

    if (movieFromDb1) {
      movie = movieFromDb1;
    } else {
      movie = movieFromDb2;
    }

    if (!movie) throw new NotFoundException('Movie not found.');

    return movie.trailers;
  }
  async searchMovies(filters: {
    keyword?: string,
    minVoteAverage?: number;
    minVoteCount?: number;
    releaseDateFrom?: string;
    releaseDateTo?: string;
    genres?: string[];
    sortBy?:string;
    sortOrder?: string;
    limit?: number;
    page?: number;
  }): Promise<{ movies: Movie[]; total: number; }> {
    const {
      keyword,
      minVoteAverage,
      minVoteCount,
      releaseDateFrom,
      releaseDateTo,
      genres,
      sortBy = 'vote_average',
      sortOrder = 'desc',
      limit = 10,
      page = 1,
    } = filters;
    try {
      const query: any = {};
      if (keyword) {
        query.title = { $regex: keyword, $options: 'i' }; // Tìm kiếm tiêu đề không phân biệt chữ hoa/thường
      }
      // Filter by vote_average
      if (minVoteAverage !== undefined) {
        query.vote_average = { $gte: minVoteAverage };
      }

      // Filter by vote_count
      if (minVoteCount !== undefined) {
        query.vote_count = { $gte: minVoteCount };
      }

      // Filter by release_date
      if (releaseDateFrom || releaseDateTo) {
        query.release_date = {};
        if (releaseDateFrom) query.release_date.$gte = releaseDateFrom;
        if (releaseDateTo) query.release_date.$lte = releaseDateTo;
      }

      // Filter by genres
      if (genres && genres.length > 0) {
        query.genres = { $elemMatch: { name: { $in: genres } } };
      }

      // Calculate skip and limit for pagination
      const skip = (page - 1) * limit;

      // Perform the query on both databases
      const moviesFromDb1 = await this.movieModel1
        .find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const countDb1 = await this.movieModel1.countDocuments(query).exec();


      const moviesFromDb2 = await this.movieModel2
        .find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const countDb2 = await this.movieModel2.countDocuments(query).exec();


      // Merge and return results
      const combinedMovies = [...moviesFromDb1, ...moviesFromDb2];
      const total = countDb1 + countDb2;
      console.log('duoc ở BES')
      return { movies: combinedMovies, total };
    } catch (error) {
      console.log(error)
    }
  }

}
