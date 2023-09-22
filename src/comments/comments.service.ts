import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentCreateDto } from './dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(
    eventId: number,
    userId: number,
    commentCreateDto: CommentCreateDto,
  ) {
    const event = await this.prisma.event.findUnique({
      where: { eventId: Number(eventId) },
    });

    if (!event) {
      throw new NotFoundException('El evento no fue encontrado.');
    }

    const comment = await this.prisma.comment.create({
      data: {
        text: commentCreateDto.text,
        eventId: Number(eventId),
        creatorId: Number(userId),
      },
    });

    return comment;
  }

  async editComment(
    commentId: number,
    userId: number,
    commentEditDto: CommentCreateDto,
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      throw new NotFoundException('El comentario no fue encontrado.');
    }

    // Verifica si el usuario actual es el creador del comentario
    if (comment.creatorId !== userId) {
      throw new UnauthorizedException(
        'No tienes permisos para editar este comentario.',
      );
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id: Number(commentId) },
      data: {
        text: commentEditDto.text,
      },
    });

    return updatedComment;
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      throw new NotFoundException('El comentario no fue encontrado.');
    }

    if (comment.creatorId !== userId) {
      throw new UnauthorizedException(
        'No tienes permisos para eliminar este comentario.',
      );
    }

    await this.prisma.comment.delete({
      where: { id: Number(commentId) },
    });

    return 'Comentario eliminado con éxito.';
  }

  async getCommentsByEvent(eventId: number) {
    const comments = await this.prisma.comment.findMany({
      where: { eventId: Number(eventId) },
    });

    if (!comments || comments.length === 0) {
      throw new NotFoundException(
        'No se encontraron comentarios para este evento.',
      );
    }

    return comments;
  }
}
