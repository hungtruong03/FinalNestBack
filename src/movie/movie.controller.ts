import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  /**
   * Lấy thông tin chi tiết phim theo `tmdb_id`.
   * @param id ID phim từ TMDB.
   */
    @Get(':id')
    async getMovie(@Param('id') id: string) {
        const tmdb_id = parseInt(id, 10);
        console.log(tmdb_id);
        return this.movieService.getMovieById(tmdb_id);
    }

    @Get(':id/credits')
    async getMovieCredits(@Param('id') id: string) {
        const tmdb_id = parseInt(id, 10);
        return this.movieService.getMovieCredits(tmdb_id);
    }

}
