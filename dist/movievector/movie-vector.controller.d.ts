import { MovieVectorService } from './movie-vector.service';
export declare class MovieVectorController {
    private readonly movieVectorService;
    constructor(movieVectorService: MovieVectorService);
    generateMovieVectors(): Promise<{
        message: string;
    }>;
}
