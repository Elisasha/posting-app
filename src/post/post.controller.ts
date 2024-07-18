import {
    Controller, Post, Get, Put, Delete, Body, Request, Param
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostResponseDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';

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
    findOne(@Param('id') id: number) {
        return this.postService.findOne(id)
    }

    @Put(':id')
    update() {
    }

    @Delete(':id')
    remove() {    
    }

}
