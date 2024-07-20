import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthService, saltOrRounds } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    let authService: AuthService;
    let prismaService: PrismaService;

    beforeEach(() => {
        prismaService = new PrismaService();
        authService = new AuthService(prismaService);
    });

    describe('signup', () => {
        it('should throw a ConflictException if user already exists', async () => {
            prismaService.user.findUnique = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', password: 'hashedpassword' });

            await expect(authService.signup({ email: 'test@example.com', password: 'password' }))
                .rejects
                .toThrow(ConflictException);
        });

        it('should create a new user and return a JWT token', async () => {
            prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
            prismaService.user.create = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', password: 'hashedpassword' });
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
            (jwt.sign as jest.Mock).mockReturnValue('jsonwebtoken');

            const token = await authService.signup({ email: 'newuser@example.com', password: 'password' });

            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    email: 'newuser@example.com',
                    password: 'hashedpassword',
                },
            });
            expect(token).toBe('jsonwebtoken');
        });
    });

    describe('login', () => {
        it('should throw an UnauthorizedException if user does not exist', async () => {
            prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

            await expect(authService.login({ email: 'nonexistent@example.com', password: 'password' }))
                .rejects
                .toThrow(UnauthorizedException);
        });

        it('should throw an UnauthorizedException if password is incorrect', async () => {
            prismaService.user.findUnique = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', password: 'hashedpassword' });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(authService.login({ email: 'test@example.com', password: 'wrongpassword' }))
                .rejects
                .toThrow(UnauthorizedException);
        });

        it('should return a JWT token if credentials are correct', async () => {
            prismaService.user.findUnique = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', password: 'hashedpassword' });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('jsonwebtoken');

            const token = await authService.login({ email: 'test@example.com', password: 'password' });

            expect(token).toBe('jsonwebtoken');
        });
    });
});