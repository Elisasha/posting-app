import {
    Controller, Post, Get, Put, Delete, Body, Request, Param, ParseIntPipe, UseGuards
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostResponseDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/user/decorators/user.decorator'
import { UserType } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService){}

    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard)
    @Post()
    create(@Body() body: CreatePostDto, @Request() req) {
        return this.postService.createPost(body, req)
    }

    @Get()
    findAll(): Promise<PostResponseDto[]> {
        return this.postService.getAllPosts()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.postService.findPostById(id)
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) postId: number,
        @Body() body: UpdatePostDto, @User() user: UserType,) {
        return this.postService.updatePost(postId, body, user.id)
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @User() user: UserType) {
        return this.postService.removePost(id, user.id)
    }

}
