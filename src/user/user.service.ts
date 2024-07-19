import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';


@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    async getAllUsers(): Promise<UserResponseDto[]> {
        const users = await this.prismaService.user.findMany()
        return users.map((user) => new UserResponseDto(user))
    }

    async findUserById(id: number) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: id
            }
        })
        if (!user) {
            throw new NotFoundException('This user doesn\'t exist')
        }
        return new UserResponseDto(user)
    }

    async updateUser(userId: number, dto: UpdateUserDto) {
        const user = await this.findUserById(userId)
        const saltOrRounds = 8
        const hashedPassword = await bcrypt.hash(dto.password, saltOrRounds)
        dto.password = hashedPassword
        
        return this.prismaService.user.update({
            where: { id: userId },
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
    }
}
