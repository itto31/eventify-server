import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventsModule } from './events/events.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, PrismaModule, EventsModule],
  providers: [ConfigService],
})
export class AppModule {}
