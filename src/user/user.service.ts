import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { saltOrRounds } from './auth/auth.service';


@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    async getAllUsers(): Promise<UserResponseDto[]> {
        const users = await this.prismaService.user.findMany({
            include: {
              posts: true,
            },
          });
        return users.map((user) => new UserResponseDto(user))
    }

    async findUserById(id: number) {
        const user = await this.prismaService.user.findUnique({
            include: {
                posts: true,
              },
            where: {
                id: id
            }
        })
        if (!user) {
            throw new NotFoundException('This user doesn\'t exist')
        }
        return new UserResponseDto(user)
    }

    async updateUser(id: number, dto: UpdateUserDto) {
        const user = await this.findUserById(id)
        if (dto.password) {
            const hashedPassword = await bcrypt.hash(dto.password, saltOrRounds)
            dto.password = hashedPassword
        }
        return this.prismaService.user.update({
            where: { id: user.id },
            data: dto,
        });
    }

    async removeUser(id: number) {
        const user = await this.findUserById(id)
        await this.prismaService.user.delete({
            where: {
                id: user.id
            }
        })
        return `Succesfully deleted user ${id}`
    }
}
