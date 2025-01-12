import { Module } from '@nestjs/common';
import { AiapiService } from './aiapi.service';
import { AiapiController } from './aiapi.controller';
import { MovieModule } from '../movie/movie.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MovieModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [AiapiController],
  providers: [AiapiService],
})
export class AiapiModule {}
