import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { Movie, MovieSchema } from '../movie/movie.schema';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@user/user.module';
import { MovieVectorModule } from 'src/movievector/movie-vector.module';
import { MovieVector, MovieVectorSchema } from '../movievector/movie-vector.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }], 'movie1Connection'),
    MongooseModule.forFeature([{ name: MovieVector.name, schema: MovieVectorSchema }],'movievectorConnection',),
    ConfigModule.forRoot({
        envFilePath: '.env',
        isGlobal: true,
    }),
    UserModule,
    MovieVectorModule
  ],
  providers: [RecommendationService],
  controllers: [RecommendationController],
})
export class RecommendationModule {}
