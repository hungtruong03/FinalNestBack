import { Controller, Post } from '@nestjs/common';
import { MovieVectorService } from './movie-vector.service';

@Controller('movie-vectors')
export class MovieVectorController {
  constructor(private readonly movieVectorService: MovieVectorService) {}

  @Post('generate')
  async generateMovieVectors() {
    await this.movieVectorService.generateAndStoreMovieVectors();
    return { message: 'Movie vectors generated and stored.' };
  }
}
