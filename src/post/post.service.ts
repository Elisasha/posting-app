import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostResponseDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Role } from '@prisma/client';

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

    async updatePost(postId: number, updatePostDto: UpdatePostDto, req) {
        const post = await this.findPostById(postId)
        const userId = req.user.id
        if (post.userId !== userId) {
            throw new ForbiddenException('You are not allowed to edit this post')
        }
        return this.prismaService.post.update({
            where: { id: postId },
            data: updatePostDto,
        });
    }

    async removePost(id: number, req) {
        const post = await this.findPostById(id)
        const role = req.userRole
        const userId = req.userId
        if (post.userId !== userId && role !== Role.ADMIN) {
            throw new ForbiddenException('You are not allowed to edit this post')
        }
        if (!post) {
            throw new NotFoundException('Post not found')
        }
        await this.prismaService.post.delete({
            where: {
                id
            }
        })
    }
}
