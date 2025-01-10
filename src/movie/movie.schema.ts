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
  @Prop([Object])
  reviews: Array<{
    id: string; // ID của review
    author: string; // Tên tác giả
    author_details: {
      name: string; // Tên đầy đủ của tác giả (có thể rỗng)
      username: string; // Tên người dùng
      avatar_path: string | null; // Đường dẫn tới avatar (nếu có)
      rating: number | null; // Điểm đánh giá (nếu có)
    };
    content: string; // Nội dung đánh giá
    created_at: string; // Thời gian tạo
    updated_at: string; // Thời gian cập nhật
    url: string; // Đường dẫn đến review trên web
  }>;

}

export const MovieSchema = SchemaFactory.createForClass(Movie);
