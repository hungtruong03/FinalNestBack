import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieVector, MovieVectorSchema } from './movie-vector.schema';
import { MovieVectorService } from './movie-vector.service';
import { MovieVectorController } from './movie-vector.controller';
import { Movie, MovieSchema } from '../movie/movie.schema';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [
    MongooseModule.forFeature(
        [{ name: Movie.name, schema: MovieSchema }],
        'movie1Connection',
    ),
    MongooseModule.forFeature(
        [{ name: MovieVector.name, schema: MovieVectorSchema }],
        'movievectorConnection',
    ),
    ConfigModule.forRoot({
        envFilePath: '.env',
        isGlobal: true,
    }),
    MovieModule
  ],
  providers: [MovieVectorService],
  controllers: [MovieVectorController],
  exports: [MovieVectorService],
})
export class MovieVectorModule {}
