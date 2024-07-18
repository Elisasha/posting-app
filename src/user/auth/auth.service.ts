import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

interface Params {
    email: string
    password: string
}

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}
    async signup({ email, password }: Params) {
        const userExists = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if (userExists) {
            throw new ConflictException('User with the provided email already exists')
        }
        const saltOrRounds = 8
        const hashedPassword = await bcrypt.hash(password, 10)

    }
}
