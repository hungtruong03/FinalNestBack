import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { createClient } from '@supabase/supabase-js';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieModule } from './movie/movie.module';
import { ConfigModule } from '@nestjs/config';
import { HomeapiModule } from './homeapi/homeapi.module';
import { AiapiModule } from './aiapi/aiapi.module';
import { SimilarModule } from './similar/similar.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    UserModule,
    // Kết nối MongoDB
    MongooseModule.forRoot(process.env.MONGO_URI_MOVIE_2, {
      connectionName: 'movie2Connection',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI_MOVIE_1, {
      connectionName: 'movie1Connection',
    }),
    MongooseModule.forRoot(process.env.MONGO_SIMILAR, {
      connectionName: 'similarConnection',
    }),
    MongooseModule.forRoot(process.env.MONGODB_HOMEAPI, {
      connectionName: 'HomeAPIConnection',
    }),
    MovieModule,
    HomeapiModule,
    AiapiModule,
    SimilarModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: () => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        return createClient(supabaseUrl, supabaseKey);
      },
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply((req, res, next) => {
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(200).send();
      } else {
        next();
      }
    });
  }
}
