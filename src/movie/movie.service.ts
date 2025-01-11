import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './movie.schema';
import axios from 'axios';
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

    throw new NotFoundException('Movie not found.');
  }

  async getTrailers(tmdb_id: number): Promise<any> {
    const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id }).exec();

    if (!movieFromDb1) throw new NotFoundException('Movie not found.');

    return movieFromDb1.trailers;
  }
  async searchMovies(filters: {
    keyword?: string,
    minVoteAverage?: number;
    minVoteCount?: number;
    releaseDateFrom?: string;
    releaseDateTo?: string;
    genres?: string[];
    sortBy?: string;
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
        query.title = { $regex: keyword, $options: 'i' };
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

      // Merge and return results
      const total = Math.ceil((countDb1) / limit);
      console.log('duoc ở BES')
      return { movies: moviesFromDb1, total };
    } catch (error) {
      console.log(error)
    }
  }

  async getMovieReviews(tmdb_id: number): Promise<any[]> {
    // Tìm movie trong database 1
    const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id }).exec();
    if (movieFromDb1 && movieFromDb1.reviews) {
      return movieFromDb1.reviews;
    }
    // Nếu không tìm thấy reviews trong cả hai database
    return [];
  }
  async searchAIMovies(filters: {
    keyword?: string,
    minVoteAverage?: number;
    minVoteCount?: number;
    releaseDateFrom?: string;
    releaseDateTo?: string;
    genres?: string[];
    sortBy?: string;
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
      const formattedKeyword = keyword ? keyword.replace(/\s+/g, '+') : '';
      const apiUrl = `https://awd-llm.azurewebsites.net/retriever?llm_api_key=${process.env.LLM_API_KEY}&collection_name=movies&query=${formattedKeyword}&amount=10&threshold=0.5`;
      const response = await axios.get(apiUrl);
      const movieIds = response.data.data.result;

      if (!movieIds || movieIds.length === 0) {
        return { movies: [], total: 0 };
      }

      const query: any = { _id: { $in: movieIds } };

      if (minVoteAverage !== undefined) {
        query.vote_average = { $gte: minVoteAverage };
      }

      if (minVoteCount !== undefined) {
        query.vote_count = { $gte: minVoteCount };
      }

      if (releaseDateFrom || releaseDateTo) {
        query.release_date = {};
        if (releaseDateFrom) query.release_date.$gte = releaseDateFrom;
        if (releaseDateTo) query.release_date.$lte = releaseDateTo;
      }

      if (genres && genres.length > 0) {
        query.genres = { $elemMatch: { name: { $in: genres } } };
      }

      const skip = (page - 1) * limit;
      const moviesFromDb1 = await this.movieModel1
        .find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const countDb1 = await this.movieModel1.countDocuments(query).exec();
      const total = Math.ceil(countDb1 / limit);

      return { movies: moviesFromDb1, total };
    } catch (error) {
      console.log(error);
      throw new NotFoundException('An error occurred during the AI movie search');
    }
  }
  async getMovieByObjectId(objectId: string): Promise<any> {
    const movieFromDb1 = await this.movieModel1.findById(objectId).exec();
    if (movieFromDb1) {
      return movieFromDb1.tmdb_id;
    }

    throw new NotFoundException('Movie not found.');
  }
}
