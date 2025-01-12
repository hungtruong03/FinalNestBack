import { Controller, Get, Request } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('vector')
  async recommendForUser(@Request() req) {
    const email = req.email;
    return await this.recommendationService.recommendMovies(email);
  }
}
