import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'similar' }) // Kết nối với collection `similar`
export class Similar extends Document {
  @Prop({ required: true })
  tmdb_id: number;

  @Prop([Object])
  similar_movies: Array<{
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    popularity: number;
    genre_ids: number[];
  }>;
}

export const SimilarSchema = SchemaFactory.createForClass(Similar);
