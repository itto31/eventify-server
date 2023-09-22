import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}
  async searchEventsByTitle(title: string) {
    const events = await this.prisma.event.findMany({
      where: {
        title: {
          mode: 'insensitive',
          contains: title,
        },
      },
    });

    return events;
  }
}
