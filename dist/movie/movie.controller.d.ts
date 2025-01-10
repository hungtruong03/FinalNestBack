import { MovieService } from './movie.service';
export declare class MovieController {
    private readonly movieService;
    constructor(movieService: MovieService);
    getMovie(id: string): Promise<import("./movie.schema").Movie>;
    getMovieCredits(id: string): Promise<any>;
    searchMovie(query: Record<string, string | undefined>): Promise<{
        movies: import("./movie.schema").Movie[];
        totalPages: number;
    }>;
    getMovieReviews(id: string): Promise<any[]>;
}
