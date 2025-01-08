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
    console.log(`Searching for movie with tmdb_id: ${tmdb_id}`);

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
    console.log(`Searching for movie with tmdb_id: ${tmdb_id}`);

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
}
