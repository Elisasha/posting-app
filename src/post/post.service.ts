import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostResponseDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';

interface CreatePostParams {
    title: string
    content: string
}

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService) { }
    async getPosts(): Promise<PostResponseDto[]> {
        const posts = await this.prismaService.post.findMany()
        return posts.map((post) => new PostResponseDto(post))
    }

    create(createPostDto: CreatePostDto, userId: number) {
            return this.prismaService.post.create({
                data: {
                    ...createPostDto,
                    userId: userId
                }
            })
    }

    async findOne(id: number) {
        return this.prismaService.post.findUnique({
            where: {
                id: id
            }
        })
    }
}
