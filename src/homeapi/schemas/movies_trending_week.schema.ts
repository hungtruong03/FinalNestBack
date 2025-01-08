import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'movies_trending_week' })
export class MoviesTrendingWeek extends Document {
    @Prop()
    tmdb_id: number;
  
    @Prop()
    adult: boolean;
  
    @Prop()
    backdrop_path: string;
  
    @Prop({ type: [Number] })
    genre_ids: number[];
  
    @Prop()
    media_type: string;
  
    @Prop()
    original_language: string;
  
    @Prop()
    original_title: string;
  
    @Prop()
    overview: string;
  
    @Prop()
    popularity: number;
  
    @Prop()
    poster_path: string;
  
    @Prop()
    release_date: string;
  
    @Prop()
    title: string;
  
    @Prop()
    video: boolean;
  
    @Prop()
    vote_average: number;
  
    @Prop()
    vote_count: number;
  
    @Prop({ type: [String], default: [] })
    categories: string[];
}

export const MoviesTrendingWeekSchema = SchemaFactory.createForClass(MoviesTrendingWeek);