import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from '../movie/movie.schema';
import { MovieVector } from './movie-vector.schema';

@Injectable()
export class MovieVectorService {
  constructor(
    @InjectModel(Movie.name, 'movie1Connection') private readonly movieModel: Model<Movie>,
    @InjectModel(MovieVector.name, 'movievectorConnection') private readonly movieVectorModel: Model<MovieVector>,
  ) {}

  // Tạo vector cho toàn bộ phim và lưu vào MongoDB
  async generateAndStoreMovieVectors(): Promise<void> {
    const movies = await this.movieModel.find().exec(); // Lấy toàn bộ phim
    for (const movie of movies) {
      const vector = this.createMovieVector(movie); // Tạo vector cho phim
      console.log(vector);
      await this.movieVectorModel.updateOne(
        { tmdb_id: movie.tmdb_id },
        { tmdb_id: movie.tmdb_id, vector },
        { upsert: true }, // Thêm mới hoặc cập nhật
      );
    }
    console.log('Movie vectors generated and stored.');
  }

  // Hàm tạo vector đặc trưng cho một phim
  private createMovieVector(movie: Movie): number[] {
    const genreVector = this.encodeGenres(movie.genres); // Mã hóa thể loại thành vector
    const normalizedVoteAverage = movie.vote_average / 10; // Điểm đánh giá (0-1)
    const normalizedVoteCount = Math.log1p(movie.vote_count); // Số lượt đánh giá (log normalization)

    // Xử lý nếu release_date không hợp lệ
    const releaseYear = movie.release_date && !isNaN(new Date(movie.release_date).getTime())
        ? new Date(movie.release_date).getFullYear()
        : 2000; // Giá trị mặc định
    const normalizedReleaseYear = releaseYear / 2025; // Chuẩn hóa năm phát hành

    return [...genreVector, normalizedVoteAverage, normalizedVoteCount, normalizedReleaseYear];
  }


  // Mã hóa thể loại
  private encodeGenres(genres: Array<{ id: number; name: string }>): number[] {
    const allGenreIds = [28, 12, 16, 35, 80, 99, 18]; // Các thể loại phổ biến
    return allGenreIds.map((id) => (genres.some((g) => g.id === id) ? 1 : 0));
  }

  // Lấy vector đã lưu trong MongoDB
  async getMovieVector(movieId: number): Promise<number[]> {
    const movieVector = await this.movieVectorModel.findOne({ tmdb_id: movieId }).exec();
    if (!movieVector) {
      throw new Error('Movie vector not found.');
    }
    return movieVector.vector;
  }
}
