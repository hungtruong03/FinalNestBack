import { SimilarService } from './similar.service';
export declare class SimilarController {
    private readonly similarService;
    constructor(similarService: SimilarService);
    getSimilarMovies(movieId: number): Promise<any[]>;
}
