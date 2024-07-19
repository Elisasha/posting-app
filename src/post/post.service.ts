import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

interface CreatePostParams {
    title: string
    content: string
}

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService) { }
    async getAllPosts(): Promise<PostResponseDto[]> {
        const posts = await this.prismaService.post.findMany()
        return posts.map((post) => new PostResponseDto(post))
    }

    async createPost(dto: CreatePostDto, req) {
        return this.prismaService.post.create({
            data: {
                ...dto,
                userId: req.userId
            }
        })
    }

    async findPostById(id: number) {
        const post = await this.prismaService.post.findUnique({
            where: {
                id: id
            }
        })
        if (!post) {
            throw new NotFoundException('This post doesn\'t exist')
        }
        return post
    }

    async updatePost(id: number, updatePostDto: UpdatePostDto) {
        const post = await this.findPostById(id)
        return this.prismaService.post.update({
            where: { id: post.id },
            data: updatePostDto,
        });
    }

    async removePost(id: number) {
        const post = await this.findPostById(id)
        await this.prismaService.post.delete({
            where: {
                id
            }
        })
        return 'Succesfully deleted post ${post.id}'
    }
}
