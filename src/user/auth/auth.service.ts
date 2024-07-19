import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

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
        const hashedPassword = await bcrypt.hash(password, saltOrRounds)

        const user = await this.prismaService.user.create({
            data: {
                email,
                password: hashedPassword,
            }
        })

        return this.generateJWT(user.id)
    }

    async login({ email, password }: Params) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const isValidPasssword = await bcrypt.compare(password, user.password)

        if (!isValidPasssword) {
            throw new UnauthorizedException('Invalid credentials')
        }

        return this.generateJWT(user.id)
    }

    private generateJWT(id: number) {
        return jwt.sign(
            {
                id,
            },
            process.env.JWT_KEY,
            {
                expiresIn: 500000,
            }
        )
    }
}
