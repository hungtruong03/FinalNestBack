import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

    /**
     * Lấy thông tin chi tiết phim theo `tmdb_id`.
     * @param id ID phim từ TMDB.
     */
    @Get('detail/:id')
    async getMovie(@Param('id') id: string) {
        const tmdb_id = parseInt(id, 10);
        console.log(tmdb_id);
        return this.movieService.getMovieById(tmdb_id);
    }

    @Get('credits/:id')
    async getMovieCredits(@Param('id') id: string) {
        const tmdb_id = parseInt(id, 10);
        return this.movieService.getMovieCredits(tmdb_id);
    }
    @Get('search')
    async searchMovie(@Query() query: Record<string, string | undefined>) {
        const filters = {
            keyword: query.keyword || '',
            minVoteAverage: parseFloat(query.minVoteAverage) || 0,
            minVoteCount: parseInt(query.minVoteCount, 10) || 0,
            releaseDateFrom: query.releaseDateFrom || '',
            releaseDateTo: query.releaseDateTo || '',
            genres: query.genres ? query.genres.split(',') : [],
            sortBy: query.sortBy || 'vote_average',
            sortOrder: query.sortOrder || 'desc',
            limit: parseInt(query.limit, 10) || 10,
            page: parseInt(query.page, 10) || 1,
        };

        const result = await this.movieService.searchMovies(filters);
        return {
            movies: result.movies,
            totalPages: result.total,
        };
    }

    @Get('reviews/:id')
    async getMovieReviews(@Param('id') id: string) {
        const tmdb_id = parseInt(id, 10);
        return this.movieService.getMovieReviews(tmdb_id);
    }

    @Get('byObjectId/:objectId')
    async getMovieByObjectId(@Param('objectId') objectId: string) {
        return this.movieService.getMovieByObjectId(objectId);
    }
}
