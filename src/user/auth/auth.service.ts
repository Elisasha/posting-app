import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface Params {
    email: string
    password: string
}

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}
    async signup({ email }: Params) {
        const userExists = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })
    }
}
