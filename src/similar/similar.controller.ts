import { Controller, Get, Param } from '@nestjs/common';
import { SimilarService } from './similar.service';

@Controller('similar')
export class SimilarController {
  constructor(private readonly similarService: SimilarService) {}

  @Get(':movieId')
  async getSimilarMovies(@Param('movieId') movieId: number) {
    return await this.similarService.getSimilarMovies(movieId);
  }
}
