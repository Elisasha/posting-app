import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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

}
