import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostResponseDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
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

    async createPost(dto: CreatePostDto, userId: number) {
        return this.prismaService.post.create({
            data: {
                ...dto,
                userId: userId
            }
        })
    }

    async findPostById(id: number) {
        return this.prismaService.post.findUnique({
            where: {
                id: id
            }
        })
    }

    async updatePost(postId: number, updatePostDto: UpdatePostDto, userId: number) {
        const post = await this.findPostById(postId)
        if (post.userId !== userId) {
            throw new ForbiddenException('You are not allowed to edit this post')
        }

        return this.prismaService.post.update({
            where: { id: postId },
            data: updatePostDto,
        });
    }

    async removePost(id: number, userId: number) {
        const post = await this.findPostById(id)
        if (post.userId !== userId) {
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
