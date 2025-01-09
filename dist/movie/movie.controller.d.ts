import { MovieService } from './movie.service';
export declare class MovieController {
    private readonly movieService;
    constructor(movieService: MovieService);
    getMovie(id: string): Promise<import("./movie.schema").Movie>;
    getMovieCredits(id: string): Promise<any>;
    searchMovies(query: {
        minVoteAverage?: string;
        minVoteCount?: string;
        releaseDateFrom?: string;
        releaseDateTo?: string;
        genres?: string;
        sortBy?: 'vote_average' | 'release_date';
        sortOrder?: 'asc' | 'desc';
        limit?: string;
        page?: string;
    }): Promise<{
        movies: import("./movie.schema").Movie[];
        total: number;
    }>;
}
