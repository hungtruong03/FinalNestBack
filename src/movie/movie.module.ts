import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './movie.schema';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Kết nối với database `movie1`
    MongooseModule.forFeature(
      [{ name: Movie.name, schema: MovieSchema }],
      'movie1Connection',
    ),
    // Kết nối với database `movie2`
    MongooseModule.forFeature(
      [{ name: Movie.name, schema: MovieSchema }],
      'movie2Connection',
    ),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  providers: [MovieService],
  controllers: [MovieController],
  exports: [MovieService],
})
export class MovieModule {}
