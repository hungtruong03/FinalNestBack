import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from '../movie/movie.schema';
import { UserService } from '../user/user.service';
import { MovieVector } from '../movievector/movie-vector.schema';
import { MovieVectorService } from 'src/movievector/movie-vector.service';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel(Movie.name, 'movie1Connection')
    private readonly movieModel: Model<Movie>,
    @InjectModel(MovieVector.name, 'movievectorConnection') private readonly movieVectorModel: Model<MovieVector>,
    private readonly userService: UserService,
    private readonly movieVectorService: MovieVectorService,
  ) {}

  async recommendMovies(userId: string, topN: number = 5): Promise<Movie[]> {
    // Lấy danh sách phim từ watchlist và favorite
    const userMovies = await this.userService.getCombinedMovies(userId);
    const userMovieIds = new Set(userMovies.map((movie) => movie.tmdb_id));
  
    // Lấy vector của các phim từ watchlist và favorite
    const userVectors = await Promise.all(
      userMovies.map((movie) => this.movieVectorService.getMovieVector(movie.tmdb_id))
    );
  
    // Lấy toàn bộ vector từ cơ sở dữ liệu
    const allMovieVectors = await this.movieVectorModel.find().exec();
  
    // Tính toán độ tương đồng, bỏ qua các phim trong watchlist và favorite
    const recommendations = allMovieVectors
      .filter((vectorDoc) => !userMovieIds.has(vectorDoc.tmdb_id)) // Loại bỏ phim trong watchlist và favorite
      .map((vectorDoc) => {
        const similarity = userVectors.reduce(
          (maxSim, userVector) =>
            Math.max(maxSim, this.calculateCosineSimilarity(userVector, vectorDoc.vector)),
          0
        );
        return { movieId: vectorDoc.tmdb_id, similarity };
      });
  
    // Sắp xếp theo độ tương đồng và lấy top N
    const topRecommendations = recommendations
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topN);
  
    // Truy xuất chi tiết phim
    const movieDetails = await Promise.all(
      topRecommendations.map((rec) => this.movieModel.findOne({ tmdb_id: rec.movieId }).exec())
    );
  
    // Loại bỏ các giá trị null
    return movieDetails.filter(Boolean);
  }  

  private calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
      const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
      const magnitudeA = Math.sqrt(vec1.reduce((sum, val) => sum + val ** 2, 0));
      const magnitudeB = Math.sqrt(vec2.reduce((sum, val) => sum + val ** 2, 0));
      return dotProduct / (magnitudeA * magnitudeB);
  }

}
