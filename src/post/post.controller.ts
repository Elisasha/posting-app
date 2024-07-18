import {
    Controller, Post, Get, Put, Delete, Body, Request, Param, ParseIntPipe
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostResponseDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/user/decorators/user.decorator'
import { UserType } from 'src/user/decorators/user.decorator';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService){}

    @Post()
    createPost(@Body() body: CreatePostDto, @User() user: UserType) {
        return this.postService.createPost(body, user.id)
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
