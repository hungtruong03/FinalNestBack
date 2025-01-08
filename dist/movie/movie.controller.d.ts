import { MovieService } from './movie.service';
export declare class MovieController {
    private readonly movieService;
    constructor(movieService: MovieService);
    getMovie(id: string): Promise<import("./movie.schema").Movie>;
    getMovieCredits(id: string): Promise<any>;
}
