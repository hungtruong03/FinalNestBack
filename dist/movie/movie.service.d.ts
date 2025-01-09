import { Model } from 'mongoose';
import { Movie } from './movie.schema';
export declare class MovieService {
    private readonly movieModel1;
    private readonly movieModel2;
    constructor(movieModel1: Model<Movie>, movieModel2: Model<Movie>);
    getMovieById(tmdb_id: number): Promise<Movie>;
    getMovieCredits(tmdb_id: number): Promise<any>;
    getTrailers(tmdb_id: number): Promise<any>;
    searchMovies(filters: {
        minVoteAverage?: number;
        minVoteCount?: number;
        releaseDateFrom?: string;
        releaseDateTo?: string;
        genres?: string[];
        sortBy?: 'vote_average' | 'release_date';
        sortOrder?: 'asc' | 'desc';
        limit?: number;
        page?: number;
    }): Promise<{
        movies: Movie[];
        total: number;
    }>;
}
