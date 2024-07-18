import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dtos/user-response.dto';


@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    async getAllUsers(): Promise<UserResponseDto[]> {
        const users = await this.prismaService.user.findMany()
        return users.map((user) => new UserResponseDto(user))
    }


    
}
