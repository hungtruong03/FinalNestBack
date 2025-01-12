import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Similar } from './similar.schema';

@Injectable()
export class SimilarService {
  constructor(
    @InjectModel(Similar.name, 'similarConnection')
    private readonly similarModel: Model<Similar>,
  ) {}

  async getSimilarMovies(movieId: number): Promise<any[]> {
    // Tìm phim tương tự từ collection `similar`
    const similarData = await this.similarModel.findOne({ tmdb_id: movieId }).exec();

    if (!similarData || !similarData.similar_movies) {
      throw new NotFoundException('No similar movies found.');
    }

    return similarData.similar_movies;
  }
}
