import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'movies' }) // Chỉ định tên collection là 'movie2'
export class Movie extends Document {
  @Prop({ required: true })
  tmdb_id: number; // ID phim từ TMDB

  @Prop()
  title: string; // Tựa đề phim

  @Prop()
  overview: string; // Tóm tắt nội dung phim

  @Prop([Object])
  genres: Array<{ id: number; name: string }>; // Thể loại phim

  @Prop()
  release_date: string; // Ngày phát hành

  @Prop()
  vote_average: number; // Điểm đánh giá trung bình

  @Prop()
  vote_count: number; // Số lượt đánh giá

  @Prop()
  poster_path: string; // Đường dẫn đến poster phim

  @Prop([Object])
  trailers: Array<{ key: string; name: string }>; // Danh sách trailer

  @Prop([Object])
  credits: { // Thông tin diễn viên và đội ngũ làm phim
    cast: Array<{
      cast_id: number;
      character: string;
      name: string;
      profile_path: string;
      order: number;
    }>;
    crew: Array<{
      credit_id: string;
      department: string;
      job: string;
      name: string;
      profile_path: string;
    }>;
  };
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
