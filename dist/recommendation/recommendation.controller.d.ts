import { RecommendationService } from './recommendation.service';
export declare class RecommendationController {
    private readonly recommendationService;
    constructor(recommendationService: RecommendationService);
    recommendForUser(req: any): Promise<import("../movie/movie.schema").Movie[]>;
}
