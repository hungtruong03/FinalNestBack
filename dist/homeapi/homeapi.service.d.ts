import { Model } from 'mongoose';
import { MoviesTrendingDay } from './schemas/movies_trending_day.schema';
import { MoviesTrendingWeek } from './schemas/movies_trending_week.schema';
import { MoviesPopular } from './schemas/movies_popular.schema';
import { MoviesUpcoming } from './schemas/movies_upcoming.schema';
import { People } from './schemas/people.schema';
export declare class HomeapiService {
    private readonly moviesTrendingDay;
    private readonly moviesTrendingWeek;
    private readonly moviesPopular;
    private readonly moviesUpcoming;
    private readonly people;
    constructor(moviesTrendingDay: Model<MoviesTrendingDay>, moviesTrendingWeek: Model<MoviesTrendingDay>, moviesPopular: Model<MoviesPopular>, moviesUpcoming: Model<MoviesUpcoming>, people: Model<People>);
    fetchTrendingDay(limit: number): Promise<MoviesTrendingDay[]>;
    fetchTrendingWeek(limit: number): Promise<MoviesTrendingWeek[]>;
    fetchPopular(limit: number): Promise<MoviesPopular[]>;
    fetchUpcoming(limit: number): Promise<MoviesUpcoming[]>;
    fetchPeople(tmdb_id: number): Promise<People>;
}
