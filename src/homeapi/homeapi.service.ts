import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MoviesTrendingDay, MoviesTrendingDaySchema } from './schemas/movies_trending_day.schema';
import { MoviesTrendingWeek, MoviesTrendingWeekSchema } from './schemas/movies_trending_week.schema';
import { MoviesPopular, MoviesPopularSchema } from './schemas/movies_popular.schema';
import { MoviesUpcoming, MoviesUpcomingSchema } from './schemas/movies_upcoming.schema';
import { People, PeopleSchema } from './schemas/people.schema';

@Injectable()
export class HomeapiService {
    constructor(
        @InjectModel(MoviesTrendingDay.name, 'HomeAPIConnection')
        private readonly moviesTrendingDay: Model<MoviesTrendingDay>,

        @InjectModel(MoviesTrendingWeek.name, 'HomeAPIConnection')
        private readonly moviesTrendingWeek: Model<MoviesTrendingDay>,

        @InjectModel(MoviesPopular.name, 'HomeAPIConnection')
        private readonly moviesPopular: Model<MoviesPopular>,

        @InjectModel(MoviesUpcoming.name, 'HomeAPIConnection')
        private readonly moviesUpcoming: Model<MoviesUpcoming>,

        @InjectModel(People.name, 'HomeAPIConnection')
        private readonly people: Model<People>,
    ) { }

    async fetchTrendingDay(limit: number): Promise<MoviesTrendingDay[]> {
        const results = await this.moviesTrendingDay.find({}).sort({ popularity: -1 }).limit(limit).exec();

        return results;
    }

    async fetchTrendingWeek(limit: number): Promise<MoviesTrendingWeek[]> {
        const results = await this.moviesTrendingWeek.find({}).sort({ popularity: -1 }).limit(limit).exec();

        return results;
    }

    async fetchPopular(limit: number): Promise<MoviesPopular[]> {
        const results = await this.moviesPopular.find({}).sort({ popularity: -1 }).limit(limit).exec();

        return results;
    }

    async fetchUpcoming(limit: number): Promise<MoviesUpcoming[]> {
        const results = await this.moviesUpcoming.find({}).sort({ release_date: -1 }).limit(limit).exec();

        return results;
    }

    async fetchPeople(tmdb_id: number): Promise<People> {
        const result = await this.people.findOne({ tmdb_id }).exec();

        return result;
    }
}
