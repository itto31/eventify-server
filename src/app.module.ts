import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { CommentsService } from './comments/comments.service';
import { CommentsController } from './comments/comments.controller';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, PrismaModule, EventsModule, CommentsModule],
  providers: [ConfigService, CommentsService],
  controllers: [CommentsController],
})
export class AppModule {}
