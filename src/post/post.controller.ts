import {
    Body,
    Controller,
    Delete,
    Get,
    Param, ParseIntPipe,
    Post,
    Put,
    Request,
    UseGuards
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

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

    @Roles(Role.USER)
    @UseGuards(AuthGuard)
    @Put(':id')
    update(@Param('id', ParseIntPipe) postId: number,
        @Body() body: UpdatePostDto, @Request() req) {
        return this.postService.updatePost(postId, body, req)
    }

    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.postService.removePost(id, req)
    }

}
