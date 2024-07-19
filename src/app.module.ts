import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserInterceptor } from './user/interceptors/user.interceptor';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, PrismaModule, PostModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: UserInterceptor,
  }],
})
export class AppModule {}
