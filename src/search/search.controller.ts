import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtGuard } from 'src/auth/guard';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @UseGuards(JwtGuard)
  @Get('events')
  async searchEventsByTitle(@Query('title') title: string) {
    const events = await this.searchService.searchEventsByTitle(title);
    return events;
  }
}
