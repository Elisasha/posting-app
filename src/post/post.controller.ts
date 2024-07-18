import {
    Controller, Post, Get, Put, Delete
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostResponseDto } from './dto/post.dto';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService){}

    @Post()
    create() {
        return { 'new obj': 'obj'}
    }

    @Get()
    findAll(): Promise<PostResponseDto[]> {
        return this.postService.getPosts()
    }

    @Get(':id')
    findOne() {
        return {'exist obj': 'obj'}
    }

    @Put(':id')
    update() {
    }

    @Delete(':id')
    remove() {    
    }

}
