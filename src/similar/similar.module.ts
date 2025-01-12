import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Similar, SimilarSchema } from './similar.schema';
import { SimilarController } from './similar.controller';
import { SimilarService } from './similar.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Similar.name, schema: SimilarSchema }],
      'similarConnection',
    ),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [SimilarController],
  providers: [SimilarService],
  exports: [SimilarService],
})
export class SimilarModule {}
