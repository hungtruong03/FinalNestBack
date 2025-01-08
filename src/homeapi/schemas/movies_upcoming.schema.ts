import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'movies_upcoming' })
export class MoviesUpcoming extends Document {
    @Prop()
    tmdb_id: number;
  
    @Prop()
    adult: boolean;
  
    @Prop()
    backdrop_path: string;
  
    @Prop({ type: [Number] })
    genre_ids: number[];
  
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
}

export const MoviesUpcomingSchema = SchemaFactory.createForClass(MoviesUpcoming);