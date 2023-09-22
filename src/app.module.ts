import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { CommentsService } from './comments/comments.service';
import { CommentsController } from './comments/comments.controller';
import { CommentsModule } from './comments/comments.module';
import { SearchService } from './search/search.service';
import { SearchModule } from './search/search.module';
import { CategoriesService } from './categories/categories.service';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, PrismaModule, EventsModule, CommentsModule, SearchModule, CategoriesModule],
  providers: [ConfigService, CommentsService, SearchService, CategoriesService],
  controllers: [CommentsController],
})
export class AppModule {}
