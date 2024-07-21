import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { Role } from '@prisma/client';

const prismaMock = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockUsers = [
  {
    id: 1,
    email: 'test@test.com',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    posts: [],
  },
  {
    id: 2,
    email: 'test@test.com',
    role: Role.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
    posts: [],
  }
]

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      prismaMock.user.findMany.mockResolvedValue(mockUsers);
      const result = await service.getAllUsers();
      expect(result).toEqual(mockUsers.map(user => new UserResponseDto(user)));
    });
  });

  describe('findUserById', () => {
    it('should return a user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUsers[1]);
      const result = await service.findUserById(1);
      expect(result).toEqual(new UserResponseDto(mockUsers[1]));
    });

    it('should throw NotFoundException if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(service.findUserById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUsers[1]);
      prismaMock.user.update.mockResolvedValue(mockUsers[1]);
      const dto: UpdateUserDto = { email: 'new@test.com' };
      const result = await service.updateUser(1, dto);
      expect(result).toEqual(mockUsers[1]);
    });

    it('should hash the password if provided', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUsers[1]);
      prismaMock.user.update.mockResolvedValue(mockUsers[1]);
      const dto: UpdateUserDto = { password: 'newpassword' };
      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue('hashedpassword');
      await service.updateUser(1, dto);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', expect.any(Number));
    });
  });

  describe('removeUser', () => {
    it('should remove the user and return a success message', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUsers[1]);
      prismaMock.user.delete.mockResolvedValue(mockUsers[1]);
      const result = await service.removeUser(1);
      expect(result).toEqual('Succesfully deleted user 1');
    });
  });
});
