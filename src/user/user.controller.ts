import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Get(':id/events')
  getUserEvents(@Param() params: { id: number }) {
    return this.userService.getUserEvents(params.id);
  }
}
