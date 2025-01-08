import { HomeapiService } from './homeapi.service';
import { MovieService } from '../movie/movie.service';
export declare class HomeapiController {
    private readonly homeapiService;
    private readonly movieService;
    constructor(homeapiService: HomeapiService, movieService: MovieService);
    getTrendingDay(limit: number): Promise<import("./schemas/movies_trending_day.schema").MoviesTrendingDay[]>;
    getTrendingWeek(limit: number): Promise<import("./schemas/movies_trending_week.schema").MoviesTrendingWeek[]>;
    getPopular(limit: number): Promise<import("./schemas/movies_popular.schema").MoviesPopular[]>;
    getUpcoming(limit: number): Promise<import("./schemas/movies_upcoming.schema").MoviesUpcoming[]>;
    getTrailers(id: number): Promise<any>;
    getPeople(id: number): Promise<import("./schemas/people.schema").People>;
}
