import { Model } from 'mongoose';
import { Movie } from '../movie/movie.schema';
import { UserService } from '../user/user.service';
import { MovieVector } from '../movievector/movie-vector.schema';
import { MovieVectorService } from 'src/movievector/movie-vector.service';
export declare class RecommendationService {
    private readonly movieModel;
    private readonly movieVectorModel;
    private readonly userService;
    private readonly movieVectorService;
    constructor(movieModel: Model<Movie>, movieVectorModel: Model<MovieVector>, userService: UserService, movieVectorService: MovieVectorService);
    recommendMovies(userId: string, topN?: number): Promise<Movie[]>;
    private calculateCosineSimilarity;
}
