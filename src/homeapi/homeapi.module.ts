import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesTrendingDay, MoviesTrendingDaySchema } from './schemas/movies_trending_day.schema';
import { MoviesTrendingWeek, MoviesTrendingWeekSchema } from './schemas/movies_trending_week.schema';
import { MoviesPopular, MoviesPopularSchema } from './schemas/movies_popular.schema';
import { MoviesUpcoming, MoviesUpcomingSchema } from './schemas/movies_upcoming.schema';
import { People, PeopleSchema } from './schemas/people.schema';
import { HomeapiService } from './homeapi.service';
import { HomeapiController } from './homeapi.controller';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: MoviesTrendingDay.name, schema: MoviesTrendingDaySchema }],
      'HomeAPIConnection',
    ),
    MongooseModule.forFeature(
      [{ name: MoviesTrendingWeek.name, schema: MoviesTrendingWeekSchema }],
      'HomeAPIConnection',
    ),
    MongooseModule.forFeature(
      [{ name: MoviesPopular.name, schema: MoviesPopularSchema }],
      'HomeAPIConnection',
    ),
    MongooseModule.forFeature(
      [{ name: MoviesUpcoming.name, schema: MoviesUpcomingSchema }],
      'HomeAPIConnection',
    ),
    MongooseModule.forFeature(
      [{ name: People.name, schema: PeopleSchema }],
      'HomeAPIConnection',
    ),
    MovieModule,
  ],
  controllers: [HomeapiController],
  providers: [HomeapiService],
})
export class HomeapiModule {}
