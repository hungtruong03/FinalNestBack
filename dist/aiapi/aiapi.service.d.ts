import { MovieService } from '../movie/movie.service';
export declare class AiapiService {
    private readonly movieService;
    private geminiAPIKey;
    constructor(movieService: MovieService);
    getNavigateDestination(query: string): Promise<{
        route: any;
        params: any;
    }>;
}
