import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostController],
  providers: [
    PostService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class PostModule {}
