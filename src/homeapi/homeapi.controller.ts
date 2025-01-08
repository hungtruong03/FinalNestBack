import { Controller, Get, Param, Query } from '@nestjs/common';
import { HomeapiService } from './homeapi.service';
import { MovieService } from '../movie/movie.service';

@Controller('homeapi')
export class HomeapiController {
  constructor(
    private readonly homeapiService: HomeapiService,
    private readonly movieService: MovieService,
  ) { }

  @Get('trending/day')
  async getTrendingDay(@Query('limit') limit: number) {
    return this.homeapiService.fetchTrendingDay(limit);
  }

  @Get('trending/week')
  async getTrendingWeek(@Query('limit') limit: number) {
    return this.homeapiService.fetchTrendingWeek(limit);
  }

  @Get('popular')
  async getPopular(@Query('limit') limit: number) {
    return this.homeapiService.fetchPopular(limit);
  }

  @Get('upcoming')
  async getUpcoming(@Query('limit') limit: number) {
    return this.homeapiService.fetchUpcoming(limit);
  }

  @Get('movie/:id/trailers')
  async getTrailers(@Param('id') id: number) {
    return this.movieService.getTrailers(id);
  }

  @Get('people/:id')
  async getPeople(@Param('id') id: number) {
    return this.homeapiService.fetchPeople(id);
  }
}