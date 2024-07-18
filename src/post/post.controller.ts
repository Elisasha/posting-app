import {
    Controller, Post, Get, Put, Delete, Body, Request, Param, ParseIntPipe
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostResponseDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService){}

    @Post()
    create(@Request() req, @Body() createPostDto: CreatePostDto) {
        return this.postService.create(createPostDto, req.user.userId)
    }

    @Get()
    findAll(): Promise<PostResponseDto[]> {
        return this.postService.getPosts()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.postService.findPostById(id)
    }

    @Put(':id')
    update(@Request() req, @Param('id', ParseIntPipe) postId: number, @Body() updatePostDto: UpdatePostDto) {
        return this.postService.update(+req.user.id, postId, updatePostDto)
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.postService.remove(id)
    }

}
