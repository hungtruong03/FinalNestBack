import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'vectors' })
export class MovieVector extends Document {
  @Prop({ required: true, unique: true })
  tmdb_id: number; // ID của phim từ TMDB

  @Prop([Number])
  vector: number[]; // Vector đặc trưng của phim
}

export const MovieVectorSchema = SchemaFactory.createForClass(MovieVector);
