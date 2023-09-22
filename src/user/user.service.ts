import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserEvents(userId: number) {
    const userEvents = await this.prisma.event.findMany({
      where: {
        creatorId: Number(userId),
      },
    });

    return userEvents;
  }
}
