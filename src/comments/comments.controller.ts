import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtGuard } from 'src/auth/guard';
import { CommentCreateDto } from './dto';
import { GetUser } from 'src/auth/decorator';

@Controller('events')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtGuard)
  @Post(':id/comments')
  async createComment(
    @Param('id') eventId: number,
    @Body() commentCreateDto: CommentCreateDto,
    @GetUser() user: any,
  ) {
    return this.commentsService.createComment(
      eventId,
      user.userId,
      commentCreateDto,
    );
  }

  @UseGuards(JwtGuard)
  @Put(':id/comments/:commentId')
  async editComment(
    @Param('id') eventId: number,
    @Param('commentId') commentId: number,
    @Body() commentEditDto: CommentCreateDto,
    @GetUser() user: any,
  ) {
    return this.commentsService.editComment(
      commentId,
      user.userId,
      commentEditDto,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id/comments/:commentId')
  deleteComment(
    @Param('id') eventId: number,
    @Param('commentId') commentId: number,
    @GetUser() user: any,
  ) {
    return this.commentsService.deleteComment(commentId, user.userId);
  }

  @UseGuards(JwtGuard)
  @Get(':id/comments')
  getCommentsByEvent(@Param('id') eventId: number) {
    return this.commentsService.getCommentsByEvent(eventId);
  }
}
