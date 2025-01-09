import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

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
    @Get('search')
    async searchMovies(@Query() query: {
        minVoteAverage?: string;
        minVoteCount?: string;
        releaseDateFrom?: string;
        releaseDateTo?: string;
        genres?: string;
        sortBy?: 'vote_average' | 'release_date';
        sortOrder?: 'asc' | 'desc';
        limit?: string;
        page?: string;
    }) {
        const filters = {
            minVoteAverage: query.minVoteAverage ? parseFloat(query.minVoteAverage) : undefined,
            minVoteCount: query.minVoteCount ? parseInt(query.minVoteCount, 10) : undefined,
            releaseDateFrom: query.releaseDateFrom,
            releaseDateTo: query.releaseDateTo,
            genres: query.genres ? query.genres.split(',') : undefined,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            limit: query.limit ? parseInt(query.limit, 10) : undefined,
            page: query.page ? parseInt(query.page, 10) : undefined,
        };

        return this.movieService.searchMovies(filters);
    }

}
