import { Model } from 'mongoose';
import { Movie } from '../movie/movie.schema';
import { MovieVector } from './movie-vector.schema';
export declare class MovieVectorService {
    private readonly movieModel;
    private readonly movieVectorModel;
    constructor(movieModel: Model<Movie>, movieVectorModel: Model<MovieVector>);
    generateAndStoreMovieVectors(): Promise<void>;
    private createMovieVector;
    private encodeGenres;
    getMovieVector(movieId: number): Promise<number[]>;
}
