import { Body, Controller, Post } from '@nestjs/common';
import { AiapiService } from './aiapi.service';

@Controller('aiapi')
export class AiapiController {
  constructor(private readonly aiapiService: AiapiService) {}

  @Post('navigate')
  async getNavigateDestination(@Body('query') query: string) {
    return this.aiapiService.getNavigateDestination(query);
  }
}
